import { formatCurrency } from "@/utils";

export function formatGDPValue(value: number) {
  if (value >= 1000000000000) {
    const trillions = (value / 1000000000000).toFixed(2);
    return `$${trillions}T`;
  } else if (value >= 1000000000) {
    const billions = (value / 1000000000).toFixed(2);
    return `$${billions}B`;
  } else if (value >= 1000000) {
    const millions = (value / 1000000).toFixed(2);
    return `$${millions}M`;
  } else {
    return formatCurrency(value);
  }
}
