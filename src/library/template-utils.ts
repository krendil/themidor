import type { usePaletteStore } from "@/stores/palette";
import { formatHex } from "culori";
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

  engine.registerFilter('or', (tag: string, fallback: string) => {
      const member = paletteStore.getColourByTag(tag);
      if(!member) {
          return fallback;
      } else {
          return tag;
      }
  });


  return engine;
}