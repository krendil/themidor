<script setup lang="ts">
import { usePaletteStore } from '@/stores/palette';
import { computed } from 'vue';

import GhosttyTemplate from './Ghostty.liquid?raw';
import BaseExporter from './BaseExporter.vue';
import { makeLiquidEngine } from '@/library/template-utils';
import { slugify } from '@/library/text-utils';

const paletteStore = usePaletteStore();
const engine = makeLiquidEngine(paletteStore);


const required = [
    "term:00", "term:01", "term:02", "term:03", "term:04", "term:05", "term:06", "term:07",
    "term:08", "term:09", "term:10", "term:11", "term:12", "term:13", "term:14", "term:15"
];

const recommended = [
    "term:bg", "term:fg", "term:cursor", "term:cursorfg", "term:selectionbg", "term:selectionfg"
];

const output = computed(() => {
    return engine.parseAndRenderSync(GhosttyTemplate, {});
});

</script>

<template>
    <BaseExporter :output="output" :filename="slugify(paletteStore.palette.name)" :required :recommended>
    </BaseExporter>
</template>

<style lang="css" scoped>
</style>