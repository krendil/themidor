<script setup lang="ts">
import { usePaletteStore } from '@/stores/palette';
import { reactive } from 'vue';
import SwatchItem from './SwatchItem.vue';
import { formatCss } from 'culori';

const paletteStore = usePaletteStore();
const palette = paletteStore.palette;

const gridStyle = reactive({
  gridTemplateRows: `repeat(${palette.hues.length + 1}, 1fr)`,
  gridTemplateColumns: `repeat(${palette.shades.length + 1}, 1fr)`
});

</script>


<template>
  <div class="table" :style="gridStyle">

    <div class="header"><!--Empty space for top corner--></div>

    <div v-for="(shade, shadeIndex) in palette.shades" class="header align-center align-middle colour-transition" :class="{ selected: paletteStore.selectedShade == shadeIndex }">{{ shade }}</div>

    <template v-for="(row, hueIndex) in palette.colours">
      <div class="header align-right align-middle colour-transition" :class="{ selected: paletteStore.selectedHue == hueIndex }">{{palette.hues[hueIndex]}}</div>
      <SwatchItem v-for="(item, shadeIndex) in row" :hue="hueIndex" :shade="shadeIndex" class="colour-transition"></SwatchItem>
    </template>

  </div>
</template>

<style scoped>

.table {
  display: grid;
}

.header {
  padding: 0.1em 1em;
}

.header.selected {
  color: v-bind('formatCss(paletteStore.theme.hifg.colour)');
  background-color: v-bind('formatCss(paletteStore.theme.hibg.colour)');
}

</style>
