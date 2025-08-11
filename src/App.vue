<script setup lang="ts">
import { RouterView } from 'vue-router'
import CommonPane from './components/CommonPane.vue';
import TabContainer from './components/TabContainer.vue';
import Header from './components/Header.vue';
import { usePaletteStore } from './stores/palette';
import { formatCss, } from 'culori';
import { computed } from 'vue';
import { transform } from 'lodash-es';


const paletteStore = usePaletteStore();

const defineVars = computed<{ [key: string]: string }>(() => {
  return transform( paletteStore.palette.tags,  (accum, hueshade, tagValue) => {
    if(hueshade) {
      const [hue, shade] = hueshade;
      accum[ '--' + tagValue.replace(":","-") ] = formatCss(paletteStore.palette.colours[hue][shade]?.colour) ?? "unset";
    }
  });
})

</script>

<template>
  <Header :style="defineVars"></Header>
  <main id="main" class="colour-transition" :style="defineVars">
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

  background-color: var(--tmdr-bg);
  color: var(--tmdr-fg);
}

input {
    background-color: var(--tmdr-bg);
    color: var(--tmdr-fg);
    border-color: var(--tmdr-border);
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
