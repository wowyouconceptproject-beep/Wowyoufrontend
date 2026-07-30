import { Colors } from "./colors";

export const Gradients = {
  hero: `linear-gradient(
    180deg,
    ${Colors.backgroundSecondary} 0%,
    ${Colors.background} 100%
  )`,

  primary: `linear-gradient(
    135deg,
    ${Colors.primaryLight},
    ${Colors.primary}
  )`,

  card: `linear-gradient(
    180deg,
    ${Colors.surfaceElevated},
    ${Colors.surface}
  )`,
};