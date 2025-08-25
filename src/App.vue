<script setup lang="ts">
import { RouterView } from 'vue-router'
import CommonPane from './components/CommonPane.vue';
import TabContainer from './components/TabContainer.vue';
import Header from './components/Header.vue';
import { usePaletteStore } from './stores/palette';
import { formatCss, } from 'culori';
import { computed, onMounted, onUnmounted, watch } from 'vue';

const paletteStore = usePaletteStore();

const themeVars = computed<[string, string][]>(() => {
  const vars: [string, string][] = Object.keys(paletteStore.themeFallbacks).map((key) => ['--theme-' + key, formatCss(paletteStore.getThemeColour(<any>key))]);
  vars.push(['--theme-currentfg', formatCss(paletteStore.currentColourFg)]);
  vars.push(['--theme-selected', paletteStore.selectedColour ? formatCss(paletteStore.selectedColour?.colour) : '#ffffff' ]);
  return vars;
});

watch(themeVars, (vars) => {
  for(let [name, val] of vars) {
    document.documentElement.style.setProperty(name, val);
  }
}, {
  immediate: true
});

onMounted(() => document.addEventListener("keydown", globalShortcuts));
onUnmounted(() => document.removeEventListener("keydown", globalShortcuts));

function globalShortcuts(evt: KeyboardEvent) {
  if( (evt.ctrlKey || evt.metaKey) && evt.key == "z" ) {
    paletteStore.history.undo();
    evt.preventDefault();
  }

  if( (evt.ctrlKey || evt.metaKey) && evt.shiftKey && evt.key == "z" ) {
    paletteStore.history.redo();
    evt.preventDefault();
  }

  if( (evt.ctrlKey || evt.metaKey) && evt.key == "y" ) {
    paletteStore.history.redo();
    evt.preventDefault();
  }
}

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

  background-color: var(--theme-bg);
  color: var(--theme-fg);
}

input {
    background-color: var(--theme-bg);
    color: var(--theme-fg);
    border-color: var(--theme-border);
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
