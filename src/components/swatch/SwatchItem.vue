<script setup lang="ts">
import { guessNewColour } from '@/library/palette-tools';
import { usePaletteStore } from '@/stores/palette';
import { formatCss } from 'culori';
import { computed } from 'vue';


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
const borderColour = computed(() => formatCss(paletteStore.theme.currentColourFg.colour));

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
    <div v-else class="full" :class="{ selected }" @click="selectColour">
        
    </div>
</template>

<style scope>
.full {
    background-color: v-bind('cssColour');
}

.full.selected {
    border: 4px;
    border-color: v-bind('borderColour');
    border-style: solid;
}

.empty {
    text-align: center;
    align-content: center;

    border-style: dashed;
    border-width: 1px;
    border-color: var(--spate-border);
    border-radius: 4px;
    margin: 2px;
}

.empty:hover {
  background-color: var(--spate-hibg);
}

</style>