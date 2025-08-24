<script setup lang="ts">
import { usePaletteStore } from '@/stores/palette';
import { formatCss } from 'culori';
import { RouterLink, useRoute } from 'vue-router';
import HelpModal from './HelpModal.vue';
import { useTemplateRef } from 'vue';

const paletteStore = usePaletteStore();
const route = useRoute();

const helpModal = useTemplateRef("helpModal");

const tabs = [
  { url: "/edit", text: "Edit" },
  { url: "/contrast", text: "Contrast" },
  { url: "/tag", text: "Tag" },
  { url: "/export", text: "Export" },
  { url: "/import", text: "Import" },
];

function isCurrentTab(tab: { url: string }): boolean {
  return tab.url == route.path;
}

function showHelp() {
  helpModal.value?.show();
}

</script>


<template>
  <header class="colour-transition">
    <div id="titles">
      <span>Themidor – <input id="palette-name" class="invisible colour-transition" v-model="paletteStore.palette.name"></input>
      </span>
    </div>
    <div id="tabs">
      <div v-for="tab in tabs" class="tab text-big" :class="{selected: isCurrentTab(tab)}">
        <RouterLink :to="tab.url">{{tab.text}}</RouterLink>
      </div>
    </div>
    <div id="help" @click="showHelp">
      <span>?</span>
    </div>
  </header>
  <HelpModal ref="helpModal"></HelpModal>
</template>

<style scoped>
header {
  font-size: 1.44rem;
  padding: 0.5rem 0.5rem 0;
  color: var(--theme-currentfg);
  background-color: var(--theme-selected);

  display: flex;
}

#titles {
  flex-basis: 30%;
  display: flex;
  align-items: baseline;
  padding-bottom: 0.5rem;
}

#tabs {
  display: flex;
  align-self: end;
  gap: 0.2rem;

  flex-grow: 1;
}

.tab {
  border-width: 1px;
  border-radius: 4px 4px 0 0;

  background-color: var(--theme-fg);
  color: var(--theme-bg);

  border-color: var(--theme-currentfg);
  border-style: solid solid none;
  padding: 0.2em 0.5em;
}

.tab.selected {
  background-color: var(--theme-bg);
  color: var(--theme-fg);
  /* background-color: var(--theme-currentfg);
  color: var(--theme-selected); */
}

#palette-name {
  margin-left: 0.1em;
}

#help {
  cursor: pointer;
  > span {
    color: #ffffff;
    background-color: #2e2e2e;
    clip-path: circle(closest-side);
    padding: 0 0.5em;
  }
}

</style>