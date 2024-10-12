export function toFullWidth(str: string) {
  return str
    .replace(/[A-Za-z0-9!-/:-@[-`{-~]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0xFEE0))
    .replace(" ", "　");
}
