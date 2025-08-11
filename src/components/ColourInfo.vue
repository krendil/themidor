<script setup lang="ts">
import { usePaletteStore } from '@/stores/palette';
import { computed, reactive } from 'vue';
import { formatCss, formatHex, getMode} from 'culori';
import LabelledInput from './LabelledInput.vue';
import { filter } from 'lodash-es';
import { useLibrary } from '@/stores/library';
import { onDrag, onDragLeave, onDragOver, onDrop } from '@/library/drag-utils';


const paletteStore = usePaletteStore();
const library = useLibrary();

const name = computed(() => {
  return paletteStore.getNameForColour(paletteStore.selectedHue, paletteStore.selectedShade);
});

const hex = reactive({
  get: computed(() => formatHex(paletteStore.selectedColour?.colour)),

  set: function(value: string) {
    // Don't parse hex colours of less than 6 digits (seven including the #)
    // These could be valid 12-bit RGB or 16-bit RGBA colours, but are probably
    // someone editing or entering a 24-bit RGB by hand
    if(!!value && value[0] == '#' && value.length < 7) {
      return;
    }
    const newColor = paletteStore.colourModeConverter(value);
    if(!!newColor) {
      paletteStore.setColour(paletteStore.selectedHue, paletteStore.selectedShade, newColor);
    }
  }
});

const channels = computed(() => filter(getMode(paletteStore.colourMode).channels, c => c != 'alpha'));

const getChannel = function(channel: string): number | undefined {
  const convertedColour = paletteStore.colourModeConverter(paletteStore.selectedColour?.colour);
  return !!convertedColour ? convertedColour[channel] : undefined;
}

const setChannel = function(channel: string, text: string) {
  const selectedColour = paletteStore.colourModeConverter(paletteStore.selectedColour?.colour);
  if(!selectedColour) {
    return;
  }
  const value = parseFloat(text);
  if(isNaN(value)) {
    return;
  }

  paletteStore.setColour(
    paletteStore.selectedHue,
    paletteStore.selectedShade,
    {...selectedColour, [channel]: value}
  );

}

</script>


<template>
  <div class="sample colour-transition align-center align-middle" @dragover="onDragOver" @dragleave="onDragLeave"
    @drop="onDrop($event, paletteStore, [ paletteStore.selectedHue, paletteStore.selectedShade] )">
    {{ name }}
    <transition-group name="chips" tag="div" class="tags">
      <div v-for="tag in paletteStore.getCurrentColourTags" :key="tag" class="tag monospace" :title="library.descriptions[tag] ?? ''"
      @dragstart="onDrag($event, tag)" draggable="true">#{{ tag }}</div>
    </transition-group>
  </div>
  <div class="values">
    <LabelledInput size="7" :value="hex.get" @input="hex.set($event.target.value)">HEX</LabelledInput>
    <LabelledInput v-for="channel of channels" size="3" :value="getChannel(channel)"
      @input="setChannel(channel, $event.target.value)">{{ channel.toUpperCase() }}</LabelledInput>
  </div>
</template>

<style scoped>

.sample {
  background-color: v-bind('formatCss(paletteStore.selectedColour?.colour)');
  color: v-bind('formatCss(paletteStore.theme.currentColourFg.colour)');

  position: relative;
  border-style: solid;
  border-width: 0;
  transition-duration: 150ms;
  transition-property: border-width, border-style;
}

.sample.drag-over {
  border-color: v-bind('formatCss(paletteStore.theme.currentColourFg.colour)');
  border-width: 4px;
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

  cursor: grab;
}

.values {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr;
  gap: 0.5em;
  padding: 0 0.5em;
}

.chips-move, /* apply transition to moving elements */
.chips-enter-active,
.chips-leave-active {
  transition: all 150ms;
}

.chips-enter-from,
.chips-leave-to {
  opacity: 0;
  transform: translateY(-50%);
}
</style>
