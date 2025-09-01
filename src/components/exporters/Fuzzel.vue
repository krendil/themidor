<script setup lang="ts">
import { usePaletteStore } from '@/stores/palette';
import { computed, } from 'vue';

import FuzzelTemplate from './Fuzzel.liquid?raw';
import BaseExporter from './BaseExporter.vue';
import { makeLiquidEngine } from '@/library/template-utils';
import { slugify } from '@/library/text-utils';

const paletteStore = usePaletteStore();
const engine = makeLiquidEngine(paletteStore);

// const opts: Ref<FuzzelOpts> = toRef(paletteStore.palette.exportOptions, "fuzzel");

// if(opts.value === undefined) {
//     opts.value = {
//     };
// }

const required = [
    "fuzzel:background",
    "fuzzel:text",
    "fuzzel:prompt",
    "fuzzel:placeholder",
    "fuzzel:input",
    "fuzzel:match",
    "fuzzel:selection",
    "fuzzel:selection-text",
    "fuzzel:selection-match",
    "fuzzel:counter",
    "fuzzel:border",
];

const recommended = [
];

const output = computed(() => {
    return engine.parseAndRenderSync(FuzzelTemplate, {});
});

const filename = computed(
    () => "fuzzel-" + slugify(paletteStore.palette.name) + ".ini"
);

</script>

<template>
    <BaseExporter :output="output" :filename :required :recommended>
        <div class="tray">
            Fuzzel has a lot of other configuration options, and this exporter
            only generates the color section. You can either copy and paste this
            into your fuzzel.ini file, or import the downloaded file into your
            config with the <code>include</code> directive. E.g.
            <code>include = ~/.config/fuzzel/{{ filename }}</code>.
       </div>
    </BaseExporter>
</template>

<style lang="css" scoped>
</style>