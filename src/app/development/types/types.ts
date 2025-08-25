enum Countries {
  US = "United States",
  CN = "China",
  IN = "India",
  JP = "Japan",
  BR = "Brazil",
  RU = "Russia",
  DE = "Germany",
}

export function getCountryName(code: string): string {
  return Countries[code as keyof typeof Countries] || code;
}
