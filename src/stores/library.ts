import { defineStore } from "pinia";
import { keys, pipe, sort } from "remeda";
import { computed, markRaw, type Component } from "vue";
import type { Palette } from "@/models/palette";
import { closestTo, shadeUpFrom } from "@/library/palette-utils";

// Previews
import terminal_ls from "@/previews/terminal-ls.html?raw";

// Exporters
import Base24 from "@/components/exporters/Base24.vue";
import Custom from "@/components/exporters/Custom.vue";
import Ghostty from "@/components/exporters/Ghostty.vue";
import Simple from "@/components/exporters/Simple.vue";
import Themidor from "@/components/exporters/Themidor.vue";
import Urxvt from "@/components/exporters/Urxvt.vue";

export interface Collection {
  tags: string[],
}

export const useLibrary = defineStore("library", () => {

  const descriptions: { [key: string]: string } = {
    "b24:00": "Base24 Background",
    "b24:01": "Base24 Darkest Gray",
    "b24:02": "Base24 Bright Black",
    "b24:03": "Base24 Grey",
    "b24:04": "Base24 Light Grey",
    "b24:05": "Base24 Foreground",
    "b24:06": "Base24 White",
    "b24:07": "Base24 Bright White",
    "b24:08": "Base24 Red",
    "b24:09": "Base24 Orange",
    "b24:0A": "Base24 Yellow",
    "b24:0B": "Base24 Green",
    "b24:0C": "Base24 Cyan",
    "b24:0D": "Base24 Blue",
    "b24:0E": "Base24 Magenta",
    "b24:0F": "Base24 Dark Red or Brown",
    "b24:10": "Base24 Darker Black",
    "b24:11": "Base24 Darkest Black",
    "b24:12": "Base24 Bright Red",
    "b24:13": "Base24 Bright Yellow",
    "b24:14": "Base24 Bright Green",
    "b24:15": "Base24 Bright Cyan",
    "b24:16": "Base24 Bright Blue",
    "b24:17": "Base24 Bright Magenta",

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
    "term:selectionbg":"Terminal background colour of selected text",
    "term:selectionfg":"Terminal colour of selected text",
    "term:cursorfg":"Terminal colour of text under the cursor",

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

        "term:selectionbg",
        "term:selectionfg",
        "term:cursorfg",
      ],
    },
    Base24: {
      tags: [
        "b24:00",
        "b24:01",
        "b24:02",
        "b24:03",
        "b24:04",
        "b24:05",
        "b24:06",
        "b24:07",
        "b24:08",
        "b24:09",
        "b24:0A",
        "b24:0B",
        "b24:0C",
        "b24:0D",
        "b24:0E",
        "b24:0F",
        "b24:10",
        "b24:11",
        "b24:12",
        "b24:13",
        "b24:14",
        "b24:15",
        "b24:16",
        "b24:17",
      ],
    },
    "Vim syntax highlighting": {
      tags: [],
    },
    "Vim editor decorations": {
      tags: [],
    },
    Treesitter: {
      tags: [],
    },
    Textmate: {
      tags: [],
    },
    "Visual Studio Code editor decorations": {
      tags: [],
    },
  };

  const previews: { [key: string]: string } = {
    "Terminal: ls": terminal_ls
  };

  const exporters: { [key: string]: Component } = {
    "Base24": markRaw(Base24),
    "Rxvt-Unicode": markRaw(Urxvt),
    "Themidor": markRaw(Themidor),
    "Ghostty": markRaw(Ghostty),
    "Custom": markRaw(Custom),
    "Simple": markRaw(Simple),
  };

  type GuessFn = (palette: Palette) => ([number, number] | null) ;

  const guesses: { [key: string]: GuessFn } = {
    "b24:00": (palette) => palette.tags["term:bg"] ?? palette.tags["term:0"] ?? null,
    "b24:01": (palette) => shadeUpFrom(palette, "b24:00"),
    "b24:02": (palette) => palette.tags["term:8"] ?? null,
    "b24:03": (palette) => shadeUpFrom(palette, "b24:02") ?? palette.tags["tmdr:grey"] ?? null,
    "b24:04": (palette) => shadeUpFrom(palette, "b24:03"),
    "b24:05": (palette) => palette.tags["term:fg"] ?? null,
    "b24:06": (palette) => palette.tags["term:7"] ?? shadeUpFrom(palette, "b24:05"),
    "b24:07": (palette) => shadeUpFrom(palette, "b24:06") ?? closestTo(palette, "#FFFFFF"),
    "b24:08": (palette) => palette.tags["term:1"] ?? closestTo(palette, "#FF0000"),
    "b24:09": (palette) => palette.tags["term:3"] ?? closestTo(palette, "#FF7F00"),
    "b24:0A": (palette) => palette.tags["term:3"] ?? closestTo(palette, "#FFFF00"),
    "b24:0B": (palette) => palette.tags["term:2"] ?? closestTo(palette, "#00FF00"),
    "b24:0C": (palette) => palette.tags["term:6"] ?? closestTo(palette, "#00FFFF"),
    "b24:0D": (palette) => palette.tags["term:4"] ?? closestTo(palette, "#0000FF"),
    "b24:0E": (palette) => palette.tags["term:5"] ?? closestTo(palette, "#FF00FF"),
    "b24:0F": (palette) => closestTo(palette, "#7F3F00"),
    // "b24:10": (palette) => null,
    "b24:11": (palette) => closestTo(palette, "#000000"),
    "b24:12": (palette) => palette.tags["term:9"] ?? shadeUpFrom(palette, "b24:08") ?? null,
    "b24:13": (palette) => palette.tags["term:11"] ?? shadeUpFrom(palette, "b24:0A") ?? null,
    "b24:14": (palette) => palette.tags["term:10"] ?? shadeUpFrom(palette, "b24:0B") ?? null,
    "b24:15": (palette) => palette.tags["term:14"] ?? shadeUpFrom(palette, "b24:0C") ?? null,
    "b24:16": (palette) => palette.tags["term:12"] ?? shadeUpFrom(palette, "b24:0D") ?? null,
    "b24:17": (palette) => palette.tags["term:13"] ?? shadeUpFrom(palette, "b24:0E") ?? null,

    "term:bg": (palette) => palette.tags["term:0"] ?? null,
    "term:fg": (palette) => palette.tags["term:7"] ?? null,
    "term:cursor": (palette) => palette.tags["tmdr:fg"] ?? null,
    "term:selectionbg": (palette) => palette.tags["term:fg"] ?? null,

    "term:0": (palette) => closestTo(palette, "#000000"),
    "term:1": (palette) => closestTo(palette, "#FF0000"),
    "term:2": (palette) => closestTo(palette, "#00FF00"),
    "term:3": (palette) => closestTo(palette, "#FFFF00"),
    "term:4": (palette) => closestTo(palette, "#0000FF"),
    "term:5": (palette) => closestTo(palette, "#FF00FF"),
    "term:6": (palette) => closestTo(palette, "#00FFFF"),
    "term:7": (palette) => closestTo(palette, "#ABABAB"),

    "term:8": (palette) => shadeUpFrom(palette, "term:0"),
    "term:9": (palette) => shadeUpFrom(palette, "term:1"),
    "term:10": (palette) => shadeUpFrom(palette, "term:2"),
    "term:11": (palette) => shadeUpFrom(palette, "term:3"),
    "term:12": (palette) => shadeUpFrom(palette, "term:4"),
    "term:13": (palette) => shadeUpFrom(palette, "term:5"),
    "term:14": (palette) => shadeUpFrom(palette, "term:6"),
    "term:15": (palette) => shadeUpFrom(palette, "term:7"),
  };


  const collectionList = computed(() =>
    keys(collections).sort());
  
  const previewList = computed(() =>
    keys(previews).sort());

  const exporterList = computed(() =>
    keys(exporters).sort());


  return {
    collectionList,
    collections,
    descriptions,
    exporterList,
    exporters,
    guesses,
    previewList,
    previews,
  };
});