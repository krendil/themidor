<script setup lang="ts">
import { useLibrary } from '@/stores/library';
import { usePaletteStore } from '@/stores/palette';
import { computed } from 'vue';
import { onDragTag } from '@/library/drag-utils';
import { saveAs } from 'file-saver';

const paletteStore = usePaletteStore();
const library = useLibrary();

const props = defineProps<{
    output: string,
    filename: string,
    mime?: string,
    required: string[],
    recommended: string[]
}>();

const missingRequired = computed(() => props.required
    .filter( t => !paletteStore.getColourByTag(t) )
    .map( t => ({
        tag: t,
        description: library.descriptions[t],
        absent: !(t in paletteStore.palette.tags)
    }))
);

const hasAbsentRequired = computed(() => missingRequired.value.map(t => t.absent).reduce((a, b) => a || b));

const missingRecommended = computed(() => props.recommended
    .filter(t => !paletteStore.getColourByTag(t))
    .map(t => ({
        tag: t,
        description: library.descriptions[t],
        absent: !(t in paletteStore.palette.tags)
    }))
);

const hasAbsentRecommended = computed(() => missingRecommended.value.map(t => t.absent).reduce((a, b) => a || b));

function download() {
    const blob = new Blob([props.output], { type: props.mime ?? 'text/plain' });
    saveAs(blob, props.filename);
}

function addRequired() {
    for(var tag of missingRequired.value) {
        paletteStore.palette.tags[tag.tag] = null;
    }
}

function addRecommended() {
    for(var tag of missingRecommended.value) {
        paletteStore.palette.tags[tag.tag] = null;
    }
}

</script>

<template>
    <slot></slot>
    <div class="warnings">
        <div class="tray" v-if="required.length > 0 || recommended.length > 0">
            <div v-if="missingRequired.length > 0" class="warning">
                Not all required tags are assigned. Exported theme may contain errors.
            </div>
            <div v-if="missingRequired.length > 0" class="tag-group colour-transition">
                <div class="group-title">
                    <span>Required tags:</span>
                    <div v-if="hasAbsentRequired" class="group-button"><button @click="addRequired">Add to project</button></div>
                </div>
                <transition-group name="chips" tag="div" class="group-chips">
                    <div v-for="tag in missingRequired" :key="tag.tag" class="tag-chip monospace colour-transition"
                    :class="{absent: tag.absent}"
                    :title="tag.description" draggable="true"
                    @dragstart="onDragTag($event, tag.tag)">#{{ tag.tag }}</div>
                </transition-group>
            </div>
            <div v-if="missingRecommended.length > 0" class="tag-group colour-transition">
                <div class="group-title">
                    <span>Recommended tags:</span>
                    <div v-if="hasAbsentRecommended" class="group-button"><button @click="addRecommended">Add to project</button></div>
                </div>
                <transition-group name="chips" tag="div" class="group-chips">
                    <div v-for="tag in missingRecommended" :key="tag.tag" class="tag-chip monospace colour-transition"
                    :class="{absent: tag.absent}"
                    :title="tag.description" draggable="true"
                    @dragstart="onDragTag($event, tag.tag)">#{{ tag.tag }}</div>
                </transition-group>
            </div>
            <div v-if="missingRecommended.length == 0 && missingRequired.length == 0" class="valid">
                All tags assigned.
            </div>
        </div>
    </div>
    <div class="preview">
        <label>Output:</label>
        <pre class="tray">{{props.output}}</pre>
    </div>
    <div class="buttons"><button @click="download">Download</button></div>
</template>

<style lang="css" scoped>

.group-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 1.5rem; /* Fix height so there is no adjustment when button appears/disappears */
}

.group-chips {
  padding-bottom: 0.2rem;
}

.tag-chip {
  display: inline-block;

  font-size: small;
  border-style: solid;
  border-width: 1px;
  border-radius: 2px;
  padding: 0.1em;

  margin: 0.1rem;

  cursor: grab;
}

.absent {
    color: var(--theme-hifg);
    border-color: var(--theme-hifg);
    background-color: var(--theme-hibg);
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

.preview {
    flex-grow: 1;
    flex-basis: 50%;
    display: flex;
    flex-direction: column;
    min-height: 3em;

    pre {
        margin: 0;
        flex-grow: 1;
    }
}

.warning::before {
    content: "!";
    font-weight: bold;
    color: var(--theme-bad);
}

.valid::before {
    content: "✔";
    color: var(--theme-good);
}

.warning {
    margin-bottom: 0.5rem;
}


</style>