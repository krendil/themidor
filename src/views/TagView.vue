<script setup lang="ts">
import { usePaletteStore } from '@/stores/palette';
import { useLibrary as useLibrary } from '@/stores/library';
import { formatCss, } from 'culori';
import { entries, map, pipe, reduce, sortBy, } from 'remeda';
import { computed, toRef } from 'vue';
import { onDragTag, onDragLeave, onDragTagOver, onDropTag, onDropDeleteTag } from '@/library/drag-utils';
import { useOptions } from '@/stores/options';

const paletteStore = usePaletteStore();
const library = useLibrary();
const options = useOptions();

interface TagData {
  name: string,
  hueshade: [number, number] | null,
  fg: string, bg: string, 
  tags: { tag: string, description: string }[]
}

interface NamespaceData {
  name: string,
  unassigned: {
    tag: string, description: string
  }[],
  tags: {
    tag: string, description: string, fg: string, bg: string
  }[]
}

const selectedPreview = toRef(options.tag, 'selectedPreview');
const groupBy = toRef(options.tag, 'groupBy');
const tagFilter = toRef(options.tag, 'tagFilter');

const tagGroups = computed<TagData[]>( () => 
  pipe(paletteStore.palette.tags, 
    entries(),
    reduce( (acc: { [key: number]: TagData }, [tag, hueshade]) => {
      if(!matchesFilter(tag)) return acc;
      const sortOrder = hueshade ? hueshade[0] * 1000 + hueshade[1] : -1;
      if( ! (sortOrder in acc) ) {
        const name = !!hueshade ? paletteStore.getNameForColour(hueshade[0], hueshade[1]) : "Unassigned";
        const colour = hueshade ? paletteStore.palette.colours[hueshade[0]][hueshade[1]]?.colour : undefined;
        acc[sortOrder] = {
          name,
          hueshade,
          fg: formatCss(paletteStore.fgForColour(colour)) ?? "var(--theme-fg)",
          bg: colour ? formatCss(colour) : "var(--theme-bg)",
          tags: []
        }
      }
      acc[sortOrder].tags.push( { tag, description: library.descriptions[tag] ?? "" } );
      return acc;
    }, {[-1]: { name: "Unassigned", hueshade: null, fg: "var(--theme-fg)", bg: "var(--theme-bg)", tags: [] } as TagData} ),
    entries(),
    sortBy( ([k, v]) => k),
    map( ([_, v]) => v )
  )
);

const tagNamespaces = computed<NamespaceData[]>( () => 
  pipe(paletteStore.palette.tags, 
    entries(),
    sortBy( ([t, _]) => t),
    reduce( (acc: { [key: string]: NamespaceData }, [tag, hueshade]) => {
      if(!matchesFilter(tag)) return acc;
      const namespace = tag.split(":")[0];
      const bg = paletteStore.getColourByTag(tag)?.colour;
      if( ! (namespace in acc) ) {
        acc[namespace] = {
          name: namespace,
          unassigned: [],
          tags: [],
        }
      }
      if(!!bg) {
        acc[namespace].tags.push( { 
          tag,
          description: library.descriptions[tag] ?? "",
          bg: formatCss(bg),
          fg: formatCss(paletteStore.fgForColour(bg))
        } );
      } else {
        acc[namespace].unassigned.push( { 
          tag,
          description: library.descriptions[tag] ?? "",
        } );
      }
      return acc;
    }, {} ),
    entries(),
    sortBy( ([k, v]) => k),
    map( ([_, v]) => v )
  )
);

const tagFilterRegex = computed<RegExp|null|undefined>((previous) => {
  if(tagFilter.value == '') {
    return null;
  }
  try {
    return new RegExp(tagFilter.value, 'i');
  } catch {
    return previous;
  }
});

function matchesFilter(tag: string): boolean {
  const pat = tagFilterRegex.value;
  if(pat) {
    return pat.test(tag);
  } else {
    return true;
  }
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
  if(!input.validity.valid) return;
  input.value.split("\n").forEach(tagValue => {
    tagValue = tagValue.trim();
    if(tagValue && ! (tagValue in paletteStore.palette.tags)) {
      paletteStore.palette.tags[tagValue] = null;
    }
  });
  input.value = ""; // Reset the input box
}

const tagVars = computed<{ [key: string]: string }>(() =>
  reduce( entries(paletteStore.palette.tags),  (accum, [tagValue, hueshade]) => {
    if(hueshade) {
      const [hue, shade] = hueshade;
      accum[ '--' + tagValue.replaceAll(":","-",) ] = formatCss(paletteStore.palette.colours[hue][shade]?.colour) ?? "unset";
    }
    return accum;
  }, {})
);

const guesses = computed<[string, [number, number] | null][]>(() => 
  tagGroups.value[0].tags.map<[string, ([number, number] | null)]>(
    t => ([t.tag, (library.guesses[t.tag] ?? ((_) => null))(paletteStore.palette)])
  ).filter( v => v[1] !== null)
);

const hasGuesses = computed(() => guesses.value.length != 0);

function doGuess() {
  do {
    for(let [tag, guess] of guesses.value) {
      paletteStore.palette.tags[tag] = guess;
    }
  } while (hasGuesses.value);
}

