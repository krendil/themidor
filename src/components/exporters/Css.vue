<script setup lang="ts">
import { usePaletteStore } from '@/stores/palette';
import { computed, toRef, type Ref, } from 'vue';

import BaseExporter from './BaseExporter.vue';
import { slugify } from '@/library/text-utils';
import { formatCss, formatHex, mapper, round, } from 'culori';

interface CssOpts {
    format: "native" | "hex";
}

const paletteStore = usePaletteStore();

const opts: Ref<CssOpts> = toRef(paletteStore.palette.exportOptions, "css");

if(opts.value === undefined) {
    opts.value = {
        format: "native"
    };
}

const required = [
];

const recommended = [
];

function formatFunction(format: CssOpts['format']): (Color) => string {
    // Workaround incorrect type definition for mapper(). See PR to fix it: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/73596
    const roundIt = mapper(round(5), <any>null);
    switch(format) {
        case 'native': return (c) => formatCss(roundIt(c));
        case 'hex': return formatHex;
    }
}

const output = computed(() => {
    const ff = formatFunction(opts.value.format);
    let out = ":root {\n";
    for(let h = 0; h < paletteStore.palette.hues.length; h++) {
        for(let s = 0; s < paletteStore.palette.shades.length; s++) {
            const pm = paletteStore.palette.colours[h][s];
            if(pm) {
                out += "  --" + slugify( paletteStore.getNameForColour(h, s) ) + ": " + ff(pm.colour) + ";\n";
            }
        }
    }
    out += "}";
    return out;
});

const filename = computed(
    () => slugify(paletteStore.palette.name) + ".css"
);

</script>

<template>
    <BaseExporter :output :filename :required :recommended>
        <div class="tray">
            <label>Format:
                <select v-model="opts.format">
                    <option value="native">Native</option>
                    <option value="hex">Hex</option>
                </select>
            </label>
        </div>
    </BaseExporter>
</template>

<style lang="css" scoped>
</style>