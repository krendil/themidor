<script setup lang="ts">
import { usePaletteStore } from '@/stores/palette';


const paletteStore = usePaletteStore();

</script>

<template>

<div style="background-color: var(--noct-light-surface); color: var(--noct-light-onsurface);">

     <h2 class="align-center">Surface</h2>
     <div class="noct-preview">

          <div class="noct-card" style="color: var(--noct-light-primary);">
               <h3 class="align-center">Primary</h3>
          </div>
          <div class="noct-card" style="color: var(--noct-light-secondary);">
               <h3 class="align-center">Secondary</h3>
          </div>
          <div class="noct-card" style="color: var(--noct-light-tertiary);">
               <h3 class="align-center">Tertiary</h3>
          </div>
          <div class="noct-card" style="color: var(--noct-light-error);">
               <h3 class="align-center">Error</h3>
          </div>
          <div class="noct-card" style="background-color: var(--noct-light-surfacevariant); color: var(--noct-light-primary);">
               <h3 class="align-center">Primary on variant</h3>
          </div>
          <div class="noct-card" style="background-color: var(--noct-light-surfacevariant); color: var(--noct-light-secondary);">
               <h3 class="align-center">Secondary on variant</h3>
          </div>
          <div class="noct-card" style="background-color: var(--noct-light-surfacevariant); color: var(--noct-light-tertiary);">
               <h3 class="align-center">Tertiary on variant</h3>
          </div>
          <div class="noct-card" style="background-color: var(--noct-light-surfacevariant); color: var(--noct-light-error);">
               <h3 class="align-center">Error on variant</h3>
          </div>
          <div class="noct-card" style="background-color: var(--noct-light-primary); color: var(--noct-light-onprimary);">
               <h3 class="align-center">Primary fill</h3>
          </div>
          <div class="noct-card" style="background-color: var(--noct-light-secondary); color: var(--noct-light-onsecondary);">
               <h3 class="align-center">Secondary fill</h3>
          </div>
          <div class="noct-card" style="background-color: var(--noct-light-tertiary); color: var(--noct-light-ontertiary);">
               <h3 class="align-center">Tertiary fill</h3>
          </div>
          <div class="noct-card" style="background-color: var(--noct-light-error); color: var(--noct-light-onerror);">
               <h3 class="align-center">Error fill</h3>
          </div>
          <div class="noct-card" style="background-color: var(--noct-light-hover); color: var(--noct-light-onhover);">
               <h3 class="align-center">Hover</h3>
          </div>
          <div class="noct-card" style="background-color: var(--noct-light-surfacevariant); color: var(--noct-light-onsurfacevariant);">
               <h3 class="align-center">Surface Variant</h3>
          </div>

     </div>
</div>


</template>

<style scoped>

.noct-preview {
     width: 100%;
     display: grid;
     gap: 1rem;
     grid-template-columns: repeat(4, 1fr);
     grid-auto-flow: row;
     grid-auto-rows: min-content;
}

.noct-card {
     padding: 1rem;
     height: 3rem;
     border-radius: 1rem;
     border: 1px solid var(--noct-light-outline);
     box-shadow: 0.25rem 0.25rem 0.5rem var(--noct-light-shadow);
}


</style>
