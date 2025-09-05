<script setup lang="ts">
import { usePaletteStore } from '@/stores/palette';
import { computed, reactive, ref, toRef } from 'vue';
import { formatCss, wcagContrast, type Color } from 'culori';
import { useOptions } from '@/stores/options';

const paletteStore = usePaletteStore();
const options = useOptions();

const asForeground = toRef(options.contrast, 'asForeground');

const gridStyle = reactive({
  gridTemplateRows: computed(() => `repeat(${paletteStore.palette.hues.length}, 1fr)`),
  gridTemplateColumns: computed(() => `repeat(${paletteStore.palette.shades.length}, 1fr)`)
});

const colours = computed(() => {
  return paletteStore.palette.colours.flatMap(
    (hue, hueIndex) => hue.map((shade, shadeIndex) => {
      if(!shade) {
        return null;
      } else {
        return {
          colour: shade?.colour,
          name: paletteStore.getNameForColour(hueIndex, shadeIndex),
          contrast: calcRatio(shade.colour),
          rating: calcRating(shade.colour),
        };
      }
    })
  );
});

function calcRatio(colour: Color): string {
  if (!paletteStore.selectedColour) {
    return '';
  }
  const contrast = wcagContrast(colour, paletteStore.selectedColour?.colour);
  return `${contrast.toFixed(2)}`;
}

function calcRating(colour: Color): string {
  if (!paletteStore.selectedColour) {
    return '';
  }
  const contrast = wcagContrast(colour, paletteStore.selectedColour?.colour);
  if (contrast < 3) {
    return 'Fail';
  } else if (contrast < 4.5) {
    return 'B';
  } else if (contrast < 7) {
    return 'AA';
  } else {
    return 'AAA';
  }
}

</script>

<template>
  <div id="contrast-view" class="align-right">
    <select v-model="asForeground">
      <option :value="true">As foreground</option>
      <option :value="false">As background</option>
    </select>
    <div id="tile-grid" :style="gridStyle">
        <div v-for="colour in colours">

          <div class="tile align-center"
            v-if="colour"
          >
            <div class="swatch colour-transition" :style="{
              color: formatCss(asForeground ? paletteStore.selectedColour?.colour : colour.colour),
              backgroundColor: formatCss( asForeground ? colour.colour : paletteStore.selectedColour?.colour)
            }" >
              <div class="text-bigger">Test</div>
              <div>{{ colour.name }}</div>
            </div>
            <div class="contrast-info">
              <div class="text-big">{{ colour.contrast }}</div>
              <div>{{ colour.rating }}</div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<style scoped>

#contrast-view {
  padding: 0.5rem;
}

#tile-grid {
  display: grid;
  gap: 0.5rem;
  padding: 0.5rem;

  text-align: right;
}

.tile {
  display: flex;
}

.swatch {
  padding: 0.5rem;
  flex: 2 1 0;
}

.contrast-info {
  padding: 0.5rem;
  flex: 1 1 0;
}

</style>