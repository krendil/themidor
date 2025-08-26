import type { Palette } from "@/models/palette";
import { differenceEuclidean, oklch, type Color } from "culori";
import { chain, mean, } from "lodash-es";

export function guessNewColour(palette: Palette, hue: number, shade: number): Color {
  // Lightness is mean lightness of other hues of that shade
  let l = chain(palette.colours)
    .map( row => row[shade] )
    .filter( pm => pm !== null )
    .map( pm => oklch(pm.colour).l )
    .mean()
    .value();
  
  // Chroma is mean chroma of other shades of that hue
  // Hue is mean hue of other shades of that hue
  let [ c, h ] = chain(palette.colours[hue])
    .filter( pm => pm !== null )
    .map( pm => {
      const ok = oklch(pm.colour);
      return [ ok.c, ok.h];
    })
    .unzip()
    .map( x => mean(x) )
    .value();

  if( isNaN(l) ) {
    // Lightness fallback: look for the biggest gap in shades of the hue
    let ls = chain(palette.colours[hue])
      .filter( pm => pm !== null )
      .map( pm => oklch(pm.colour).l )
      .sort((a, b) => a - b)
      .value();

    l = midpointOfBiggestGap(ls, 1, false);
  }
  if( isNaN(c) ) {
    // Chroma fallback: average chroma for hues of the shade
    c = chain(palette.colours)
      .map( row => row[shade] )
      .filter( pm => pm !== null )
      .map( pm => oklch(pm.colour).c )
      .mean()
      .value();
  }
  if( isNaN(h) ) {
    // Hue fallback: look for the biggest gap in hues of the shade
    const hs = chain(palette.colours)
      .map( row => row[shade] )
      .filter( pm => pm !== null )
      .map( pm => oklch(pm.colour).h ?? 0 )
      .sort((a, b) => a - b)
      .value();
    h = midpointOfBiggestGap(hs, 360, true);
  }
  return {mode: 'oklch', l, c, h };
}

export function midpointOfBiggestGap(values: number[], maxValue: number, circular = false): number {
  let first = 0;
  if(circular) {
    first = values[values.length-1] - maxValue;
  }
  let previous = first;
  let next = first;
  let biggestGap = 0;
  let gapIndex = 0;

  for(let i = 0; i < values.length; i++) {
    const gap = values[i] - previous;
    if(gap > biggestGap) {
      biggestGap = gap;
      gapIndex = i;
    }
    previous = values[i];
  }
  const gap = maxValue - previous;
  if(gap > biggestGap) {
    next = maxValue;
    // previous is already the correct value
  } else {
    next = values[gapIndex];
    previous = gapIndex == 0 ? first : values[gapIndex - 1];
  }

  const midpoint = (next + previous) / 2;
  if(midpoint < 0 && circular) {
    return midpoint + maxValue;
  } else {
    return midpoint;
  }
}

export function shadeUpFrom(palette: Palette, tag: string): [number, number] | null {
  const hs = palette.tags[tag];
  if(hs) {
    if(hs[1] + 1 < palette.shades.length) {
      return [hs[0], hs[1] + 1];
    }
  }
  return null;
}

export function closestTo(palette: Palette, target: string): [number, number] | null {
  const diffOklch = differenceEuclidean('oklch');
  const targetColour = oklch(target);
  if(!targetColour) {
    return null;
  }
  var minHue, minShade, minDist = Number.POSITIVE_INFINITY;
  for(var h = 0; h < palette.hues.length; h++) {
    for(var s = 0; s < palette.shades.length; s++) {
      const m = palette.colours[h][s];
      if(m) {
        const dist = diffOklch(m.colour, targetColour)
        if(dist < minDist) {
          minDist = dist;
          minHue = h;
          minShade = s;
        }
      }
    }
  }
  return [minHue, minShade];
}