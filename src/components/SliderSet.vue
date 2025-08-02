<script setup lang="ts">
import type { PaletteMember } from '@/models/palette';
import { usePaletteStore } from '@/stores/palette';
import { formatCss, getMode, type Color, type Mode } from 'culori';
import { computed } from 'vue';

const props = defineProps<{
  channel: string,
  shade: number,
  hue: number,
  axis: 'hues' | 'shades',
  colourSpace: Mode
}>();

const paletteStore = usePaletteStore();

function getColours(): (PaletteMember | null)[] {
  if (props.axis === 'hues') {
    return paletteStore.palette.colours[props.hue];
  } else {
    return paletteStore.palette.colours.map(hue => hue[props.shade]);
  }
}

const range = computed<[number, number]>(() => {
  const definition = getMode(props.colourSpace);
  if( 'ranges' in definition ) {
    return definition.ranges[props.channel];
  } else {
    return [0, 1]; // Default range if not defined
  }
});

function calcHeight(colour: Color): string {
  const proportion = (colour[props.channel] - range.value[0]) / (range.value[1] - range.value[0]);
  return proportion.toLocaleString(undefined, {style: 'percent'});
}

const fullNames = {
  'h': 'Hue',
  'c': 'Chroma',
  'l': 'Luminance',
  's': 'Saturation',
  'v': 'Value',
  'r': 'Red',
  'g': 'Green',
  'b': 'Blue'
}

const channelName = computed( () => {
  return fullNames[props.channel];
});

const seriesName = computed( () => {
  if(props.axis == 'hues') {
    return paletteStore.palette.hues[props.hue];
  } else {
    return paletteStore.palette.shades[props.shade];
  }
});

function isSelected(i: number): boolean {
  if(props.axis == 'hues') {
    return i == props.shade;
  } else {
    return i == props.hue;
  }
}

function selectColour(i: number) {
  if(props.axis == 'hues') {
    paletteStore.selectColour(props.hue, i);
  } else {
    paletteStore.selectColour(i, props.shade);
  }
}

</script>

<template>
  <div class="container">
    <div class="title">{{channelName}} vs. other {{seriesName}}s</div>
    <div class="slider-set">
      <div v-for="(colour, index) in getColours()" :key="index" class="slider"
        :class="{'selected': isSelected(index)}"
        @click="selectColour(index)"
      >
        <div v-if="colour"
          class="slider-track"
          :style="{
            '--slider-colour': formatCss(colour.colour),
            'height': calcHeight(colour.colour)
            }"
        >
            <div v-if="isSelected(index)" class="slider-thumb" :style="{
              '--slider-colour': formatCss(colour.colour),
              '--fg-colour': formatCss(paletteStore.fgForColour(colour.colour).colour)
            }" ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.container {
  display: flex;
  flex-direction: column;
}

.slider-set {
  display: flex;
  flex-direction: row;
  margin-top: 12px;
  margin-bottom: 12px;
  flex: auto;
}

.slider {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  flex: 1 1 0;
}

.slider-track {
  border-style: solid;
  border-color: v-bind('formatCss(paletteStore.theme.fg.colour)');
  border-width: 1px 0;
  transition: height 150ms;
  background: var(--slider-colour, #f0f);
  width: 100%;
}

.slider-thumb {
  border: 2px solid var(--fg-colour, #000);
  height: 22px;
  width: 22px;
  border-radius: 12px;
  position: relative;
  top: -12px;
  margin-left: auto;
  margin-right: auto;

  background: var(--slider-colour, #f0f);
  cursor: pointer;
}

</style>