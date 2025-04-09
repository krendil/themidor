<script setup lang="ts">
import { usePaletteStore } from '@/stores/palette';
import { formatCss } from 'culori';

const paletteStore = usePaletteStore();
</script>


<template>
  <header class="colour-transition">
    Themidor
  </header>
</template>

<style scoped>
header {
  font-size: 1.44rem;
  padding: 0.5rem;
  color: v-bind('formatCss(paletteStore.theme.currentColourFg.colour)');
  background-color: v-bind('formatCss(paletteStore.selectedColour?.colour)');
}
</style>