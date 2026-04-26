export function formatPriceFrom(value, note) {
  if (note) return note;
  if (value == null || value === "") return "—";
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return `от ${n.toLocaleString("ru-RU")} руб.`;
}

export function formatItemPrice(item) {
  if (item.price_display) return item.price_display;
  if (item.price_from != null) {
    const from = Number(item.price_from).toLocaleString("ru-RU");
    if (item.price_to != null) {
      const to = Number(item.price_to).toLocaleString("ru-RU");
      return `${from} – ${to} руб.`;
    }
    return `от ${from} руб.`;
  }
  return "—";
}
