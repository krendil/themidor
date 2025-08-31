<script setup lang="ts">
import { usePaletteStore } from '@/stores/palette';
import { computed, } from 'vue';

import DunstTemplate from './Dunst.liquid?raw';
import BaseExporter from './BaseExporter.vue';
import { makeLiquidEngine } from '@/library/template-utils';

const paletteStore = usePaletteStore();
const engine = makeLiquidEngine(paletteStore);

// const opts: Ref<DunstOpts> = toRef(paletteStore.palette.exportOptions, "Dunst");

// if(opts.value === undefined) {
//     opts.value = {
//     };
// }

const required = [
    "dunst:low:bg", "dunst:low:fg", "dunst:low:frame",
    "dunst:normal:bg", "dunst:normal:fg", "dunst:normal:frame",
    "dunst:urgent:bg", "dunst:urgent:fg", "dunst:urgent:frame",
];

const recommended = [
];

const output = computed(() => {
    return engine.parseAndRenderSync(DunstTemplate, {});
});

</script>

<template>
    <BaseExporter :output="output" filename="dunstrc" :required :recommended>
        <div class="tray">
            Dunst has a lot of other configuration options, and this exporter
            only generates the colour options.  It's recommended to just copy
            and paste these lines into your existing dunstrc file instead of
            using the downloaded file.
        </div>
    </BaseExporter>
</template>

<style lang="css" scoped>
</style>