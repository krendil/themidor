<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { usePaletteStore } from '@/stores/palette';
import ConfirmModal from './ConfirmModal.vue';
import { useOptions } from '@/stores/options';

const paletteStore = usePaletteStore();
const optionStore = useOptions();

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
        <h3 class="text-big">Options</h3>
        <div class="options">
          <label
            title="Whether to use colours and tags defined in the current palette to style Themidor. Disable this if you accidentally changed things and now can't see anything.">
            Enable dynamic theming: <input type="checkbox" v-model="optionStore.dynamicTheming"></input></label>
          <button @click="onReset">Reset palette data</button>
        </div>
        <!-- <h3 class="text-big">About</h3>
        <div class="about">
        </div> -->
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
  position: absolute;
  top: 30%;
  left: 0;
  right: 0;
  margin: auto;
}

.message {
  margin-bottom: 2em;
}

.button-container {

  display: flex;
  justify-content: space-around;

}

.options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

</style>