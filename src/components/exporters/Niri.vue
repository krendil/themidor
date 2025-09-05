<script setup lang="ts">
import { usePaletteStore } from '@/stores/palette';
import { computed, } from 'vue';

import NiriTemplate from './Niri.liquid?raw';
import BaseExporter from './BaseExporter.vue';
import { makeLiquidEngine } from '@/library/template-utils';
import { slugify } from '@/library/text-utils';

const paletteStore = usePaletteStore();
const engine = makeLiquidEngine(paletteStore);

// const opts: Ref<NiriOpts> = toRef(paletteStore.palette.exportOptions, "niri");

// if(opts.value === undefined) {
//     opts.value = {
//     };
// }

const required = [
    "niri:background",
    "niri:backdrop",
];

const recommended = [
    "niri:border:active",
    "niri:border:inactive",
    "niri:border:urgent",
    "niri:focus:active",
    "niri:focus:inactive",
    "niri:focus:urgent",
    "niri:insert-hint",
    "niri:shadow",
    "niri:shadow:inactive",
    "niri:tab:active",
    "niri:tab:inactive",
    "niri:tab:urgent",
    "niri:workspace-shadow",
];

const output = computed(() => {
    return engine.parseAndRenderSync(NiriTemplate, {});
});

const filename = "config.kdl";

</script>

<template>
    <BaseExporter :output :filename :required :recommended>
        <div class="tray">
            Niri has a lot of other configuration options, and this exporter
            only generates colour settings (and doesn't even support gradients).
            It's recommended to just copy and paste these lines into your
            existing niri config file instead of using the downloaded file.
       </div>
    </BaseExporter>
</template>

<style lang="css" scoped>
</style>