<script setup lang="ts">
import { usePaletteStore } from '@/stores/palette';
import { computed } from 'vue';

import UrxvtTemplate from './Urxvt.liquid?raw';
import BaseExporter from './BaseExporter.vue';
import { makeLiquidEngine } from '@/library/template-utils';

const paletteStore = usePaletteStore();
const engine = makeLiquidEngine(paletteStore);


const required = [
    "term:0", "term:1", "term:2", "term:3", "term:4", "term:5", "term:6", "term:7",
    "term:8", "term:9", "term:10", "term:11", "term:12", "term:13", "term:14", "term:15"
];

const recommended = [
    "term:bg", "term:fg", "term:cursor", "term:selectionbg"
];

const output = computed(() => {
    return engine.parseAndRenderSync(UrxvtTemplate, {});
});

</script>

<template>
    <BaseExporter :output="output" filename=".Xresources" :required :recommended>
    </BaseExporter>
</template>

<style lang="css" scoped>
</style>