</script>

<template>
  <div id="tag-view">
    <div class="tag-controls">
      <label>Group by: <select v-model="groupBy">
        <option value="colour">Assigned Colour</option>
        <option value="namespace">Namespace</option>
      </select></label>
      <label style="flex-grow: 1">Filter tags: <input type="text" v-model="tagFilter"
          placeholder="This is a regex..."></input></label>
      <label style="flex-grow: 0; position: relative">Add tag:
        <input type="text" placeholder="namespace:value" pattern="[^ ]*" @change="onAddTag"></input>
        <span class="validation"></span>
      </label>
      <select style="flex-grow: 0" @change="onAddCollection">
        <option value="">Add collection</option>
        <option v-for="collection in library.collectionList" :value="collection">{{collection}}</option>
      </select>
    </div>
    <div id="tag-tray" class="tray">
      <transition-group name="groups" v-if="groupBy == 'colour'">
        <div v-for="group in tagGroups" :key="group.name" class="tag-group colour-transition" @dragover="onDragTagOver"
          @dragleave="onDragLeave" @drop="onDropTag($event, paletteStore, group.hueshade)">
          <div class="group-title"><span>{{ group.name }}</span></div>
          <transition-group name="chips" tag="div" class="group-chips">
            <div v-for="tag in group.tags" :key="tag.tag" class="tag-chip monospace colour-transition"
              :style="{ color: group.fg, backgroundColor: group.bg }" :title="tag.description" draggable="true"
              @dragstart="onDragTag($event, tag.tag)">#{{ tag.tag }}</div>
          </transition-group>
        </div>
        <div class="hint">
          Drag and drop tags onto the colour swatches on the left, or onto the colour groups above.
        </div>
      </transition-group>
      <transition-group name="groups" v-if="groupBy == 'namespace'">
        <div v-for="group in tagNamespaces" :key="group.name" class="tag-group colour-transition" >
          <div class="group-title"><span>{{ group.name }}</span></div>
          <transition-group name="chips" tag="div" class="group-chips">
            <div class="unassigned-tags" @dragover="onDragTagOver" @dragleave="onDragLeave" @drop="onDropTag($event, paletteStore, null)">
              <div v-for="tag in group.unassigned" :key="tag.tag" class="tag-chip monospace colour-transition"
                :title="tag.description" draggable="true"
                @dragstart="onDragTag($event, tag.tag)">#{{ tag.tag }}</div>
            </div>
            <div v-for="tag in group.tags" :key="tag.tag" class="tag-chip monospace colour-transition"
              :style="{ color: tag.fg, backgroundColor: tag.bg }" :title="tag.description" draggable="true"
              @dragstart="onDragTag($event, tag.tag)">#{{ tag.tag }}</div>
          </transition-group>
        </div>
        <div class="hint">
          Drag and drop tags onto the colour swatches on the left.
        </div>
      </transition-group>
      <div class="toolbox">
        <button :class="{ disabled: !hasGuesses }" @click="doGuess">Guess</button>
        <div class="rubbish tray colour-transition"
          @dragover="onDragTagOver" @dragleave="onDragLeave" @drop="onDropDeleteTag($event, paletteStore)"
        >
          <p class="align-middle align-center">
          <span class="text-bigger">♻</span>
          <br/>
          Drag tags here to delete them.
          </p>
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
    <div id="preview" class="tray" :style="tagVars">
      <component :is="library.previews[selectedPreview]"></component>
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
  position: relative;
}

.toolbox {
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: end;
}

.disabled {
  display: none;
}

.rubbish {
  color: var(--theme-border);
  border-color: var(--theme-border);
  background-color: var(--theme-bg);

  width: 8rem;
  height: 8rem;
}

.hint {
  color: var(--theme-border);
}

.tag-group {
  margin-right: 8rem;
}

.group-chips {
  padding-bottom: 0.2rem;
}

.drag-over {
  background-color: var(--theme-hibg);
  color: var(--theme-hifg);
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

.unassigned-tags {
  display: inline-block;
}
.unassigned-tags::after {
  content: "|";
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  transition: all 150ms;
}

.unassigned-tags.drag-over {
  background-color: unset;
  color: inherit;
}

.unassigned-tags.drag-over::after {
  content: "|";
  padding-left: 1rem;
}

.chips-move, /* apply transition to moving elements */
.chips-enter-active,
.chips-leave-active {
  transition: all 150ms;
}

.chips-enter-from,
.chips-leave-to {
  opacity: 0;
  transform: translateY(-50%);
}

.groups-enter-from,
.groups-leave-to {
  opacity: 0;
}

.groups-enter-active,
.groups-leave-active,
.groups-move {
  transition: all 150ms;
}

.groups-leave-active {
  position: absolute;
}

.tray {
  flex: 1 1 0%;
}

#preview {
  padding: 0;
}

#preview :deep(> *) {
  min-height: 100%;
  min-width: 100%;
  margin: 0;
  padding: 0.5rem;
}

.validation {
  position: absolute;
  height: 100%;
  right: 0.2rem;
  padding: 1px; /* To align with 1px border of input */
}

</style>
