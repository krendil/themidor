<script setup lang="ts">
import { usePaletteStore } from '@/stores/palette';
import { computed } from 'vue';

const paletteStore = usePaletteStore();

const hasBorder = computed( () => !!paletteStore.getColourByTag("niri:border:inactive") );
const hasUrgentBorder = computed( () => !!paletteStore.getColourByTag("niri:border:urgent") );
const hasFocusRing = computed( () => !!paletteStore.getColourByTag("niri:focus:active") );
const hasWindowShadow = computed( () => !!paletteStore.getColourByTag("niri:shadow") );
const hasWorkspaceShadow = computed( () => !!paletteStore.getColourByTag("niri:workspace-shadow") );

</script>


<template>

<div class="backdrop">
     <div class="workspace" :class="{ workspaceShadow: hasWorkspaceShadow }">
          <div class="window focused vbox" :class="{ windowShadow: hasWindowShadow }"
               style="background-color: var(--tmdr-bg);"
          >
               <div style="height: 10px; background-color: var(--theme-selected);"></div>
               <div class="hbox">
                    <div class="vbox" style="width: 70px;">
                         <div style="width: 70px; height: 150px;" class="mini-swatch">
                              <div style="background-color: var(--tmdr-bg);"></div>
                              <div style="background-color: var(--tmdr-border);"></div>

                              <div style="background-color: var(--tmdr-grey);"></div>
                              <div style="background-color: var(--tmdr-fg);"></div>

                              <div style="background-color: var(--tmdr-bad);"></div>
                              <div style="background-color: var(--tmdr-good);"></div>

                              <div style="background-color: var(--tmdr-hibg);"></div>
                              <div style="background-color: var(--tmdr-hifg);"></div>

                              <div style="background-color: var(--tmdr-darkfg);"></div>
                              <div style="background-color: var(--tmdr-accent);"></div>
                         </div>
                         <div style="height: 10px; width: 70px;"></div>
                         <div style="height: 80px; width: 70px; background-color: var(--theme-selected);"></div>
                    </div>
                    <div style="width: 10px;"></div>
                    <div class="vbox" style="width: 130px;">
                         <div style="height: 10px;"></div>
                         <div style="height: 70px; background-color: var(--tmdr-fg);"></div>
                         <div style="height: 10px;"></div>
                         <div style="height: 70px; background-color: var(--tmdr-fg);"></div>
                         <div style="height: 10px;"></div>
                         <div style="height: 70px; background-color: var(--tmdr-fg);"></div>
                    </div>
                    <div style="width: 10px;"></div>
               </div>
          </div>
          <div class="column">
               <div class="window urgent" :class="{ windowShadow: hasWindowShadow }" style="background-color: var(--term-bg);">
                    <div style="color: var(--tmdr-bad); font-size: 100px; text-align: center; width: 100%;">!</div>
               </div>
               <div class="window mini-term" :class="{ windowShadow: hasWindowShadow }">
                    <div class="hbox">
                         <div style="background-color: var(--term-2); width: 45px;"></div>
                         <div style="width: 90px;"></div>
                    </div>
                    <div class="hbox">
                         <div style="width: 180px;"></div>
                    </div>
                    <div class="hbox">
                         <div style="background-color: var(--term-2); width: 45px;"></div>
                         <div style="width: 90px;"></div>
                    </div>
                    <div class="hbox">
                         <div style="background-color: var(--term-2); width: 45px;"></div>
                         <div style="width: 30px;"></div>
                    </div>
                    <div class="hbox">
                         <div style="background-color: var(--term-2); width: 45px;"></div>
                         <div style="width: 45px;"></div>
                         <div style="width: 60px;"></div>
                    </div>
                    <div class="hbox">
                         <div style="width: 120px;"></div>
                    </div>
                    <div class="hbox">
                         <div style="width: 120px;"></div>
                    </div>
                    <div class="hbox">
                         <div style="background-color: var(--term-2); width: 45px;"></div>
                         <div style="width: 9px; background-color: var(--term-cursor, var(--term-fg));"></div>
                    </div>
               </div>
          </div>
     </div>
     <div class="workspace" :class="{ workspaceShadow: hasWorkspaceShadow }">
          <div style="position: relative">
               <div class="tab-indicator vbox">
                    <div class="tab"></div>
                    <div class="tab urgent"></div>
                    <div class="tab active"></div>
               </div>
               <div class="window monospace align-center align-middle" :class="{ windowShadow: hasWindowShadow }"
                    style="width: 210px; height: 250px; background-color: var(--tmdr-hibg); color: var(--tmdr-hifg);">
                    Here be tabs!
               </div>
          </div>
     </div>
</div>


</template>

<style scoped>

.hbox {
     display: flex;
     flex-direction: row;
}
.vbox {
     display: flex;
     flex-direction: column;
}

.backdrop {
     background-color: var(--niri-backdrop);

     display: flex;
     flex-direction: column;
     gap: 20px;
     padding: 20px;
}

.workspace {
     display: flex;
     flex-direction: row;
     gap: 20px;
     padding: 10px 20px;

     height: 270px;
     width: 480px;

     background-color: var(--niri-background);
}

.column {
     display: flex;
     flex-direction: column;
     gap: 20px;

     .window {
          height: 70px;
     }
}

.workspaceShadow {
     box-shadow: 2px 2px 5px var(--niri-workspace-shadow);
}

.window {
     border-style: solid;
     border-width: v-bind('hasBorder ? "2px" : "0"');
     border-color: var(--niri-border-inactive);

     width: 210px;
     min-height: 115px;
     max-height: 250px;
     height: auto;
}

.window.focused {
     border-width: v-bind('(hasBorder || hasFocusRing) ? "2px" : "0"');
     border-color: var(--niri-focus-active, var(--niri-border-active));
}

.window.urgent {
     border-width: v-bind('(hasUrgentBorder) ? "2px" : "0"');
     border-color: var(--niri-border-urgent);
}

.window.focused.urgent {
     border-width: v-bind('(hasBorder) ? "2px" : "0"');
     border-color: var(--niri-focus-urgent, var(--niri-border-urgent));
}

.windowShadow {
     box-shadow: 2px 2px 5px var(--niri-shadow-inactive, color-mix(in srgb, var(--niri-shadow) 50%, transparent));
}

.windowShadow.focused {
     box-shadow: 2px 2px 5px var(--niri-shadow);
}

.tab-indicator {
     position: absolute;
     width: 5px;
     height: 125px;
     top: 62.5px;
     left: -10px;
}
.tab {
     width: 100%;
     flex-grow: 1;
     background-color: var(--niri-tab-inactive);
}
.tab.active {
     background-color: var(--niri-tab-active);
}
.tab.urgent {
     background-color: var(--niri-tab-urgent);
}

.mini-swatch {
     display: grid;
     grid-template-columns: 35px 35px;
     grid-template-rows: repeat(5, 30px);
}

.mini-term {
     display: flex;
     flex-direction: column;
     padding: 5px;
     gap: 3px;
     align-items: start;
     justify-content: start;

     background-color: var(--term-bg);

     > .hbox > * {
          height: 9px;
          background-color: var(--term-fg);
          margin-right: 9px;
     }
}

</style>