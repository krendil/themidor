import { oklch } from "culori";
import type { Color } from "culori";
import { toPairs } from "lodash-es";

export interface Palette {
  name: string;

  hues: string[];
  shades: string[];

  // Indexed by hues first, then shades
  colours: (PaletteMember | null)[][];

  tags: { [key: string]: [number, number] | null }
}

export interface PaletteMember {
  name?: string;
  colour: Color;
}

const backupColour: Color = { mode: 'rgb', r: 0, g: 0, b: 0 };

export function defaultPalette(): Palette {
  return {
    name: 'New Palette',
    hues: ['White', 'Black', 'Red', 'Yellow', 'Green', 'Cyan', 'Blue', 'Purple'],
    shades: ['Dim', 'Medium', 'Bright'],
    colours: [
      [
        {
          colour: oklch('oklch(0.7 0 0)') ?? backupColour,
        },
        {
          colour: oklch('oklch(0.9 0 0)') ?? backupColour,
        },
        {
          colour: oklch('oklch(1 0 0)') ?? backupColour,
        },
      ],
      [
        {
          colour: oklch('oklch(0 0 0)') ?? backupColour,
        },
        {
          colour: oklch('oklch(0.3 0 0)') ?? backupColour,
        },
        {
          colour: oklch('oklch(0.5 0 0)') ?? backupColour,
        },
      ],
      [ // Red
        {
          colour: oklch('oklch(0.25 0.3 30)') ?? backupColour,
        },
        {
          colour: oklch('oklch(0.5 0.3 30)') ?? backupColour,
        },
        {
          colour: oklch('oklch(0.75 0.3 30)') ?? backupColour,
        },
      ],
      [ // Yellow
        {
          colour: oklch('oklch(0.25 0.3 90)') ?? backupColour,
        },
        {
          colour: oklch('oklch(0.5 0.3 90)') ?? backupColour,
        },
        {
          colour: oklch('oklch(0.75 0.3 90)') ?? backupColour,
        },
      ],
      [ // Green
        {
          colour: oklch('oklch(0.25 0.3 120)') ?? backupColour,
        },
        {
          colour: oklch('oklch(0.5 0.3 120)') ?? backupColour,
        },
        {
          colour: oklch('oklch(0.75 0.3 120)') ?? backupColour,
        },
      ],
      [ // Cyan
        {
          colour: oklch('oklch(0.25 0.3 180)') ?? backupColour,
        },
        {
          colour: oklch('oklch(0.5 0.3 180)') ?? backupColour,
        },
        {
          colour: oklch('oklch(0.75 0.3 180)') ?? backupColour,
        },
      ],
      [ // Blue
        {
          colour: oklch('oklch(0.25 0.3 240)') ?? backupColour,
        },
        {
          colour: oklch('oklch(0.5 0.3 240)') ?? backupColour,
        },
        {
          colour: oklch('oklch(0.75 0.3 240)') ?? backupColour,
        },
      ],
      [ // Purple
        {
          colour: oklch('oklch(0.25 0.3 300)') ?? backupColour,
        },
        {
          colour: oklch('oklch(0.5 0.3 300)') ?? backupColour,
        },
        {
          colour: oklch('oklch(0.75 0.3 300)') ?? backupColour,
        },
      ],
    ],
    tags: {
      "tmdr:fg": [1, 1],
      "tmdr:bg": [0, 2],
      "tmdr:lightfg": [0, 2], // A Foreground that is light, not light-mode foreground
      "tmdr:darkfg": [1, 1], // A Foreground that is dark, not dark-mode foreground
      "tmdr:hifg": [1, 0],
      "tmdr:hibg": [0, 1],
      "tmdr:grey": [0, 0],
      "tmdr:border": [0, 0],
      "tmdr:bad": [2, 1],
      "tmdr:good": [4, 1],
    }
  };
}

export function isPalette(obj: any): obj is Palette {
  if( typeof obj !== "object" ) {
    return false;
  }

  if( typeof obj["name"] !== "string" ) {
    return false;
  }

  if( !Array.isArray(obj["hues"])) {
    return false;
  }
  if( obj.hues.some( h => typeof h !== "string" ) ) {
    return false;
  }

  if( !Array.isArray(obj["shades"])) {
    return false;
  }
  if( obj.shades.some( h => typeof h !== "string" ) ) {
    return false;
  }

  if( !Array.isArray(obj["colours"])) {
    return false;
  }
  if( obj.colours.length != obj.hues.length ) {
    return false;
  }
  if( obj.colours.some( row => {
    if( !Array.isArray(row) ) {
      return true;
    }
    if( row.length != obj.shades.length ) {
      return true;
    }
    if( row.some( member => {
      if( member === null ) {
        return false; // Null is OK!
      }
      if( typeof member !== "object" ) {
        return true;
      }
      if( "name" in member && typeof member.name !== "string" ) {
        return true;
      }
      if( typeof member["colour"] !== "object" ) {
        return true;
      }
      // TODO: further validate that colour objects are valid colours
    }) ) {
      return true;
    }
  }) ) {
    return false;
  }

  if( typeof obj["tags"] !== "object" ) {
    return false;
  }
  if( toPairs(obj.tags).some( ([tag, hueshade]) => {
    if(typeof tag !== "string") {
      return true;
    }
    if(hueshade === null) {
      return false; // Null is OK
    }
    if(!Array.isArray(hueshade)) {
      return true;
    }
    if(hueshade.length != 2) {
      return true;
    }
    if(hueshade[0] < 0 || hueshade[0] >= obj.hues.length) {
      return true;
    }
    if(hueshade[1] < 0 || hueshade[1] >= obj.shades.length) {
      return true;
    }
  })) {
    return false;
  }

  return true;
}