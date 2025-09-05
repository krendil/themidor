import { defineStore } from "pinia";
import { ref, type Component } from "vue";
import { useLibrary } from "./library";


export const useOptions = defineStore("options", () => {

  const library = useLibrary();
  const dynamicTheming = ref(true);

  const contrast = ref({
    asForeground: false
  });

  const tag = ref({
    tagFilter: "",
    groupBy: "colour",
    selectedPreview: library.previewList[0]
  });

  const exportView = ref({
    selectedExporter: library.exporterList[0]
  });

  return {
    contrast,
    dynamicTheming,
    exportView,
    tag,
  };
}, {persist: true});