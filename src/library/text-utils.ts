export function slugify(input: string): string {
  return input.replace(/[^a-zA-Z0-9_-]+/, '-').toLowerCase();
}