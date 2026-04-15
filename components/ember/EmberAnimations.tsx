/**
 * Ember — EmberAnimations
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U3
 * Status: 🟢 READY
 *
 * Dependencies:
 *   - constants/EmberStates.ts: creatureScale + creatureOpacity per state
 *
 * Notes:
 *   Internal animation hook for EmberCreature — not imported by screens.
 *   Encapsulates Reanimated shared values and animated styles for the
 *   creature's scale and opacity transitions between Ember states.
 *   * withSpring for scale gives the organic creature feel.
 *   * withTiming for opacity gives a smooth fade.
 */

import { useEffect } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import type { EmberState } from "@/types";
import { EmberStates } from "@/constants/EmberStates";

// ~ ─────────────────────────────────────────────────────────────────

interface UseEmberAnimationOptions {
  state: EmberState;
  isBonfire: boolean;
}

/**
 * Custom hook that drives the EmberCreature's scale + opacity animation.
 * Returns an animated style object to spread onto an Animated.View.
 *
 * @param options.state   — current Ember state (drives target scale + opacity)
 * @param options.isBonfire — when true, overrides scale to 1.3
 */
export function useEmberAnimation({ state, isBonfire }: UseEmberAnimationOptions) {
  const scale = useSharedValue(EmberStates[state].creatureScale);
  const opacity = useSharedValue(EmberStates[state].creatureOpacity);

  // * Animate whenever state prop changes — prop drives the animation
  useEffect(() => {
    const config = EmberStates[state];
    scale.value = withSpring(isBonfire ? 1.3 : config.creatureScale, {
      damping: 12,
      stiffness: 100,
    });
    opacity.value = withTiming(config.creatureOpacity, { duration: 500 });
  }, [state, isBonfire]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return { animatedStyle };
}
