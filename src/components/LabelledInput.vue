<script setup lang="ts">
import { usePaletteStore } from '@/stores/palette';
import { formatCss } from 'culori';

defineOptions({
  inheritAttrs: false
});

const paletteStore = usePaletteStore();

</script>

<template>
    <div class="labelled-input">
        <span class="label"><slot></slot></span>
        <input v-bind="$attrs"></input>
    </div>
</template>

<style scoped>
.labelled-input {
  display: flex;
  flex-direction: row;
  align-items: baseline;

}

.label {
    flex-grow: 0;
    padding: 0.2em 0.5em;
    background-color: var(--theme-hibg);
    color: var(--theme-hifg);
    border-color: var(--theme-border);
    border-width: 1px 0 1px 1px;
    border-style: solid;
    border-radius: 2px 0 0 2px; /* Top left and bottom left */
}

.labelled-input input {
    flex-grow: 1;
    padding: 0.2em 0.5em;
    border-radius: 0 2px 2px 0; /* Top right and bottom right */
}
</style>