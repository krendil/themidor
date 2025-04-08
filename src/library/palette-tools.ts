import type { Palette } from "@/models/palette";
import { oklch, type Color } from "culori";
import { chain, mean, nth } from "lodash";

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
    l = Math.random();
  }
  if( isNaN(c) ) {
    // Min and max chroma varies depending on hue and lightness. True max is ~0.4, but 0.3 is practical max
    c = Math.random() * 0.3;
  }
  if( isNaN(h) ) {
    h = Math.random() * 360;
  }
  return {mode: 'oklch', l, c, h };
}