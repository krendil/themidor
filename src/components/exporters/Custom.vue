<script setup lang="ts">
import { usePaletteStore } from '@/stores/palette';
import { computed, ref, toRef, type Ref } from 'vue';

import DefaultTemplate from './Custom.liquid?raw';

import BaseExporter from './BaseExporter.vue';
import { makeLiquidEngine } from '@/library/template-utils';
import { slugify } from '@/library/text-utils';

interface CustomOpts {
    template: string
}

const paletteStore = usePaletteStore();
const engine = makeLiquidEngine(paletteStore);

const opts = toRef(paletteStore.palette.exportOptions["Custom"]);

const templateString = computed( () => (<CustomOpts>opts.value).template );

if(opts.value === undefined) {
    opts.value = {
        template: DefaultTemplate
    };
}

const required = [ ];

const recommended = [ ];

const output = computed(() => {
    return engine.parseAndRenderSync(templateString.value, {});
});

</script>

<template>
    <BaseExporter :output="output" :filename="slugify(paletteStore.palette.name) + '.txt'" :required :recommended>
        <textarea class="custom-template tray monospace" v-model="opts.template" spellcheck="false"></textarea>
    </BaseExporter>
</template>

<style lang="css" scoped>

.custom-template {
    width: 100%;
    flex-grow: 1;
    flex-basis: 50%;

    color: var(--theme-fg);
    background-color: var(--theme-bg);
    resize: none;
    white-space: pre;
}

</style>