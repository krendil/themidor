import type { Tag } from "./tag";
import { oklch } from "culori";
import type { Color } from "culori";

export interface Palette {
  name: string;

  hues: string[];
  shades: string[];

  // Indexed by hues first, then shades
  colours: (PaletteMember | null)[][];

  tags: { [key: string]: [number, number] }
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
    shades: ['Dim', 'Regular', 'Bright'],
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
      "spate:fg": [1, 1],
      "spate:bg": [0, 2],
      "spate:lightfg": [0, 2], // A Foreground that is light, not light-mode foreground
      "spate:darkfg": [1, 1], // A Foreground that is dark, not dark-mode foreground
      "spate:hifg": [1, 0],
      "spate:hibg": [0, 1],
      "spate:grey": [0, 0],
      "spate:border": [0, 0]
    }
  };
}