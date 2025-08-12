<script setup lang="ts">
import { isPalette } from '@/models/palette';
import { usePaletteStore } from '@/stores/palette';
import { ref } from 'vue';

const paletteStore = usePaletteStore();

const errorMessage = ref("");
const successMessage = ref("");

async function importFile(e: Event) {
  errorMessage.value = "";
  successMessage.value = "";
  if(e.currentTarget instanceof HTMLInputElement) {
    if(e.currentTarget.files && e.currentTarget.files.length == 1) {
      const file = e.currentTarget.files[0];
      if(file.size > 10000000) {
        errorMessage.value = "File is too big. Are you sure this is a Themidor file?";
        return;
      }

      const text = await file.text();
      try {
        const obj = JSON.parse(text);
        
        if( isPalette(obj) ) {
          paletteStore.$patch({
            palette: obj
          });

          successMessage.value = `${obj.name} successfully imported.`;
        } else {
          errorMessage.value = "File does not contain a valid Themidor palette.";
        }

      } catch (e) {
        const msg = e instanceof SyntaxError ? e.message : e;
        errorMessage.value = `Error parsing imported JSON: ${msg}`;
        return;
      }
    } else {
      errorMessage.value = "No file selected.";
      return;
    }
  }
}

</script>

<template>
  <div id="import-view">
    <label>Upload a file: <input type="file" accept=".json,application/json,text/plain" @change="importFile"></input> </label>
    <div v-if="errorMessage" class="warning">{{errorMessage}}</div>
    <div v-if="successMessage" class="valid">{{successMessage}}</div>
  </div>
</template>

<style scoped>

#import-view {
  padding: 0.5rem;
}

.warning::before {
  content: "!";
  font-weight: bold;
  color: var(--tmdr-bad);
  margin-right: 0.5rem;
}

.valid::before {
  content: "✔";
  color: var(--tmdr-good);
  margin-right: 0.5rem;
}

.warning,.valid {
  margin-top: 0.5rem;
}

</style>
