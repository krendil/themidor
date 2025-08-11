import { defineStore } from "pinia";

import terminal_ls from "@/previews/terminal-ls.html?raw";
import { chain } from "lodash-es";
import { computed } from "vue";

export interface Collection {
  tags: string[],
  previews: string[]
}

export const useLibrary = defineStore("library", () => {

  const descriptions: { [key: string]: string } = {
    "term:0":"Terminal Black",
    "term:1":"Terminal Red",
    "term:2":"Terminal Green",
    "term:3":"Terminal Yellow",
    "term:4":"Terminal Blue",
    "term:5":"Terminal Purple",
    "term:6":"Terminal Cyan",
    "term:7":"Terminal White",
    "term:8":"Terminal Bright black",
    "term:9":"Terminal Bright red",
    "term:10":"Terminal Bright green",
    "term:11":"Terminal Bright yellow",
    "term:12":"Terminal Bright blue",
    "term:13":"Terminal Bright purple",
    "term:14":"Terminal Bright cyan",
    "term:15":"Terminal Bright white",
    "term:bg":"Terminal background",
    "term:cursor":"Terminal cursor",
    "term:fg":"Terminal foreground",

    "tmdr:fg": "Themidor main foreground",
    "tmdr:bg": "Themidor main background",
    "tmdr:lightfg": "Themidor light foreground colour, for use on dark backgrounds", // A Foreground that is light, not light-mode foreground
    "tmdr:darkfg": "Themidor dark foreground colour, for use on light backgrounds", // A Foreground that is dark, not dark-mode foreground
    "tmdr:hifg": "Themidor highlighted foreground",
    "tmdr:hibg": "Themidor highlighted background",
    "tmdr:grey": "Themidor neutral grey",
    "tmdr:border": "Themidor border colour",
  };

  const collections: { [key: string]: Collection } = {
    Terminal: {
      tags: [
        "term:cursor",
        "term:bg",
        "term:fg",
        "term:0",
        "term:1",
        "term:2",
        "term:3",
        "term:4",
        "term:5",
        "term:6",
        "term:7",
        "term:8",
        "term:9",
        "term:10",
        "term:11",
        "term:12",
        "term:13",
        "term:14",
        "term:15",
      ],
      previews: ["Terminal Ls"],
    },
    "Vim syntax highlighting": {
      tags: [],
      previews: [
        "Vim Typescript",
        "Vim Python",
        "Vim C",
        "Vim Rust",
        "Vim Zig",
        "Vim Bash",
      ],
    },
    "Vim editor decorations": {
      tags: [],
      previews: [
        "Vim Typescript",
        "Vim Python",
        "Vim C",
        "Vim Rust",
        "Vim Zig",
        "Vim Bash",
      ],
    },
    Treesitter: {
      tags: [],
      previews: [
        "TS Typescript",
        "TS Python",
        "TS C",
        "TS Rust",
        "TS Zig",
        "TS Bash",
        "TS Markdown",
      ],
    },
    Textmate: {
      tags: [],
      previews: [
        "TM Typescript",
        "TM Python",
        "TM C",
        "TM Rust",
        "TM Zig",
        "TM Bash",
        "TM Markdown",
      ],
    },
    "Visual Studio Code editor decorations": {
      tags: [],
      previews: ["VS Code"],
    },
  };

  const previews: { [key: string]: string } = {
    "Terminal: ls": terminal_ls
  };

  const collectionList = computed(() =>
    chain(collections)
      .keys()
      .sort()
      .value());
  
  const previewList = computed(() =>
    chain(previews)
      .keys()
      .sort()
      .value());

  return { collections, previews, descriptions, collectionList, previewList };
});