export const categoryEmojiMap: Record<string, string> = {
  Rørlegger: "🔧",
  Elektriker: "⚡",
  Snekker: "🪚",
  Tømrer: "🪚",
  Murer: "🧱",
  Flislegger: "🧱",
  Maler: "🎨",
  Taktekker: "🏠",
  Rengjøring: "🧽",
  Reparatør: "🛠️",
};

export function formatCategoryLabel(
  name: string,
  emojiMap: Record<string, string> = categoryEmojiMap,
) {
  const emoji = emojiMap[name];
  return emoji ? `${emoji} ${name}` : name;
}
