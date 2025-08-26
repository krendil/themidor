<script setup lang="ts">
import { usePaletteStore } from '@/stores/palette';
import { computed } from 'vue';

import BaseExporter from './BaseExporter.vue';
import { slugify } from '@/library/text-utils';

const paletteStore = usePaletteStore();

const required = [ ];

const recommended = [ ];

const output = computed(() => {
    return JSON.stringify(paletteStore.palette);
});

const filename = computed(() => `themidor-${slugify(paletteStore.palette.name)}.json`);

</script>

<template>
    <BaseExporter :output :filename :required :recommended>
        <div class="tray">
            You can use this exporter to save a copy of your palette, then load
            it again using the Import tab.
        </div>
    </BaseExporter>
</template>

<style lang="css" scoped>
</style>