<script setup lang="ts">
import { usePaletteStore } from '@/stores/palette';
import { computed, reactive, useTemplateRef } from 'vue';
import SwatchItem from './SwatchItem.vue';
import ConfirmModal from '../ConfirmModal.vue';
import { onDragLeave } from '@/library/drag-utils';

type Dim = "hue" | "shade";

const paletteStore = usePaletteStore();

const gridStyle = reactive({
  gridTemplateRows: computed(() => `2em repeat(${paletteStore.palette.hues.length}, minmax(2em, 1fr))`),
  gridTemplateColumns: computed(() => `auto repeat(${paletteStore.palette.shades.length}, minmax(3em, 1fr))`)
});

const confirmModal = useTemplateRef("confirmModal");

function addShade(event: Event) {
  paletteStore.addShade("New shade");
}

function addHue(event: Event) {
  paletteStore.addHue("New hue");
}

function deleteHue(hueIndex: number) {
  const hueName = paletteStore.palette.hues[hueIndex];
  confirmModal.value?.showConfirmModal(`Are you sure you want to delete the '${hueName}' hue?`, () => paletteStore.deleteHue(hueIndex) );
}

function deleteShade(shadeIndex: number) {
  const shadeName = paletteStore.palette.shades[shadeIndex];
  confirmModal.value?.showConfirmModal(`Are you sure you want to delete the '${shadeName}' shade?`, () => paletteStore.deleteShade(shadeIndex) );
}

function renameShade(index: number, name: string) {
  paletteStore.palette.shades[index] = name;
}

function renameHue(index: number, name: string) {
  paletteStore.palette.hues[index] = name;
}


function onDragDim(e: DragEvent, dim: Dim, id: number) {
  if(e.dataTransfer) {
    e.dataTransfer.setData("application/" + dim, id.toString());
    e.dataTransfer.effectAllowed = "move";
  }
}

function onDragDimOver(e: DragEvent, dim: Dim, targetId: number) {
  if(e.dataTransfer?.types.includes("application/" + dim)) {
    e.dataTransfer.dropEffect = "move";
    if( e.currentTarget instanceof HTMLElement ) {
      const movingId = Number.parseInt(e.dataTransfer.getData("application/" + dim));
      if(targetId <= movingId) {
        e.currentTarget.classList.add("drag-over-before");
      } else {
        e.currentTarget.classList.add("drag-over-after");
      }
    }
    e.preventDefault();
  }
}

function onDropDim(e: DragEvent, dim: Dim, targetId: number) {
  if(e.dataTransfer?.types.includes("application/" + dim)) {
    const movingId = Number.parseInt(e.dataTransfer.getData("application/" + dim));
    if( dim === "hue" ) {
      paletteStore.moveHue(movingId, targetId);
    } else {
      paletteStore.moveShade(movingId, targetId);
    }
    
  }
  if( e.currentTarget instanceof HTMLElement ) {
    e.currentTarget.classList.remove("drag-over-before");
    e.currentTarget.classList.remove("drag-over-after");
  }
}

</script>


<template>
  <div class="table" :style="gridStyle">

    <div class="row-header column-header"><!--Empty space for top corner--></div>

    <div v-for="(shade, shadeIndex) in paletteStore.palette.shades" class="column-header align-middle colour-transition sticky-top" :class="{ selectedHeader: paletteStore.selectedShade == shadeIndex }"
      @dragover="onDragDimOver($event, 'shade', shadeIndex)" @dragleave="onDragLeave" @drop="onDropDim($event, 'shade', shadeIndex)"
    >
      <span class="grab-handle" draggable="true" @dragstart="onDragDim($event, 'shade', shadeIndex)">⫶</span>
      <input class="align-center colour-transition invisible"  :value="shade" @input="renameShade(shadeIndex, (<any>$event?.target)?.value)" ></input>
      <div class="delete-button colour-transition" @click="deleteShade(shadeIndex)">⨯</div>
    </div>

    <template v-for="(row, hueIndex) in paletteStore.palette.colours">
      <div class="row-header align-middle colour-transition sticky-left" 
        :class="{ selectedHeader: paletteStore.selectedHue == hueIndex }"
        @dragover="onDragDimOver($event, 'hue', hueIndex)" @dragleave="onDragLeave" @drop="onDropDim($event, 'hue', hueIndex)"
      >
        <span class="grab-handle" draggable="true" @dragstart="onDragDim($event, 'hue', hueIndex)">⫶</span>
        <input class="align-right colour-transition invisible ghost-scale" :value="paletteStore.palette.hues[hueIndex]" @input="renameHue(hueIndex, (<any>$event?.target)?.value)" size="1"></input>
        <div class="ghost-measure">{{paletteStore.palette.hues[hueIndex]}}</div>
        <div class="delete-button colour-transition" @click="deleteHue(hueIndex)">⨯</div>
      </div>
      <SwatchItem v-for="(item, shadeIndex) in row" :hue="hueIndex" :shade="shadeIndex" class="colour-transition"></SwatchItem>
    </template>

    <div class="add column-header sticky-top" style="grid-row: 1; grid-column: -1">
      <button @click="addShade" title="Add a new shade (column)">✚</button>
    </div>
    <div style="grid-row: 2 / -1; grid-column: -1"></div>
    <div class="add row-header sticky-left" style="grid-row: -1; grid-column: 1" >
      <button @click="addHue" title="Add a new hue (row)">✚</button>
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
  border-color: var(--theme-fg);

  input {
    padding: 0.1em 1em;
  }
}

.row-header.drag-over-before {
  border-top-width: 2px;
  border-top-style: solid;
}
.row-header.drag-over-after {
  border-bottom-width: 2px;
  border-bottom-style: solid;
}

.column-header.drag-over-before {
  border-left-width: 2px;
  border-left-style: solid;
}
.column-header.drag-over-after {
  border-right-width: 2px;
  border-right-style: solid;
}


.column-header {
  position: sticky;
  top: 0;
  background-color: var(--theme-bg);

  input {
    padding: 0.1em;
  }
}

.grab-handle {
  position:absolute;
  color: var(--theme-border);
  cursor: grab;
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
  clip-path: circle(closest-side);
}

.delete-button:hover {
  background-color: var(--theme-hibg);
  color: var(--theme-hifg);
}

:not(:hover) > .delete-button {
  display: none;
}

</style>
