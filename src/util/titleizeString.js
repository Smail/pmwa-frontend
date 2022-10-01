export function titleizeString(string) {
  return string
    .split("\n")
    .map(line => line.toLowerCase()
      .split(" ")
      .map(s => s.charAt(0).toUpperCase() + s.substring(1))
      .join(" "))
    .join("\n");
}
