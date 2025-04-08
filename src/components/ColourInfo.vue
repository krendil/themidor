<script setup lang="ts">
import { usePaletteStore } from '@/stores/palette';
import { computed } from 'vue';
import { formatCss } from 'culori';


const paletteStore = usePaletteStore();

const name = computed(() => {
  const givenName = paletteStore.selectedColour?.name;
  if(!givenName) {
    return paletteStore.palette.shades[paletteStore.selectedShade] + ' ' + paletteStore.palette.hues[paletteStore.selectedHue];
  } else {
    return givenName;
  }
});


</script>


<template>
  <div class="sample colour-transition align-center align-middle">
    {{ name }}
    <div class="tags">
      <div v-for="tag in paletteStore.getCurrentColourTags" class="tag monospace">#{{tag.namespace}}:{{tag.value}}</div>
    </div>
  </div>
  <div class="values">
    <input id="hex"></input>
    <input class="component"></input>
    <input class="component"></input>
    <input class="component"></input>
  </div>
</template>

<style scoped>

.sample {
  background-color: v-bind('formatCss(paletteStore.selectedColour?.colour)');
  color: v-bind('formatCss(paletteStore.theme.currentColourFg.colour)');

  position: relative;
}

.tags {
  display: flex;
  flex-flow: row wrap;
  gap: 0.2em;
  padding: 0.2em;

  position: absolute;
  bottom: 0;

  overflow-y: scroll;
  max-height: 40%;
}

.tag {
  font-size: small;
  border-style: solid;
  border-width: 1px;
  border-radius: 2px;
  padding: 0.1em;
  color: v-bind('formatCss(paletteStore.theme.currentColourFg.colour)');
  /* background-color: v-bind('formatCss(paletteStore.theme.tagbg.colour)'); */
}
</style>
