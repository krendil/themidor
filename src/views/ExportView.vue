<script setup lang="ts">
import { useLibrary } from '@/stores/library';
import { useOptions } from '@/stores/options';
import { computed, ref, toRef } from 'vue';

const library = useLibrary();
const options = useOptions();

const exporterName = toRef(options.exportView, 'selectedExporter');
const exporterComponent = computed(() => library.exporters[exporterName.value]);

</script>

<template>
  <div id="export-view">
    <div class="selector">
      <select v-model="exporterName">
        <option v-for="exporter in library.exporterList" :value="exporter">{{exporter}}</option>
      </select>
    </div>
    <component :is="exporterComponent"></component> 
  </div>
</template>

<style scoped>

#export-view {
  height: 100%;

  display: flex;
  flex-direction: column;

  gap: 0.2rem;

  padding: 0.5rem;
}

.selector {
  flex-grow: 0;
}

</style>
