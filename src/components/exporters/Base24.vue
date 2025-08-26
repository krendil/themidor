<script setup lang="ts">
import { usePaletteStore } from '@/stores/palette';
import { computed, toRef, type Ref } from 'vue';

import Base24Template from './Base24.liquid?raw';
import BaseExporter from './BaseExporter.vue';
import { makeLiquidEngine } from '@/library/template-utils';
import { slugify } from '@/library/text-utils';

interface Base24Opts {
    author: string
}

const paletteStore = usePaletteStore();
const engine = makeLiquidEngine(paletteStore);

const opts: Ref<Base24Opts> = toRef(paletteStore.palette.exportOptions, "Base24");

if(opts.value === undefined) {
    opts.value = {
        author: "Anonymous"
    };
}

const required = [
    "b24:00", "b24:01", "b24:02", "b24:03",
    "b24:04", "b24:05", "b24:06", "b24:07",
    "b24:08", "b24:09", "b24:0A", "b24:0B",
    "b24:0C", "b24:0D", "b24:0E", "b24:0F",
    "b24:10", "b24:11", "b24:12", "b24:13",
    "b24:14", "b24:15", "b24:16", "b24:17",
];

const recommended = [
];

const output = computed(() => {
    return engine.parseAndRenderSync(Base24Template, {
        author: opts.value.author,
        name: paletteStore.palette.name
    });
});

</script>

<template>
    <BaseExporter :output="output" :filename="slugify(paletteStore.palette.name)+'.yaml'" :required :recommended>
        <div class="tray">
            <label>Author: <input type="text" v-model="opts.author"></input></label>
        </div>
    </BaseExporter>
</template>

<style lang="css" scoped>
</style>