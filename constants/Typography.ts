// 🔵 DECISION — replaced Aaron's Typography.ts with Kaley's version [Apr 2026]
// ? Aaron: your version exported FontSize + FontWeight as separate objects.
//   Kaley's exports a single `Typography` object with sizes (xs–hero), weights, and letter spacing.
//   Files importing FontSize/FontWeight need updating to import { Typography }.

/**
 * Ember — Typography
 * Layer: UI
 * Owner: Kaley
 * Task IDs: Wave 1 foundation
 * Status: 🟢 READY
 *
 * Notes:
 *   Font sizes and weights observed from Figma.
 *   Never write raw fontSize or fontWeight values inline.
 */

export const Typography = {
  // * Font sizes
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 28,
  hero: 52,       // large HP percentage on Profile screen

  // * Font weights
  regular: "400" as const,
  medium: "500" as const,
  semiBold: "600" as const,
  bold: "700" as const,
  extraBold: "800" as const,

  // * Letter spacing
  capsTracking: 2, // used on uppercased labels ("EMBER'S CURRENT STATE", "TODAY'S PROGRESS")
};
