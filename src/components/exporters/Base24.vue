<script setup lang="ts">
import { usePaletteStore } from '@/stores/palette';
import { computed, toRef, type Ref } from 'vue';

import Base24Template from './Base24.liquid?raw';
import BaseExporter from './BaseExporter.vue';
import { makeLiquidEngine } from '@/library/template-utils';
import { slugify } from '@/library/text-utils';
import { oklch } from 'culori';

interface Base24Opts {
    author: string,
    description: string
}

const paletteStore = usePaletteStore();
const engine = makeLiquidEngine(paletteStore);

const opts: Ref<Base24Opts> = toRef(paletteStore.palette.exportOptions, "Base24");

if(opts.value === undefined) {
    opts.value = {
        author: "Anonymous",
        description: "Created with Themidor"
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

const variant = computed(() => {
    const bg = paletteStore.getColourByTag("b24:00")?.colour;
    if( !!bg && oklch(bg).l > 0.5) {
        return "light";
    } else {
        return "dark";
    }
});

const output = computed(() => {
    return engine.parseAndRenderSync(Base24Template, {
        author: opts.value.author,
        description: opts.value.description,
        name: paletteStore.palette.name,
        slug: slugify(paletteStore.palette.name),
        variant: variant.value
    });
});

const filename = computed(() => "base24-" + slugify(paletteStore.palette.name)+".yaml");

</script>

<template>
    <BaseExporter :output :filename :required :recommended>
        <div class="tray">
            Base24 themes can be used to generate colour themes for many different programs. See <a href="https://github.com/tinted-theming/home?tab=readme-ov-file#supported-applications">here</a> for more info.
        </div>
        <div class="tray">
            <label>Author: <input type="text" v-model="opts.author"></input></label>
            <label>Description: <input type="text" v-model="opts.description"></input></label>
        </div>
    </BaseExporter>
</template>

<style lang="css" scoped>
</style>