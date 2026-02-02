<template>

<div style="background-color: var(--noct-dark-surface); color: var(--noct-dark-onsurface);">

     <h2 class="align-center">Surface</h2>
     <div class="noct-preview">

          <div class="noct-card" style="color: var(--noct-dark-primary);">
               <h3 class="align-center">Primary</h3>
          </div>
          <div class="noct-card" style="color: var(--noct-dark-secondary);">
               <h3 class="align-center">Secondary</h3>
          </div>
          <div class="noct-card" style="color: var(--noct-dark-tertiary);">
               <h3 class="align-center">Tertiary</h3>
          </div>
          <div class="noct-card" style="color: var(--noct-dark-error);">
               <h3 class="align-center">Error</h3>
          </div>
          <div class="noct-card" style="background-color: var(--noct-dark-surfacevariant); color: var(--noct-dark-primary);">
               <h3 class="align-center">Primary on variant</h3>
          </div>
          <div class="noct-card" style="background-color: var(--noct-dark-surfacevariant); color: var(--noct-dark-secondary);">
               <h3 class="align-center">Secondary on variant</h3>
          </div>
          <div class="noct-card" style="background-color: var(--noct-dark-surfacevariant); color: var(--noct-dark-tertiary);">
               <h3 class="align-center">Tertiary on variant</h3>
          </div>
          <div class="noct-card" style="background-color: var(--noct-dark-surfacevariant); color: var(--noct-dark-error);">
               <h3 class="align-center">Error on variant</h3>
          </div>
          <div class="noct-card" style="background-color: var(--noct-dark-primary); color: var(--noct-dark-onprimary);">
               <h3 class="align-center">Primary fill</h3>
          </div>
          <div class="noct-card" style="background-color: var(--noct-dark-secondary); color: var(--noct-dark-onsecondary);">
               <h3 class="align-center">Secondary fill</h3>
          </div>
          <div class="noct-card" style="background-color: var(--noct-dark-tertiary); color: var(--noct-dark-ontertiary);">
               <h3 class="align-center">Tertiary fill</h3>
          </div>
          <div class="noct-card" style="background-color: var(--noct-dark-error); color: var(--noct-dark-onerror);">
               <h3 class="align-center">Error fill</h3>
          </div>
          <div class="noct-card" style="background-color: var(--noct-dark-hover); color: var(--noct-dark-onhover);">
               <h3 class="align-center">Hover</h3>
          </div>
          <div class="noct-card" style="background-color: var(--noct-dark-surfacevariant); color: var(--noct-dark-onsurfacevariant);">
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
     border: 1px solid var(--noct-dark-outline);
     box-shadow: 0.25rem 0.25rem 0.5rem var(--noct-dark-shadow);
}


</style>
