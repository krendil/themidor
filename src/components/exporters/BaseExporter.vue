<script setup lang="ts">
import { useLibrary } from '@/stores/library';
import { usePaletteStore } from '@/stores/palette';
import { computed } from 'vue';
import { onDrag } from '@/library/drag-utils';
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
        description: library.descriptions[t]
    }))
);

const missingRecommended = computed(() => props.recommended
    .filter(t => !paletteStore.getColourByTag(t))
    .map(t => ({
        tag: t,
        description: library.descriptions[t]
    }))
);

function download() {
    const blob = new Blob([props.output], { type: props.mime ?? 'text/plain' });
    saveAs(blob, props.filename);
}

</script>

<template>
    <div class="options"><slot></slot></div>
    <div class="warnings">
        <div class="tray">
            <div v-if="missingRequired.length > 0" class="warning">
                Not all required tags are assigned. Exported theme may contain errors.
            </div>
            <div v-if="missingRequired.length > 0" class="tag-group colour-transition">
                <div class="group-title"><span>Required tags:</span></div>
                <transition-group name="chips" tag="div" class="group-chips">
                    <div v-for="tag in missingRequired" :key="tag.tag" class="tag-chip monospace colour-transition"
                    :title="tag.description" draggable="true"
                    @dragstart="onDrag($event, tag.tag)">#{{ tag.tag }}</div>
                </transition-group>
            </div>
            <div v-if="missingRecommended.length > 0" class="tag-group colour-transition">
                <div class="group-title"><span>Recommended tags:</span></div>
                <transition-group name="chips" tag="div" class="group-chips">
                    <div v-for="tag in missingRecommended" :key="tag.tag" class="tag-chip monospace colour-transition"
                    :title="tag.description" draggable="true"
                    @dragstart="onDrag($event, tag.tag)">#{{ tag.tag }}</div>
                </transition-group>
            </div>
            <div v-if="missingRecommended.length == 0 && missingRequired.length == 0" class="valid">
                All tags assigned.
            </div>
        </div>
    </div>
    <div class="preview">
        <label>Preview:</label>
        <pre class="tray">{{props.output}}</pre>
    </div>
    <div class="buttons"><button @click="download">Download</button></div>
</template>

<style lang="css" scoped>

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

  border-color: currentColor;

  margin: 0.1rem;

  cursor: grab;
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
    display: flex;
    flex-direction: column;

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