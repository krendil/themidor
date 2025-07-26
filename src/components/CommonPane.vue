<script setup lang="ts">
import Swatch from './swatch/Swatch.vue';
import ColourInfo from './ColourInfo.vue';
</script>

<template>
  <div class="common-pane">
    <Swatch></Swatch>
    <ColourInfo></ColourInfo>
  </div>
</template>

<style scoped>

.common-pane {
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 7fr 3fr;
  gap: 0.5em;
  padding-bottom: 0.5em;
}

</style>
