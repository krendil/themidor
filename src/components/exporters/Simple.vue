<script setup lang="ts">
import { usePaletteStore } from '@/stores/palette';
import { computed, ref, toRef, type Ref } from 'vue';

import BaseExporter from './BaseExporter.vue';
import { makeLiquidEngine } from '@/library/template-utils';
import { slugify } from '@/library/text-utils';
import { formatCss, formatHex, rgb, type Color } from 'culori';

interface SimpleOpts {
    format: "hex" | "rgb" | "css";
}

const formatters = {
    hex: formatHex,
    rgb: (colour: Color) => {
        const rgbColour = rgb(colour);
        return [
            Math.max(Math.round(rgbColour.r * 255), 0),
            Math.max(Math.round(rgbColour.g * 255), 0),
            Math.max(Math.round(rgbColour.b * 255), 0),
        ].join(", ");
    },
    css: formatCss
} as const;

const paletteStore = usePaletteStore();
const engine = makeLiquidEngine(paletteStore);

const opts = toRef(paletteStore.palette.exportOptions["Simple"]);

if(opts.value === undefined) {
    opts.value = {
        format: "hex"
    };
}

const required = [ ];

const recommended = [ ];

const output = computed(() => {
    return buildOutput( formatters[opts.value.format] );
});

function buildOutput(fun: (Color) => string): string {
    let out = "";
    for(var h = 0; h < paletteStore.palette.hues.length; h++) {
        for(var s = 0; s < paletteStore.palette.shades.length; s++) {
            const m = paletteStore.getColour(h, s);
            if(m) {
                const name = paletteStore.getNameForColour(h, s);
                out += name + ": " + fun(m.colour) + "\n";
            }
        }
        out += "\n";
    }
    return out;
}

</script>

<template>
    <BaseExporter :output="output" :filename="slugify(paletteStore.palette.name) + '.txt'" :required :recommended>
        <label>Colour format: 
            <select v-model="opts.format">
                <option>hex</option>
                <option>rgb</option>
                <option>css</option>
            </select>
        </label>
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