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

<style>
#main {
  display: grid;
  grid-template-columns: 3fr 7fr;

  flex-grow: 1;
  min-height: 0;

  background-color: v-bind('formatCss(paletteStore.theme.bg.colour)');
  color: v-bind('formatCss(paletteStore.theme.fg.colour)');
}

input {
    background-color: v-bind('formatCss(paletteStore.theme.bg.colour)');
    color: v-bind('formatCss(paletteStore.theme.fg.colour)');
    border-color: v-bind('formatCss(paletteStore.theme.border.colour)');
    border-width: 1px;
    border-style: solid;
    border-radius: 2px;
}

input.invisible:not(:hover, :focus, :active) {
    border-color: #ffffff00;
    color: inherit;
    background-color: inherit;
}

</style>
