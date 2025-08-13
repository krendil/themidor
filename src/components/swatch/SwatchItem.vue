<script setup lang="ts">
import { guessNewColour } from '@/library/palette-tools';
import { usePaletteStore } from '@/stores/palette';
import { formatCss } from 'culori';
import { computed } from 'vue';
import { onDragLeave, onDragOver, onDrop } from '@/library/drag-utils';


const props = defineProps({
    hue: {
        type: Number,
        required: true
    },
    shade: {
        type: Number,
        required: true
    }
});

const paletteStore = usePaletteStore();
const paletteItem = computed(() => paletteStore.getColour(props.hue, props.shade));
const cssColour = computed(() => formatCss(paletteItem.value?.colour));
const borderColour = computed(() => formatCss(paletteStore.fgForColour(paletteItem.value?.colour)));

const selected = computed(() => paletteStore.selectedHue == props.hue && paletteStore.selectedShade == props.shade);

function createColour() {
    paletteStore.setColour(props.hue, props.shade, guessNewColour(paletteStore.palette, props.hue, props.shade));
}

function selectColour() {
    paletteStore.selectColour(props.hue, props.shade);
}

</script>


<template>
    <div v-if="paletteItem === null" class="empty" @click="createColour">
        ➕
    </div>
    <div v-else class="full" :class="{ selected }" @click="selectColour"
        @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDrop($event, paletteStore, [ props.hue, props.shade] )"
    >
        
    </div>
</template>

<style scope>
.full {
    background-color: v-bind('cssColour');
    border-width: 0;
    /* Selection border should appear gradually but disappear instantly */
    border-style: none;

    border-color: v-bind('borderColour');
    transition-property: color,border-colour,background-color,border-width;
    transition-duration: 150ms;
}

.full.selected {
    border-style: solid;
    border-width: 4px;
}

.full.drag-over {
    border-style: solid;
    border-width: 4px;
}

.empty {
    text-align: center;
    align-content: center;

    border-style: dashed;
    border-width: 1px;
    border-color: var(--theme-border);
    border-radius: 4px;
    margin: 2px;
}

.empty:hover {
  background-color: var(--theme-hibg);
}

</style>