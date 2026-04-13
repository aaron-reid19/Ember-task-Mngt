/**
 * Ember — Spacing
 * Layer: UI
 * Owner: Kaley
 * Task IDs: Wave 1 foundation
 * Status: 🟢 READY
 *
 * Notes:
 *   Standard spacing scale. Never write raw numbers inline in StyleSheets.
 *   Import from here so spacing is consistent across the whole app.
 */

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,

  // * Named semantic values derived from Figma
  screen: 20,      // horizontal padding on all screens
  card: 16,        // internal card padding
  cardGap: 12,     // vertical gap between cards
  sectionGap: 24,  // gap between major screen sections
};
