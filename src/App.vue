<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import CommonPane from './components/CommonPane.vue';
import TabContainer from './components/TabContainer.vue';
import Header from './components/Header.vue';
import { usePaletteStore } from './stores/palette';
import { reactive } from 'vue';
import { formatCss, oklch } from 'culori';


const paletteStore = usePaletteStore();

const mainStyle = reactive({
  backgroundColor: formatCss(paletteStore.theme.bg.colour ),
  color: formatCss(paletteStore.theme.fg.colour)
});

</script>

<template>
  <Header></Header>
  <main id="main" :style="mainStyle">
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
}
</style>
