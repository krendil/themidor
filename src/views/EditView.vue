<script setup lang="ts">
import { ref, defineModel, reactive, computed } from 'vue';
import { type Mode, getMode } from 'culori';
import SliderSet from '@/components/SliderSet.vue';
import { usePaletteStore } from '@/stores/palette';

const paletteStore = usePaletteStore();
const colourSpace = defineModel<Mode>({default: "oklch", required: true});

const channels = computed( () => getMode(colourSpace.value).channels.filter( c => c !== 'alpha' ) );

</script>


<template>
  <div id="edit-view">
    <div class="align-right">
      <label>Colour space:
        <select v-model="colourSpace">
          <option value="oklch">OkLCH</option>
          <option value="hsl">HSL</option>
          <option value="rgb">sRGB</option>
        </select>
      </label>
    </div>
    <div id="slider-grid">
      <template v-for="channel in channels">
        <SliderSet
          :channel="channel"
          :hue="paletteStore.selectedHue" :shade="paletteStore.selectedShade" :colour-space="colourSpace"
          axis="hues" class="sliders"></SliderSet>
        <SliderSet
          :channel="channel"
          :hue="paletteStore.selectedHue" :shade="paletteStore.selectedShade" :colour-space="colourSpace"
          axis="shades" class="sliders"></SliderSet>
      </template>
    </div>
  </div>
</template>

<style>

#edit-view {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  height: 100%;
  min-height: 0;
}

#slider-grid {
  display: grid;
  grid-template: repeat(3, 1fr) / 1fr 1fr;
  column-gap: 2rem;
  row-gap: 2rem;
  flex: auto;
}

</style>
