<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { usePaletteStore } from '@/stores/palette';
import ConfirmModal from './ConfirmModal.vue';
import { useOptions } from '@/stores/options';

const paletteStore = usePaletteStore();
const optionStore = useOptions();

const lastUpdate = __LAST_UPDATE__;

const shown = ref(false);

const confirmModal = useTemplateRef("confirmModal");

function close() {
  shown.value = false;
}

function show() {
  shown.value = true;
}

function resetData() {
  paletteStore.$reset();
}

function onReset() {
  confirmModal.value?.showConfirmModal("Are you sure you wish to delete all your data and reset to the default palette?", resetData);
}

defineExpose({
  show
});

</script>


<template>
  <Teleport to="body">
    <div class="backdrop" v-show="shown" @click.self="close">
      <div class="modal" >
        <h3 class="text-big">Help</h3>
        <div id="help">

          <p>Themidor is a tool to help you design colour palettes and themes for
          various programs.</p>
          
          <p>Set up the hues and shades of your colour palette using the grid on
          the left.</p>
          
          <p>Compare and tweak your colours in the Edit tab, and check how well
          they contrast against eachother in the Contrast tab.</p>
          
          <p>Create a colour scheme from your palette by assigning tags to your
          colours in the Tag tab.  Click and drag the tags to a colour in the
          grid or area in the tag tray. You can add pre-defined sets of tags to
          your project using the Add Collection drop-down, or add custom tags.</p>

          <p>You can change Themidor’s colour scheme by reassigning the tags that
          start with <code>tmdr:</code>. If you get stuck and accidentally make Themidor
          unusable, you can disable dynamic theming using the option below.</p>
          
          <p>Export your scheme in a variety of formats in the Export tab.</p>
        </div>
        <h3 class="text-big">About</h3>
        <div class="about">
          <p>Themidor was inspired by many other tools, but particularly by
            <a href="https://cielab.io">CIELab.io</a> and
            <a href="https://terminal.sexy">terminal.sexy</a>.
          </p>
          
          <p><a href="http://github.com/krendil/themidor">Source code</a></p>
          <p>Last updated: {{ lastUpdate }}</p>
        </div>
        <h3 class="text-big">Options</h3>
        <div id="options">
          <label
            title="Whether to use colours and tags defined in the current palette to style Themidor. Disable this if you accidentally changed things and now can't see anything.">
            Enable dynamic theming: <input type="checkbox" v-model="optionStore.dynamicTheming"></input></label>
          <button @click="onReset">Reset palette data</button>
        </div>
      </div>
    </div>
  </Teleport>
  <ConfirmModal ref="confirmModal"></ConfirmModal>
</template>

<style scoped>

.backdrop {

  /* Note we can't use variables here because we aren't inside main
    otherwise, this could be: color(from var(--theme-grey) srgb r g b / 50%); */
  background-color: #9e9e9e7f;

  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  z-index: 99;
}

.modal {
  color: #2e2e2e;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 2em;

  width: fit-content;
  height: fit-content;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;

  max-width: 67vw;
}

.message {
  margin-bottom: 2em;
}

.button-container {

  display: flex;
  justify-content: space-around;

}

#options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

</style>