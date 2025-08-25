import type { usePaletteStore } from "@/stores/palette";
import { formatCss, formatHex, formatRgb, rgb } from "culori";
import { Liquid } from "liquidjs";

export function makeLiquidEngine(paletteStore: ReturnType<typeof usePaletteStore>): Liquid {

  const engine = new Liquid();

  engine.registerFilter('hex', (tag: string) => {
      const member = paletteStore.getColourByTag(tag);
      if(!member) {
          return "";
      } else {
          return formatHex(member.colour);
      }
  });

  engine.registerFilter('css', (tag: string) => {
      const member = paletteStore.getColourByTag(tag);
      if(!member) {
          return "";
      } else {
          return formatCss(member.colour);
      }
  });

  engine.registerFilter('rgb', (tag: string, sep: ", ") => {
      const member = paletteStore.getColourByTag(tag);
      if(!member) {
          return "";
      } else {
          const rgbColour = rgb(member.colour);
          return [
            Math.round(rgbColour.r * 255),
            Math.round(rgbColour.g * 255),
            Math.round(rgbColour.b * 255)
        ].join(sep)
      }
  });

  engine.registerFilter('r', (tag: string) => {
      const member = paletteStore.getColourByTag(tag);
      if(!member) {
          return "";
      } else {
          const rgbColour = rgb(member.colour);
          return Math.round(rgbColour.r * 255);
      }
  });

  engine.registerFilter('g', (tag: string) => {
      const member = paletteStore.getColourByTag(tag);
      if(!member) {
          return "";
      } else {
          const rgbColour = rgb(member.colour);
          return Math.round(rgbColour.g * 255);
      }
  });

  engine.registerFilter('b', (tag: string) => {
      const member = paletteStore.getColourByTag(tag);
      if(!member) {
          return "";
      } else {
          const rgbColour = rgb(member.colour);
          return Math.round(rgbColour.b * 255);
      }
  });

  engine.registerFilter('or', (tag: string, fallback: string) => {
      const member = paletteStore.getColourByTag(tag);
      if(!member) {
          return fallback;
      } else {
          return tag;
      }
  });

  engine.registerFilter('isTagged', (tag: string) => !!paletteStore.getColourByTag(tag) );

  return engine;
}