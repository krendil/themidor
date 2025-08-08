<script setup lang="ts">
import { usePaletteStore } from '@/stores/palette';
import { useLibrary as useLibrary } from '@/stores/library';
import { formatCss, type Color } from 'culori';
import _ from 'lodash';
import { computed } from 'vue';
import { onDrag, onDragLeave, onDragOver, onDrop } from '@/library/drag-utils';

const paletteStore = usePaletteStore();
const library = useLibrary();

interface TagData {
  name: string,
  hueshade: [number, number] | null,
  fg: string, bg: string, 
  tags: { tag: string, description: string }[]
}

const selectedPreview = computed(() => library.previews["Terminal Ls"]);

const tagGroups = computed<TagData[]>( () => 
  _.chain(paletteStore.palette.tags)
    .transform( (acc: { [key: number]: TagData }, hueshade, tag) => {
      const sortOrder = hueshade ? hueshade[0] * 1000 + hueshade[1] : -1;
      if( ! (sortOrder in acc) ) {
        const name = !!hueshade ? paletteStore.getNameForColour(hueshade[0], hueshade[1]) : "Unassigned";
        const colour = hueshade ? paletteStore.palette.colours[hueshade[0]][hueshade[1]]?.colour : undefined;
        acc[sortOrder] = {
          name,
          hueshade,
          fg: formatCss(paletteStore.fgForColour(colour).colour) ?? "var(--tmdr-fg)",
          bg: colour ? formatCss(colour) : "var(--tmdr-bg)",
          tags: []
        }
      }
      acc[sortOrder].tags.push( { tag, description: library.descriptions[tag] ?? "" } );
    })
    .toPairs()
    .orderBy( ([k, v]) => k)
    .map( ([_, v]) => v )
    .value()
);


</script>

<template>
  <div id="tag-view">
    <div>
      <input></input>
    </div>
    <div id="tag-tray" class="tray">
      <div v-for="group in tagGroups" :key="group.name" class="tag-group colour-transition"
        @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDrop($event, paletteStore, group.hueshade)"
      >
        <div><span class="group-title">{{ group.name }}</span></div>
        <div class="group-chips">
          <div v-for="tag in group.tags" :key="tag.tag" class="tag-chip colour-transition"
            :style="{ color: group.fg, backgroundColor: group.bg }" :title="tag.description" draggable="true"
            @dragstart="onDrag($event, tag.tag)">#{{ tag.tag }}</div>
        </div>
      </div>
    </div>
    <div>
      <!-- Preview selector -->
    </div>
    <div id="preview" class="tray" v-html="selectedPreview">
    </div>
  </div>
</template>

<style scoped>

#tag-view {
  height: 100%;

  display: flex;
  flex-direction: column;

  padding: 0.5rem;
}

.drag-over {
  background-color: var(--tmdr-hibg);
  color: var(--tmdr-hifg);
}

.tag-chip {
  display: inline-block;

  font-size: small;
  border-style: solid;
  border-width: 1px;
  border-radius: 2px;
  padding: 0.1em;

  border-color: currentColor;

  margin: 0.2em;

  cursor: grab;
}

#tag-tray {
  padding: 0.5rem;
}

.tray {
  flex: 1 1 0%;

  overflow-y: scroll;

  border-radius: 4px;
  border-width: 1px;
  border-style: solid;
  border-color: var(--tmdr-border);
}

#preview :deep(> *) {
    height: 100%;
    width: 100%;
    margin: 0;
  }
</style>

<style>

.blink {
  animation: 0.5s step-end alternate infinite both blink;
}

@keyframes blink {
  0% {
    opacity: 100%;
  }
  50% {
    opacity: 0%;
  }
  100% {
    opacity: 0%;
  }
}

</style>