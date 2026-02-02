<script setup lang="ts">
import { usePaletteStore } from '@/stores/palette';
import { computed, } from 'vue';

import NoctaliaTemplate from './Noctalia.liquid?raw';
import BaseExporter from './BaseExporter.vue';
import { makeLiquidEngine } from '@/library/template-utils';

const paletteStore = usePaletteStore();
const engine = makeLiquidEngine(paletteStore);

// const opts: Ref<NoctaliaOpts> = toRef(paletteStore.palette.exportOptions, "noctalia");

// if(opts.value === undefined) {
//     opts.value = {
//     };
// }

const required = [
    "noct:dark:primary",
    "noct:dark:onprimary",
    "noct:dark:secondary",
    "noct:dark:onsecondary",
    "noct:dark:tertiary",
    "noct:dark:ontertiary",
    "noct:dark:error",
    "noct:dark:onerror",
    "noct:dark:surface",
    "noct:dark:onsurface",
    "noct:dark:hover",
    "noct:dark:onhover",
    "noct:dark:surfacevariant",
    "noct:dark:onsurfacevariant",
    "noct:dark:outline",
    "noct:dark:shadow",
    "noct:light:primary",
    "noct:light:onprimary",
    "noct:light:secondary",
    "noct:light:onsecondary",
    "noct:light:tertiary",
    "noct:light:ontertiary",
    "noct:light:error",
    "noct:light:onerror",
    "noct:light:surface",
    "noct:light:onsurface",
    "noct:light:hover",
    "noct:light:onhover",
    "noct:light:surfacevariant",
    "noct:light:onsurfacevariant",
    "noct:light:outline",
    "noct:light:shadow",

    "term:bg",
    "term:fg",
    "term:00",
    "term:01",
    "term:02",
    "term:03",
    "term:04",
    "term:05",
    "term:06",
    "term:07",
    "term:08",
    "term:09",
    "term:10",
    "term:11",
    "term:12",
    "term:13",
    "term:14",
    "term:15",
];

const recommended = [
    "term:cursor",
    "term:cursorfg",
    "term:selectionbg",
    "term:selectionfg",

    "term:light:cursor",
    "term:light:cursorfg",
    "term:light:bg",
    "term:light:fg",
    "term:light:00",
    "term:light:01",
    "term:light:02",
    "term:light:03",
    "term:light:04",
    "term:light:05",
    "term:light:06",
    "term:light:07",
    "term:light:08",
    "term:light:09",
    "term:light:10",
    "term:light:11",
    "term:light:12",
    "term:light:13",
    "term:light:14",
    "term:light:15",
    "term:light:selectionbg",
    "term:light:selectionfg",
];

const output = computed(() => {
    return engine.parseAndRenderSync(NoctaliaTemplate, {});
});

const filename = computed(() => `${paletteStore.palette.name}.json`);

</script>

<template>
    <BaseExporter :output :filename :required :recommended>
        <div class="tray">
            Download and save to <span class="monospace">~/.config/noctalia/colorschemes/{{paletteStore.palette.name}}/</span>.
       </div>
    </BaseExporter>
</template>

<style lang="css" scoped>
</style>