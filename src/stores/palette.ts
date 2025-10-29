import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { defaultPalette, type PaletteMember, type Palette } from '@/models/palette';
import { converter, oklch, type Color } from 'culori';
import { entries, filter, map, pipe, split } from 'remeda';
import { useOptions } from './options';
import { moveInArray } from '@/library/array-utils';
import { useRefHistory } from '@vueuse/core';

export const usePaletteStore = defineStore("palette", () => {
  const options = useOptions();

  const palette = ref(defaultPalette() as Palette)

  const history = useRefHistory(palette,
    { capacity: 16, deep: true,
      parse: (pal) => {
        if(selectedHue.value >= pal.hues.length) {
          selectedHue.value = 0;
        }
        if(selectedShade.value >= pal.shades.length) {
          selectedShade.value = 0;
        }
        if( !pal.colours[selectedHue.value][selectedShade.value] ) {
          selectedHue.value = 0;
          selectedShade.value = 0;
        }
        return pal;
      }
     }
  );

  const selectedHue = ref(0);
  const selectedShade = ref(0);

  const colourMode = ref(<'oklch'>'oklch');

  const colourModeConverter = computed(() => converter(colourMode.value));

  const selectedColour = computed(
    () => palette.value.colours[selectedHue.value][selectedShade.value],
  );

  const getColour = computed(
    () => (hue: number, shade: number) => palette.value.colours[hue][shade]
  );

  const getColourByTag = computed(
    () => (tag: string): PaletteMember | null => {
      const tagIndex = palette.value.tags[tag];
      if(!tagIndex) {
        return null;
      } else {
        return getColour.value(...tagIndex);
      }
    }
  );

  const getCurrentColourTags = computed(
    (): string[] => {
      return pipe( palette.value.tags,
        entries(),
        filter( ([_, hs]) => !!hs && hs[0] == selectedHue.value && hs[1] == selectedShade.value ),
        map( ([key, _]) => key),
      );
    }
  );

  function getNameForColour(hue: number, shade: number): string {
    const givenName = palette.value?.colours[hue][shade]?.name;
    if(!givenName) {
      return palette.value.shades[shade] + ' ' + palette.value.hues[hue];
    } else {
      return givenName;
    }
  }

  function loadPalette(newPalette: Palette) {
    palette.value = newPalette;
    if(selectedHue.value >= newPalette.hues.length) {
      selectedHue.value = 0;
    }
    if(selectedShade.value >= newPalette.shades.length) {
      selectedShade.value = 0;
    }
  }

  function addHue(name: string, location?: number) {
    palette.value.hues.splice(location ?? palette.value.hues.length, 0, name);
    const newColours = Array<PaletteMember | null>(
      palette.value.shades.length
    ).fill(null);
    palette.value.colours.splice(
      location ?? palette.value.hues.length,
      0,
      newColours
    );
  }

  function addShade(name: string, location?: number) {
    palette.value.shades.splice(
      location ?? palette.value.shades.length,
      0,
      name
    );
    for (let row of palette.value.colours) {
      row.splice(location ?? row.length, 0, null);
    }
  }

  function deleteHue(index: number) {
    palette.value.hues.splice(index, 1);
    palette.value.colours.splice(index, 1);
    if(selectedHue.value >= palette.value.hues.length) {
      selectedHue.value = palette.value.hues.length - 1;
    }
    for(var tag in palette.value.tags) {
      const coords = palette.value.tags[tag]
      if(!coords) {
        // Tag is unassigned, ignore
        continue;
      }
      else if(coords[0] == index) {
        // Tag points to deleted hue, unassign the tag
        palette.value.tags[tag] = null;
      } else if(coords[0] > index) {
        // Tag points past the deleted hue, fix up the index
        palette.value.tags[tag] = [coords[0]-1, coords[1]];
      }
    }
  }
  
  function deleteShade(index: number) {
    palette.value.shades.splice(index, 1);
    for(let row of palette.value.colours) {
      row.splice(index, 1);
    }
    if(selectedShade.value >= palette.value.shades.length) {
      selectedShade.value = palette.value.shades.length - 1;
    }
    for(var tag in palette.value.tags) {
      const coords = palette.value.tags[tag]
      if(!coords) {
        // Tag is unassigned, ignore
        continue;
      }
      else if(coords[1] == index) {
        // Tag points to deleted shade, unassign the tag
        palette.value.tags[tag] = null;
      } else if(coords[1] > index) {
        // Tag points past the deleted shade, fix up the index
        palette.value.tags[tag] = [coords[0], coords[1]-1];
      }
    }
  }

  function moveHue(fromIndex: number, toIndex: number) {
    moveInArray(palette.value.hues, fromIndex, toIndex);
    moveInArray(palette.value.colours, fromIndex, toIndex);
    for( var tag in palette.value.tags) {
      const coords = palette.value.tags[tag]
      if( coords === null) {
        // Tag is unassigned, skip
        continue;
      } else if( coords[0] == fromIndex ) {
        // Tag is for moved hue, move to new index
        coords[0] = toIndex;
      } else if( coords[0] > fromIndex && coords[0] <= toIndex ) {
        // Hue got moved after this one, bump backwards
        coords[0] -= 1;
      } else if( coords[0] < fromIndex && coords[0] >= toIndex ) {
        // Hue got moved before this one, bump forwards
        coords[0] += 1;
      }
    }
  }

  function moveShade(fromIndex: number, toIndex: number) {
    moveInArray(palette.value.shades, fromIndex, toIndex);
    for( var row of palette.value.colours) {
      moveInArray(row, fromIndex, toIndex);
    }

    for( var tag in palette.value.tags) {
      const coords = palette.value.tags[tag]
      if( coords === null) {
        // Tag is unassigned, skip
        continue;
      } else if( coords[1] == fromIndex ) {
        // Tag is for moved shade, move to new index
        coords[1] = toIndex;
      } else if( coords[1] > fromIndex && coords[1] <= toIndex ) {
        // Shade got moved after this one, bump backwards
        coords[1] -= 1;
      } else if( coords[1] < fromIndex && coords[1] >= toIndex ) {
        // Shade got moved before this one, bump forwards
        coords[1] += 1;
      }
    }
  }


  function selectColour(hue: number, shade: number) {
    selectedHue.value = hue;
    selectedShade.value = shade;
  }

  function setColour(hue: number, shade: number, colour: Color) {
    const member = palette.value.colours[hue][shade];
    if (member != null) {
      member.colour = colour;
    } else {
      const newMember: PaletteMember = {
        colour,
      };
      palette.value.colours[hue][shade] = newMember;
    }
  }

  function fgForColour(bg?: Color): Color {
    const currentL = oklch(bg)?.l ?? 0;
    if (currentL <= 0.6) {
      return getThemeColour('lightfg');
    } else {
      return getThemeColour('darkfg');
    }
  }

  const currentColourFg = computed( (): Color => {
    return fgForColour(selectedColour.value?.colour);
  });

  const themeFallbacks = {
    lightfg: {mode: 'oklch', l: 1, c: 0, h: 0} as const,
    darkfg: {mode: 'oklch', l: 0.3, c: 0, h: 0} as const,
    fg: {mode: 'oklch', l: 0.3, c: 0, h: 0} as const,
    bg: {mode: 'oklch', l: 1, c: 0, h: 0} as const,
    hifg: {mode: 'oklch', l: 0, c: 0, h: 0} as const,
    hibg: {mode: 'oklch', l: 0.9, c: 0, h: 0} as const,
    grey: {mode: 'oklch', l: 0.7, c: 0, h: 0} as const,
    border: {mode: 'oklch', l: 0.7, c: 0, h: 0} as const,
    bad: {mode: 'oklch', l: 0.5, c: 0.3, h: 30} as const,
    good: {mode: 'oklch', l: 0.5, c: 0.3, h: 120} as const,
  };

  function getThemeColour(colour: keyof typeof themeFallbacks): Color {
    if(options.dynamicTheming) {
      return getColourByTag.value("tmdr:" + colour)?.colour ?? themeFallbacks[colour];
    } else {
      return themeFallbacks[colour];
    }
  }

  function $reset() {
    palette.value = defaultPalette();
    history.clear();
    selectedHue.value = 0;
    selectedShade.value = 0;
  }

  return {
    addHue,
    addShade,
    colourMode,
    colourModeConverter,
    currentColourFg,
    deleteHue,
    deleteShade,
    fgForColour,
    getColour,
    getColourByTag,
    getCurrentColourTags,
    getNameForColour,
    getThemeColour,
    history,
    loadPalette,
    moveHue,
    moveShade,
    palette,
    selectColour,
    selectedColour,
    selectedHue,
    selectedShade,
    setColour,
    themeFallbacks,
    $reset
  };
}, {
  persist: {
    afterHydrate: (context) => {
      context.store["history"].clear();
    }
  }
});
