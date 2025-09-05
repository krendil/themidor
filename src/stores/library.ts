import { defineStore } from "pinia";
import { keys, } from "remeda";
import { computed, markRaw, type Component } from "vue";
import type { Palette } from "@/models/palette";
import { closestTo, shadeUpFrom } from "@/library/palette-utils";

// Previews
import Base24Preview from "@/components/previews/base24.vue";
import TerminalLs from "@/components/previews/terminal-ls.vue";
import DunstPreview from "@/components/previews/dunst.vue";
import NiriPreview from "@/components/previews/niri.vue";
import FuzzelPreview from "@/components/previews/fuzzel.vue";

// Exporters
import Base24 from "@/components/exporters/Base24.vue";
import Css from "@/components/exporters/Css.vue";
import Custom from "@/components/exporters/Custom.vue";
import Dunst from "@/components/exporters/Dunst.vue";
import Fuzzel from "@/components/exporters/Fuzzel.vue";
import Ghostty from "@/components/exporters/Ghostty.vue";
import Niri from "@/components/exporters/Niri.vue";
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

    "dunst:low:bg": "Dunst background colour for low urgency notifications",
    "dunst:low:fg": "Dunst text colour for low urgency notifications",
    "dunst:low:frame": "Dunst border colour for low urgency notifications",
    "dunst:normal:bg": "Dunst background colour for normal notifications",
    "dunst:normal:fg": "Dunst text colour for normal notifications",
    "dunst:normal:frame": "Dunst border colour for normal notifications",
    "dunst:urgent:bg": "Dunst background colour for urgent notifications",
    "dunst:urgent:fg": "Dunst text colour for urgent notifications",
    "dunst:urgent:frame": "Dunst border colour for urgent notifications",

    "fuzzel:background": "Background colour",
    "fuzzel:text": "Text colour of unselected entries",
    "fuzzel:prompt": "Text colour of prompt character(s)",
    "fuzzel:placeholder": "Text colour of the placeholder string",
    "fuzzel:input": "Text colour of input string",
    "fuzzel:match": "Text colour of the matched substring",
    "fuzzel:selection": "Background colour of the selected entry",
    "fuzzel:selection-text": "Text colour of the selected entry",
    "fuzzel:selection-match": "Text colour of the matched substring of the selected entry",
    "fuzzel:counter": "The colour of the match count stats printed at the right-hand side of the input prompt",
    "fuzzel:border": "Border colour",

    "niri:focus:active": "Colour of the focus ring around the active window",
    "niri:focus:inactive": "Colour of the focus ring around the focused window on an inactive display",
    "niri:focus:urgent": "Colour of the focus ring around an urgent window",
    "niri:border:active": "Colour of the border around the active window",
    "niri:border:inactive": "Colour of the border around inactive windows",
    "niri:border:urgent": "Colour of the border around an urgent window",
    "niri:tab:active": "Colour of the tab indicator for the active tab",
    "niri:tab:inactive": "Colour of the tab indicator for inactive tabs",
    "niri:tab:urgent": "Colour of the tab indicator for urgent tabs",
    "niri:shadow": "Shadow colour for the active window",
    "niri:shadow:inactive": "Shadow colour for inactive windows, if different to the active window",
    "niri:insert-hint": "Colour of the insert location hint",
    "niri:background": "Default workspace background when no wallpaper is set",
    "niri:backdrop": "Backdrop colour for the overview when no backdrop wallpaper is set",
    "niri:workspace-shadow": "Shadow colour for workspaces in the overview",

    "term:00":"Terminal Black",
    "term:01":"Terminal Red",
    "term:02":"Terminal Green",
    "term:03":"Terminal Yellow",
    "term:04":"Terminal Blue",
    "term:05":"Terminal Purple",
    "term:06":"Terminal Cyan",
    "term:07":"Terminal White",
    "term:08":"Terminal Bright black",
    "term:09":"Terminal Bright red",
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

    "tmdr:accent": "Themidor accent colour",
    "tmdr:bad": "Themidor 'bad' colour for failing validation",
    "tmdr:bg": "Themidor main background",
    "tmdr:border": "Themidor border colour",
    "tmdr:darkfg": "Themidor dark foreground colour, for use on light backgrounds", // A Foreground that is dark, not dark-mode foreground
    "tmdr:fg": "Themidor main foreground",
    "tmdr:good": "Themidor 'good' colour for passing validation",
    "tmdr:grey": "Themidor neutral grey",
    "tmdr:hibg": "Themidor highlighted background",
    "tmdr:hifg": "Themidor highlighted foreground",
    "tmdr:lightfg": "Themidor light foreground colour, for use on dark backgrounds", // A Foreground that is light, not light-mode foreground
  };

  const collections: { [key: string]: Collection } = {
    Terminal: {
      tags: [
        "term:cursor",
        "term:bg",
        "term:fg",
        "term:00",
        "term:01",
        "term:02",
        "term:03",
        "term:04",
        "term:05",
        "term:06",
        "term:07",
        "term:08",
        "term:09",
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
    Dunst: {
      tags: [
        "dunst:low:bg",
        "dunst:low:fg",
        "dunst:low:frame",
        "dunst:normal:bg",
        "dunst:normal:fg",
        "dunst:normal:frame",
        "dunst:urgent:bg",
        "dunst:urgent:fg",
        "dunst:urgent:frame",
      ]
    },
    Fuzzel: {
      tags: [
        "fuzzel:background",
        "fuzzel:text",
        "fuzzel:prompt",
        "fuzzel:placeholder",
        "fuzzel:input",
        "fuzzel:match",
        "fuzzel:selection",
        "fuzzel:selection-text",
        "fuzzel:selection-match",
        "fuzzel:counter",
        "fuzzel:border",
      ]
    },
    Niri: {
      tags: [

        "niri:focus:active",
        "niri:focus:inactive",
        "niri:focus:urgent",
        "niri:border:active",
        "niri:border:inactive",
        "niri:border:urgent",
        "niri:tab:active",
        "niri:tab:inactive",
        "niri:tab:urgent",
        "niri:shadow",
        "niri:shadow:inactive",
        "niri:insert-hint",
        "niri:background",
        "niri:backdrop",
        "niri:workspace-shadow",

      ]
    },
  };

  const previews: { [key: string]: Component } = {
    "Base 24": markRaw(Base24Preview),
    "Dunst": markRaw(DunstPreview),
    "Fuzzel": markRaw(FuzzelPreview),
    "Niri": markRaw(NiriPreview),
    "Terminal": markRaw(TerminalLs)
  };

  const exporters: { [key: string]: Component } = {
    "Base24": markRaw(Base24),
    "CSS Variables": markRaw(Css),
    "Custom": markRaw(Custom),
    "Dunst": markRaw(Dunst),
    "Fuzzel": markRaw(Fuzzel),
    "Ghostty": markRaw(Ghostty),
    "Niri": markRaw(Niri),
    "Rxvt-Unicode": markRaw(Urxvt),
    "Simple": markRaw(Simple),
    "Themidor": markRaw(Themidor),
  };

  type GuessFn = (palette: Palette) => ([number, number] | null) ;

  const guesses: { [key: string]: GuessFn } = {
    "b24:00": (palette) => palette.tags["term:bg"] ?? palette.tags["term:00"] ?? null,
    "b24:01": (palette) => shadeUpFrom(palette, "b24:00"),
    "b24:02": (palette) => palette.tags["term:08"] ?? null,
    "b24:03": (palette) => shadeUpFrom(palette, "b24:02") ?? palette.tags["tmdr:grey"] ?? null,
    "b24:04": (palette) => shadeUpFrom(palette, "b24:03"),
    "b24:05": (palette) => palette.tags["term:fg"] ?? null,
    "b24:06": (palette) => palette.tags["term:07"] ?? shadeUpFrom(palette, "b24:05"),
    "b24:07": (palette) => shadeUpFrom(palette, "b24:06") ?? closestTo(palette, "#FFFFFF"),
    "b24:08": (palette) => palette.tags["term:01"] ?? closestTo(palette, "#FF0000"),
    "b24:09": (palette) => palette.tags["term:03"] ?? closestTo(palette, "#FF7F00"),
    "b24:0A": (palette) => palette.tags["term:03"] ?? closestTo(palette, "#FFFF00"),
    "b24:0B": (palette) => palette.tags["term:02"] ?? closestTo(palette, "#00FF00"),
    "b24:0C": (palette) => palette.tags["term:06"] ?? closestTo(palette, "#00FFFF"),
    "b24:0D": (palette) => palette.tags["term:04"] ?? closestTo(palette, "#0000FF"),
    "b24:0E": (palette) => palette.tags["term:05"] ?? closestTo(palette, "#FF00FF"),
    "b24:0F": (palette) => closestTo(palette, "#7F3F00"),
    // "b24:10": (palette) => null,
    "b24:11": (palette) => closestTo(palette, "#000000"),
    "b24:12": (palette) => palette.tags["term:09"] ?? shadeUpFrom(palette, "b24:08") ?? null,
    "b24:13": (palette) => palette.tags["term:11"] ?? shadeUpFrom(palette, "b24:0A") ?? null,
    "b24:14": (palette) => palette.tags["term:10"] ?? shadeUpFrom(palette, "b24:0B") ?? null,
    "b24:15": (palette) => palette.tags["term:14"] ?? shadeUpFrom(palette, "b24:0C") ?? null,
    "b24:16": (palette) => palette.tags["term:12"] ?? shadeUpFrom(palette, "b24:0D") ?? null,
    "b24:17": (palette) => palette.tags["term:13"] ?? shadeUpFrom(palette, "b24:0E") ?? null,

    "dunst:low:bg": (palette) => palette.tags["tmdr:bg"] ?? null,
    "dunst:low:fg": (palette) => palette.tags["tmdr:fg"] ?? null,
    "dunst:low:frame": (palette) => palette.tags["tmdr:border"] ?? null,
    "dunst:normal:bg": (palette) => palette.tags["tmdr:bg"] ?? null,
    "dunst:normal:fg": (palette) => palette.tags["tmdr:fg"] ?? null,
    "dunst:normal:frame": (palette) => palette.tags["tmdr:fg"] ?? null,
    "dunst:urgent:bg": (palette) => palette.tags["tmdr:bg"] ?? null,
    "dunst:urgent:fg": (palette) => palette.tags["tmdr:fg"] ?? null,
    "dunst:urgent:frame": (palette) => palette.tags["tmdr:bad"] ?? null,

    "fuzzel:background": (palette) => palette.tags["tmdr:bg"] ?? null,
    "fuzzel:text": (palette) => palette.tags["tmdr:fg"] ?? null,
    "fuzzel:prompt": (palette) => palette.tags["tmdr:fg"] ?? null,
    "fuzzel:placeholder": (palette) => palette.tags["tmdr:border"] ?? null,
    "fuzzel:input": (palette) => palette.tags["tmdr:fg"] ?? null,
    "fuzzel:match": (palette) => palette.tags["tmdr:good"] ?? null,
    "fuzzel:selection": (palette) => palette.tags["tmdr:hibg"] ?? null,
    "fuzzel:selection-text": (palette) => palette.tags["tmdr:hifg"] ?? null,
    "fuzzel:selection-match": (palette) => palette.tags["tmdr:hifg"] ?? null,
    "fuzzel:counter": (palette) => palette.tags["tmdr:fg"] ?? null,
    "fuzzel:border": (palette) => palette.tags["tmdr:border"] ?? null,


    "niri:focus:active": (p) => p.tags["tmdr:accent"] ?? null,
    "niri:focus:inactive": (p) => p.tags["tmdr:border"] ?? null,
    "niri:focus:urgent": (p) => p.tags["tmdr:bad"] ?? null,
    // "niri:border:active": (p) => null,
    // "niri:border:inactive": (p) => null,
    // "niri:border:urgent": (p) => null,
    "niri:tab:active": (p) => p.tags["tmdr:accent"] ?? null,
    "niri:tab:inactive": (p) => p.tags["tmdr:border"] ?? null,
    "niri:tab:urgent": (p) => p.tags["tmdr:bad"] ?? null,
    "niri:shadow": (p) => closestTo(p, "#000000"),
    // "niri:shadow:inactive": (p) => null,
    // "niri:insert-hint": (p) => null,
    "niri:background": (p) => p.tags["tmdr:bg"] ?? null,
    "niri:backdrop": (p) => p.tags["tmdr:grey"] ?? null,
    "niri:workspace-shadow": (p) => p.tags["niri:shadow"] ?? closestTo(p, "#000000"),

    "term:bg": (palette) => palette.tags["term:00"] ?? null,
    "term:fg": (palette) => palette.tags["term:07"] ?? null,
    "term:cursor": (palette) => palette.tags["tmdr:fg"] ?? null,
    "term:selectionbg": (palette) => palette.tags["term:fg"] ?? null,

    "term:00": (palette) => closestTo(palette, "#000000"),
    "term:01": (palette) => closestTo(palette, "#FF0000"),
    "term:02": (palette) => closestTo(palette, "#00FF00"),
    "term:03": (palette) => closestTo(palette, "#FFFF00"),
    "term:04": (palette) => closestTo(palette, "#0000FF"),
    "term:05": (palette) => closestTo(palette, "#FF00FF"),
    "term:06": (palette) => closestTo(palette, "#00FFFF"),
    "term:07": (palette) => closestTo(palette, "#ABABAB"),

    "term:08": (palette) => shadeUpFrom(palette, "term:00"),
    "term:09": (palette) => shadeUpFrom(palette, "term:01"),
    "term:10": (palette) => shadeUpFrom(palette, "term:02"),
    "term:11": (palette) => shadeUpFrom(palette, "term:03"),
    "term:12": (palette) => shadeUpFrom(palette, "term:04"),
    "term:13": (palette) => shadeUpFrom(palette, "term:05"),
    "term:14": (palette) => shadeUpFrom(palette, "term:06"),
    "term:15": (palette) => shadeUpFrom(palette, "term:07"),
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