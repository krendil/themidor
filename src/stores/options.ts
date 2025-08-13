import { defineStore } from "pinia";
import { ref, type Component } from "vue";

export const useOptions = defineStore("options", () => {

  const dynamicTheming = ref(true);

  return {
    dynamicTheming,
  };
}, {persist: true});