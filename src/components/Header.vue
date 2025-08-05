<script setup lang="ts">
import { usePaletteStore } from '@/stores/palette';
import { formatCss } from 'culori';
import { RouterLink, useRoute } from 'vue-router';

const paletteStore = usePaletteStore();
const route = useRoute();

const tabs = [
  { url: "/edit", text: "Edit" },
  { url: "/contrast", text: "Contrast" },
  { url: "/tag", text: "Tag" },
  { url: "/export", text: "Export" },
];

function isCurrentTab(tab: { url: string }): boolean {
  return tab.url == route.path;
}

</script>


<template>
  <header class="colour-transition">
    <div id="titles">
      <span>Themidor – </span>
      <input id="palette-name" class="invisible colour-transition" :value="paletteStore.palette.name"></input>
    </div>
    <div id="tabs">
      <div v-for="tab in tabs" class="tab text-big" :class="{selected: isCurrentTab(tab)}">
        <RouterLink :to="tab.url">{{tab.text}}</RouterLink>
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  font-size: 1.44rem;
  padding: 0.5rem 0.5rem 0;
  color: v-bind('formatCss(paletteStore.theme.currentColourFg.colour)');
  background-color: v-bind('formatCss(paletteStore.selectedColour?.colour)');

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
}

.tab {
  border-width: 1px;
  border-radius: 4px 4px 0 0;

  background-color: v-bind('formatCss(paletteStore.theme.fg.colour)');
  color: v-bind('formatCss(paletteStore.theme.bg.colour)');

  border-color: v-bind('formatCss(paletteStore.theme.currentColourFg.colour)');
  border-style: solid solid none;
  padding: 0.2em 0.5em;
}

.tab.selected {
  background-color: v-bind('formatCss(paletteStore.theme.bg.colour)');
  color: v-bind('formatCss(paletteStore.theme.fg.colour)');
  /* background-color: v-bind('formatCss(paletteStore.theme.currentColourFg.colour)');
  color: v-bind('formatCss(paletteStore.selectedColour?.colour)'); */
}

#palette-name {
  margin-left: 0.1em;
}

</style>