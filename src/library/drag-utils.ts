import type { usePaletteStore } from "@/stores/palette";

export function onDrag(e: DragEvent, tag: string) {
  if(e.dataTransfer) {
    e.dataTransfer.setData("application/tag", tag);
    e.dataTransfer.effectAllowed = "move";
  }
}

export function onDragLeave(e: DragEvent) {
  if( e.currentTarget instanceof HTMLElement ) {
    e.currentTarget.classList.remove("drag-over");
  }
}

export function onDragOver(e: DragEvent) {
  if(e.dataTransfer?.types.includes("application/tag")) {
    e.dataTransfer.dropEffect = "move";
    if( e.currentTarget instanceof HTMLElement ) {
      e.currentTarget.classList.add("drag-over");
    }
    e.preventDefault();
  }

}

export function onDrop(e: DragEvent, paletteStore: ReturnType<typeof usePaletteStore> , hueshade: [number, number] | null) {
  if(e.dataTransfer?.types.includes("application/tag")) {
    const tag = e.dataTransfer.getData("application/tag");
    paletteStore.palette.tags[tag] = hueshade;
  }
  if( e.currentTarget instanceof HTMLElement ) {
    e.currentTarget.classList.remove("drag-over");
  }
}


export function onDropDelete(e: DragEvent, paletteStore: ReturnType<typeof usePaletteStore>) {
  if(e.dataTransfer?.types.includes("application/tag")) {
    const tag = e.dataTransfer.getData("application/tag");
    delete paletteStore.palette.tags[tag];
  }
  if( e.currentTarget instanceof HTMLElement ) {
    e.currentTarget.classList.remove("drag-over");
  }
}

