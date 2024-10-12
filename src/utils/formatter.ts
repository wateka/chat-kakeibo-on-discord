function toFullWidth(str: string) {
  return str
    .replace(/[A-Za-z0-9!-/:-@[-`{-~]/g, (c) =>
      String.fromCharCode(c.charCodeAt(0) + 0xfee0),
    )
    .replace(" ", "　");
}

export function truncate(
  str: { toString(): string },
  length: number,
  charWidth: "half" | "full",
  align: "left" | "right",
) {
  const space = charWidth === "full" ? "　" : " ";

  let res = str.toString();
  res = charWidth === "full" ? toFullWidth(res) : res;
  res = res.slice(0, length);
  res =
    align === "left" ? res.padEnd(length, space) : res.padStart(length, space);

  return res;
}

export function formatDate(date: Date) {
  const f_m = ` ${date.getMonth() + 1}`.slice(-2);
  const f_d = ` ${date.getDate()}`.slice(-2);
  const f_ddd = "日月火水木金土".split("")[date.getDay()];

  return `${f_m}/${f_d} ${f_ddd}`;
}
