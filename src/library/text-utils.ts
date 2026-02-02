export function slugify(input: string): string {
  return input.replaceAll(/[^a-zA-Z0-9_-]+/g, '-').toLowerCase();
}