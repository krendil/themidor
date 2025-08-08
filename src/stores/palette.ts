import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { defaultPalette, type PaletteMember, type Palette } from '@/models/palette';
import { converter, oklch, type Color } from 'culori';
import type { Tag } from '@/models/tag';
import { chain, split } from 'lodash';

export const usePaletteStore = defineStore("palette", () => {
  const palette = ref(defaultPalette() as Palette);

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
    () => (tag: Tag | string): PaletteMember | null => {
      if(typeof tag !== 'string') {
        tag = tag.value;
      }
      const tagIndex = palette.value.tags[tag];
      if(!tagIndex) {
        return null;
      } else {
        return getColour.value(...palette.value.tags[tag]);
      }
    }
  );

  const getCurrentColourTags = computed(
    (): Tag[] => {
      return chain( palette.value.tags )
        .toPairs()
        .filter( ([_, [hue, shade]]) => hue == selectedHue.value && shade == selectedShade.value )
        .map( ([key, _]) => {
          const parts = split(key, ':');
          return { namespace: parts[0], value: parts[1] }
        })
        .value();
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
  }
  
  function deleteShade(index: number) {
    palette.value.shades.splice(index, 1);
    for(let row of palette.value.colours) {
      row.splice(index, 1);
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

  function fgForColour(bg?: Color): PaletteMember {
    const currentL = oklch(bg)?.l ?? 0;
    if (currentL <= 0.6) {
      return theme.lightfg;
    } else {
      return theme.darkfg;
    }
  }

  const theme = reactive({
    lightfg: computed( () => getColourByTag.value("tmdr:lightfg") ?? {colour: {mode: 'oklch', l: 1, c: 0, h: 0} as const}),
    darkfg: computed( () => getColourByTag.value("tmdr:darkfg") ?? {colour: {mode: 'oklch', l: 0, c: 0, h: 0} as const}),
    fg: computed( () => getColourByTag.value("tmdr:fg") ?? {colour: {mode: 'oklch', l: 0, c: 0, h: 0} as const}),
    bg: computed( () => getColourByTag.value("tmdr:bg") ?? {colour: {mode: 'oklch', l: 1, c: 0, h: 0} as const}),
    hifg: computed( () => getColourByTag.value("tmdr:hifg") ?? {colour: {mode: 'oklch', l: 0, c: 0, h: 0} as const}),
    hibg: computed( () => getColourByTag.value("tmdr:hibg") ?? {colour: {mode: 'oklch', l: 0.9, c: 0, h: 0} as const}),
    grey: computed( () => getColourByTag.value("tmdr:grey") ?? {colour: {mode: 'oklch', l: 0.5, c: 0, h: 0} as const}),
    border: computed( () => getColourByTag.value("tmdr:border") ?? {colour: {mode: 'oklch', l: 0.5, c: 0, h: 0} as const}),

    currentColourFg: computed( (): PaletteMember => {
      return fgForColour(selectedColour.value?.colour);
    }),

  });

  return {
    addHue,
    addShade,
    colourMode,
    colourModeConverter,
    deleteHue,
    deleteShade,
    fgForColour,
    getColour,
    getColourByTag,
    getCurrentColourTags,
    getNameForColour,
    loadPalette,
    palette,
    selectedHue,
    selectedShade,
    selectedColour,
    selectColour,
    setColour,
    theme
  };
});
