<script setup lang="ts">
import type { PaletteMember } from '@/models/palette';
import { usePaletteStore } from '@/stores/palette';
import { formatCss, getMode, toGamut, type Color, type Mode } from 'culori';
import { computed } from 'vue';

interface DragContext {
  index: number;
  top: number;
  bottom: number;
}

var dragContext: DragContext | null = null;

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
  if(colour) {
    const proportion = ( toCurrentMode(colour)[props.channel] - range.value[0]) / (range.value[1] - range.value[0]);
    return proportion.toLocaleString(undefined, {style: 'percent'});
  } else {
    return '0%';
  }
}

function formatValue(colour?: Color): string {
  if(colour) {
    return toCurrentMode(colour)[props.channel].toLocaleString(undefined, {
      maximumSignificantDigits: 3,
      maximumFractionDigits: 3,
      roundingPriority: 'lessPrecision',
      signDisplay: 'negative'
    });
  } else {
    return "0";
  }
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

function toCurrentMode(colour: Color) : Color;
function toCurrentMode(colour: null | undefined): null;
function toCurrentMode(colour: Color | null | undefined): Color | null;
function toCurrentMode(colour: Color | null | undefined): Color | null  {
  if(!colour) {
    return null;
  }
  if(colour.mode === props.colourSpace) {
    return colour;
  }
  return toGamut(props.colourSpace, colour.mode)(colour);
}

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

function startDragging(event: PointerEvent, index: number) {
  if(event.target instanceof HTMLElement) {
    const parentBounds = event.target.parentElement?.parentElement?.getBoundingClientRect();
    if(parentBounds) {
      event.target.setPointerCapture(event.pointerId);
      dragContext = {
        index: index,
        top: parentBounds?.top,
        bottom: parentBounds?.bottom
      };
    }
  }
}

function stopDragging(event: PointerEvent) {
  if(event.target instanceof HTMLElement) {
    event.target.releasePointerCapture(event.pointerId);
  }
  dragContext = null;
}

function onDrag(event: PointerEvent) {
  if(dragContext) {
    const proportion = 
      Math.max(0, Math.min(1, (event.clientY - dragContext.top) / (dragContext.bottom - dragContext.top)));
    const newValue = range.value[0] + (1 - proportion) * (range.value[1] - range.value[0]);
    const colour = toCurrentMode(getColours()[dragContext.index]?.colour);
    if(colour) {
      colour[props.channel] = newValue;
      const hue = props.axis === 'hues' ? props.hue : dragContext.index;
      const shade = props.axis === 'shades' ? props.shade : dragContext.index;
      paletteStore.setColour(hue, shade, colour);
    }
  }
}

</script>

<template>
  <div class="container">
    <div class="title"><span class="text-big">{{channelName}}</span> <i>vs. other {{seriesName}}s</i></div>
    <div class="slider-set">
      <div v-for="(colour, index) in getColours()" :key="index" class="column">
        <div class="slider" :class="{ 'selected': isSelected(index) }" @click="selectColour(index)">
          <div class="slider-range"></div>
          <div v-if="colour" class="slider-track" :class="{ 'dragging': !!dragContext && dragContext.index === index }"
            :style="{
              '--slider-colour': formatCss(colour.colour),
              'height': calcHeight(colour.colour)
            }">
            <div v-if="isSelected(index)" class="slider-thumb" :style="{
              '--slider-colour': formatCss(colour.colour),
              '--fg-colour': formatCss(paletteStore.fgForColour(colour.colour))
            }" @pointerdown="startDragging($event, index)" @pointerup="stopDragging" @pointermove="onDrag"></div>
          </div>
        </div>
        <div class="align-center">{{ formatValue(colour?.colour) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.container {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.slider-set {
  display: flex;
  flex-direction: row;
  flex: auto;
}

.column {
  height: 100%;
  flex: 1 1 0;
  padding-bottom: 1em;
}

.slider {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
}

.slider-range {
  position: absolute;
  height: 100%;
  width: 100%;
  border-style: solid;
  border-color: var(--theme-border);
  border-width: 1px 0;
}

.slider-track {
  border-style: solid;
  border-color: var(--theme-fg);
  border-width: 1px 0;
  transition: height 150ms;
  background: var(--slider-colour, #f0f);
  width: 100%;
  z-index: 1;
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

.dragging {
  transition-duration: 0ms;
}

</style>