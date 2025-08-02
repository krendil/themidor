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

const range = computed(() => {
  const definition = getMode(props.colourSpace);
  if( 'ranges' in definition ) {
    return definition.ranges[props.channel];
  } else {
    return [0, 1]; // Default range if not defined
  }
});

</script>

<template>
  <div class="slider-set">
    <div v-for="(colour, index) in getColours()" :key="index" class="slider">
      <input v-if="colour"
        type="range" :min="range[0]" :max="range[1]" v-model="colour.colour[props.channel]"
        step="0.001" orient="vertical"
        class="colour-transition"
        :style="{ '--slider-colour': formatCss(colour.colour) }"
        />
    </div>
  </div>
</template>

<style scoped>

.slider-set {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}

.slider {
  writing-mode: vertical-rl;
  direction: rtl;
}

input[type=range] {
  border-style: none;
  transition: all 150ms;
}

 /* Special styling for WebKit/Blink */
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  border: 2px solid #000000;
  height: 16px;
  width: 16px;
  border-radius: 10px;
  background: var(--slider-colour, #f0f);
  cursor: pointer;
  margin-top: -14px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
}

/* All the same stuff for Firefox */
input[type=range]::-moz-range-thumb {
  border: 2px solid #000000;
  height: 16px;
  width: 16px;
  border-radius: 10px;
  background: var(--slider-colour, #f0f);
  cursor: pointer;
  margin-top: -14px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
    transition-property: all;
    transition-duration: 1500ms;
}

input[type=range]::-moz-range-progress {
  background-color: var(--slider-colour, #f0f);
  width: 20px;
    transition-property: all;
    transition-duration: 1500ms;
}
</style>