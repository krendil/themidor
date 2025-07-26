<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { formatCss } from 'culori';
import { usePaletteStore } from '@/stores/palette';

const paletteStore = usePaletteStore();

const shown = ref(false);
const message = ref("");
const fun: Ref<() => void> = ref( () => {} );

function resolveNo() {
  shown.value = false;
}

function resolveYes() {
  fun.value();
  shown.value = false;
}

function showConfirmModal(msg: string, ifYes: () => void) {
  message.value = msg;
  fun.value = ifYes;
  shown.value = true;
}

defineExpose({
  showConfirmModal
});

</script>


<template>
  <Teleport to="body">
    <div class="backdrop" v-show="shown" @click="resolveNo">
      <div class="modal">
        <div class="message">{{message}}</div>
        <div class="button-container">
          <button @click="resolveYes">Yes</button>
          <button @click="resolveNo">No</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>

.backdrop {
  background-color: v-bind('formatCss({...paletteStore.theme.grey.colour, alpha: 0.5})');

  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.modal {
  background-color: v-bind('formatCss(paletteStore.theme.bg.colour)');
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

</style>