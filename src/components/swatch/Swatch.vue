<script setup lang="ts">
import { usePaletteStore } from '@/stores/palette';
import { computed, reactive } from 'vue';
import SwatchItem from './SwatchItem.vue';
import { formatCss } from 'culori';

const paletteStore = usePaletteStore();
const palette = paletteStore.palette;

const gridStyle = reactive({
  gridTemplateRows: computed(() => `2em repeat(${palette.hues.length}, minmax(2em, 1fr))`),
  gridTemplateColumns: computed(() => `auto repeat(${palette.shades.length}, minmax(3em, 1fr))`)
});

function addShade(event: Event) {
  paletteStore.addShade("New shade");
}

function addHue(event: Event) {
  paletteStore.addHue("New hue");
}

function renameShade(index: number, name: string) {
  paletteStore.palette.shades[index] = name;
}

function renameHue(index: number, name: string) {
  paletteStore.palette.hues[index] = name;
}

</script>


<template>
  <div class="table" :style="gridStyle">

    <div class="row-header column-header"><!--Empty space for top corner--></div>

    <div v-for="(shade, shadeIndex) in palette.shades" class="column-header align-middle colour-transition sticky-top" :class="{ selectedHeader: paletteStore.selectedShade == shadeIndex }">
      <input class="align-center colour-transition invisible"  :value="shade"></input>
    </div>

    <template v-for="(row, hueIndex) in palette.colours">
      <div class="row-header align-middle colour-transition sticky-left" :class="{ selectedHeader: paletteStore.selectedHue == hueIndex }">
        <input class="align-right colour-transition invisible ghost-scale" :value="palette.hues[hueIndex]" @input="renameHue(hueIndex, $event?.target?.value)" size="1"></input>
        <div class="ghost-measure">{{palette.hues[hueIndex]}}</div>
      </div>
      <SwatchItem v-for="(item, shadeIndex) in row" :hue="hueIndex" :shade="shadeIndex" class="colour-transition"></SwatchItem>
    </template>

    <div class="add column-header sticky-top" style="grid-row: 1; grid-column: -1">
      <button @click="addShade">➕</button>
    </div>
    <div style="grid-row: 2 / -1; grid-column: -1"></div>
    <div class="add row-header sticky-left" style="grid-row: -1; grid-column: 1">
      <button @click="addHue">➕</button>
    </div>


  </div>
</template>

<style scoped>

.table {
  display: grid;
  overflow-y: scroll;
  overflow-x: scroll;
}

.row-header {
  position: sticky;
  left: 0;
  background-color: v-bind('formatCss(paletteStore.theme.bg.colour)');
  input,div {
    padding: 0.1em 1em;
  }
}

.column-header {
  position: sticky;
  top: 0;
  background-color: v-bind('formatCss(paletteStore.theme.bg.colour)');

  input,div {
    padding: 0.1em;
  }
}

.selectedHeader {
  color: v-bind('formatCss(paletteStore.theme.hifg.colour)');
  background-color: v-bind('formatCss(paletteStore.theme.hibg.colour)');
}

.add {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ghost-measure {
  visibility: collapse;
  padding-right: 1.2em;
}

.ghost-scale {
  width: 100%;
}

</style>
