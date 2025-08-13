<script setup lang="ts">
import { usePaletteStore } from '@/stores/palette';
import { computed, reactive, useTemplateRef } from 'vue';
import SwatchItem from './SwatchItem.vue';
import ConfirmModal from '../ConfirmModal.vue';

const paletteStore = usePaletteStore();
const palette = paletteStore.palette;

const gridStyle = reactive({
  gridTemplateRows: computed(() => `2em repeat(${palette.hues.length}, minmax(2em, 1fr))`),
  gridTemplateColumns: computed(() => `auto repeat(${palette.shades.length}, minmax(3em, 1fr))`)
});

const confirmModal = useTemplateRef("confirmModal");

function addShade(event: Event) {
  paletteStore.addShade("New shade");
}

function addHue(event: Event) {
  paletteStore.addHue("New hue");
}

function deleteHue(hueIndex: number) {
  const hueName = palette.hues[hueIndex];
  confirmModal.value?.showConfirmModal(`Are you sure you want to delete the '${hueName}' hue?`, () => paletteStore.deleteHue(hueIndex) );
}

function deleteShade(shadeIndex: number) {
  const shadeName = palette.shades[shadeIndex];
  confirmModal.value?.showConfirmModal(`Are you sure you want to delete the '${shadeName}' shade?`, () => paletteStore.deleteShade(shadeIndex) );
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
      <input class="align-center colour-transition invisible"  :value="shade" @input="renameShade(shadeIndex, $event?.target?.value)" ></input>
      <div class="delete-button" @click="deleteShade(shadeIndex)">⨯</div>
    </div>

    <template v-for="(row, hueIndex) in palette.colours">
      <div class="row-header align-middle colour-transition sticky-left" :class="{ selectedHeader: paletteStore.selectedHue == hueIndex }">
        <input class="align-right colour-transition invisible ghost-scale" :value="palette.hues[hueIndex]" @input="renameHue(hueIndex, $event?.target?.value)" size="1"></input>
        <div class="ghost-measure">{{palette.hues[hueIndex]}}</div>
        <div class="delete-button" @click="deleteHue(hueIndex)">⨯</div>
      </div>
      <SwatchItem v-for="(item, shadeIndex) in row" :hue="hueIndex" :shade="shadeIndex" class="colour-transition"></SwatchItem>
    </template>

    <div class="add column-header sticky-top" style="grid-row: 1; grid-column: -1">
      <button @click="addShade">✚</button>
    </div>
    <div style="grid-row: 2 / -1; grid-column: -1"></div>
    <div class="add row-header sticky-left" style="grid-row: -1; grid-column: 1">
      <button @click="addHue">✚</button>
    </div>
  </div>

  <ConfirmModal ref="confirmModal"></ConfirmModal>
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
  background-color: var(--theme-bg);
  input {
    padding: 0.1em 1em;
  }
}

.column-header {
  position: sticky;
  top: 0;
  background-color: var(--theme-bg);

  input {
    padding: 0.1em;
  }
}

.selectedHeader {
  color: var(--theme-hifg);
  background-color: var(--theme-hibg);
}

.add {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ghost-measure {
  visibility: collapse;
  padding: 0.1em 1.2em 0.1em 1em;
}

.ghost-scale {
  width: 100%;
}


.delete-button {
  position: absolute;
  top: 2px;
  right: 2px;
  font-size: smaller;
  cursor: pointer;
  padding: 1px;
}

.delete-button:hover {
  background-color: var(--theme-hibg);
  clip-path: circle(closest-side);
}

:not(:hover) > .delete-button {
  display: none;
}

</style>
