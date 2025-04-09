<script setup lang="ts">
import { RouterView } from 'vue-router'
import CommonPane from './components/CommonPane.vue';
import TabContainer from './components/TabContainer.vue';
import Header from './components/Header.vue';
import { usePaletteStore } from './stores/palette';
import { formatCss, } from 'culori';


const paletteStore = usePaletteStore();


</script>

<template>
  <Header></Header>
  <main id="main" class="colour-transition">
    <CommonPane></CommonPane>
    <TabContainer>
      <RouterView />
    </TabContainer>
  </main>
</template>

<style scoped>
#main {
  display: grid;
  grid-template-columns: 3fr 7fr;

  flex-grow: 1;

  background-color: v-bind('formatCss(paletteStore.theme.bg.colour)');
  color: v-bind('formatCss(paletteStore.theme.fg.colour)');
}
</style>
