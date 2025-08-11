<script setup lang="ts">
import { usePaletteStore } from '@/stores/palette';
import { useLibrary as useLibrary } from '@/stores/library';
import { formatCss, type Color } from 'culori';
import _ from 'lodash';
import { computed, ref } from 'vue';
import { onDrag, onDragLeave, onDragOver, onDrop, onDropDelete } from '@/library/drag-utils';

const paletteStore = usePaletteStore();
const library = useLibrary();

interface TagData {
  name: string,
  hueshade: [number, number] | null,
  fg: string, bg: string, 
  tags: { tag: string, description: string }[]
}

const selectedPreview = ref(library.previewList[0]);

const tagGroups = computed<TagData[]>( () => 
  _.chain(paletteStore.palette.tags)
    .transform( (acc: { [key: number]: TagData }, hueshade, tag) => {
      if(!matchesFilter(tag)) return;
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
    }, {[-1]: { name: "Unassigned", hueshade: null, fg: "var(--tmdr-fg)", bg: "var(--tmdr-bg)", tags: [] } as TagData} )
    .toPairs()
    .orderBy( ([k, v]) => k)
    .map( ([_, v]) => v )
    .value()
);

const tagFilter = ref("");
const tagFilterRegex = computed(() => new RegExp(tagFilter.value, 'i'));

function matchesFilter(tag: string): boolean {
  if(tagFilter.value === "") return true;
  return tagFilterRegex.value.test(tag);
}

function onAddCollection(event: Event) {
  const select = event.target as HTMLSelectElement;
  const collectionName = select.value;
  if (!!collectionName) {
    const collection = library.collections[collectionName];
    for( const tag of collection.tags ) {
      if(! (tag in paletteStore.palette.tags)) {
        paletteStore.palette.tags[tag] = null;
      }
    }
    select.value = ""; // Reset the select box
  }
}

function onAddTag(event: Event) {
  const input = event.target as HTMLInputElement;
  if(!input.validityState.valid) return;
  input.value.split("\n").forEach(tagValue => {
    tagValue = tagValue.trim();
    if(tagValue && ! (tagValue in paletteStore.palette.tags)) {
      paletteStore.palette.tags[tagValue] = null;
    }
  });
  input.value = ""; // Reset the input box
}

</script>

<template>
  <div id="tag-view">
    <div class="tag-controls">
        <label style="flex-grow: 1">Filter tags: <input type="text" v-model="tagFilter" placeholder="This is a regex..."></input></label>
        <label style="flex-grow: 0; position: relative" @change="onAddTag">Add tag: 
          <input type="text" placeholder="namespace:value" pattern="[^ ]"></input>
          <span class="validation"></span>
        </label>
        <select style="flex-grow: 0" @change="onAddCollection">
          <option value="">Add collection</option>
          <option v-for="collection in library.collectionList" :value="collection">{{collection}}</option>
        </select>
        <div @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDropDelete($event, paletteStore)"
        title="Drag tags here to delete them"
        >♻</div>
    </div>
    <div id="tag-tray" class="tray">
      <div v-for="group in tagGroups" :key="group.name" class="tag-group colour-transition"
        @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDrop($event, paletteStore, group.hueshade)"
      >
        <div class="group-title"><span>{{ group.name }}</span></div>
        <div class="group-chips">
          <div v-for="tag in group.tags" :key="tag.tag" class="tag-chip monospace colour-transition"
            :style="{ color: group.fg, backgroundColor: group.bg }" :title="tag.description" draggable="true"
            @dragstart="onDrag($event, tag.tag)">#{{ tag.tag }}</div>
        </div>
      </div>
    </div>
    <div class="tag-controls">
      <label>Preview: 
        <select v-model="selectedPreview">
          <option v-for="preview in library.previewList" :value="preview">{{preview}}</option>
        </select>
      </label>
    </div>
    <div id="preview" class="tray" v-html="library.previews[selectedPreview]">
    </div>
  </div>
</template>

<style scoped>

#tag-view {
  height: 100%;

  display: flex;
  flex-direction: column;

  gap: 0.2rem;

  padding: 0.5rem;
}

.tag-controls {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

#tag-tray {
  padding: 0.5rem;
}

.group-chips {
  padding-bottom: 0.2rem;
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

  margin: 0.1rem;

  cursor: grab;
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

.validation {
  position: absolute;
  height: 100%;
  right: 0.2rem;
  padding: 1px; /* To align with 1px border of input */
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