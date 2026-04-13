/**
 * Ember — Creature Animation Engine (Internal)
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U3
 * Status: 🟡 STUB
 *
 * Dependencies:
 *   - types/ember.ts: EmberState type — Kaley — READY
 *   - constants/EmberStates.ts: state config — Kaley — READY
 *
 * Notes:
 *   Internal animation hook used ONLY by <EmberCreature>.
 *   ! Do not import this file from screens — it is internal to EmberCreature.
 *   ! No HP calculation or state classification here — that's Josh's L2.
 *   ! This file only knows how to ANIMATE a state it receives as input.
 *
 * HOW IT WORKS:
 *   1. EmberCreature passes the current state string (e.g. "Thriving") into this hook.
 *   2. This hook looks up the animation config for that state (scale, opacity, glow).
 *   3. It returns an animatedStyle that EmberCreature applies to its Animated.View.
 *   4. When the state prop changes, the animations transition smoothly to the new values.
 */

import { useEffect } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import type { EmberState } from "@/types";

// ~ ─────────────────────────────────────────────────────────────────
// VISUAL FEEL PER STATE
// These values control how the creature physically appears in each mood.
// scale: how large the creature renders (1.0 = normal size)
// opacity: how visible/faded the creature is (1.0 = fully visible)
// glowIntensity: reserved for glow/particle effects when sprite assets land
//
// * These values define the emotional expression of each state — keep this
// ~ ─────────────────────────────────────────────────────────────────
const CREATURE_VISUAL_CONFIG = {
  Thriving:   { scale: 1.1,  opacity: 1.0,  glowIntensity: 1.0 },  // big, bright, energetic
  Steady:     { scale: 1.0,  opacity: 0.9,  glowIntensity: 0.6 },  // normal, calm
  Strained:   { scale: 0.95, opacity: 0.7,  glowIntensity: 0.3 },  // slightly smaller, dimmer
  Flickering: { scale: 0.9,  opacity: 0.45, glowIntensity: 0.1 },  // smallest, fading in and out
};

/**
 * Custom hook that returns an animated style based on the current creature state.
 * The style smoothly transitions between states using spring (scale) and timing (opacity).
 *
 * @param state - The current EmberState, received as a prop from the screen
 * @returns animatedStyle to apply to the creature's Animated.View
 */
export function useCreatureAnimations(state: EmberState) {
  // Reanimated shared values — these drive the animation on the UI thread
  const creatureScale = useSharedValue(1);
  const creatureOpacity = useSharedValue(1);

  // Whenever the state changes, animate to the new visual config
  useEffect(() => {
    const config = CREATURE_VISUAL_CONFIG[state];

    // * withSpring for scale gives a satisfying bounce feel — keep this
    creatureScale.value = withSpring(config.scale);

    // Smooth fade to the new opacity over 400ms
    creatureOpacity.value = withTiming(config.opacity, { duration: 400 });

    // ^ Special case: Flickering state pulses in and out to convey low energy
    if (state === "Flickering") {
      creatureOpacity.value = withRepeat(
        withSequence(
          withTiming(config.opacity, { duration: 800 }),       // fade up
          withTiming(config.opacity * 0.6, { duration: 800 })  // fade down
        ),
        -1,    // repeat forever
        true   // reverse direction each cycle
      );
    }
  }, [state]);

  // Build the animated style that EmberCreature applies to its view
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: creatureScale.value }],
    opacity: creatureOpacity.value,
  }));

  return { animatedStyle, CREATURE_VISUAL_CONFIG };
}
