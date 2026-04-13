// 🔵 DECISION — replaced Aaron's EmberCreature (emoji placeholders) with Kaley's sprite-based version [Apr 2026]
// ? Aaron: your version used emoji + useCreatureAnimations hook from EmberAnimations.tsx.
//   Kaley's uses sprite image assets + direct Reanimated logic. Also adds isBonfire prop.
//   EmberAnimations.tsx is no longer imported — can be removed if not used elsewhere.

/**
 * Ember — EmberCreature
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U3
 * Status: 🟡 STUB
 *
 * Dependencies:
 *   - L2: state prop comes from useEmber() — Josh — PENDING
 *   - assets/images/: ember sprite images for each state — need to be added
 *
 * Notes:
 *   Four visual states seen in Figma (pages 2–7):
 *     Smoldering  — small, dim bonfire (low HP)
 *     Glowing     — medium bonfire (mid HP)
 *     Steady      — taller bonfire
 *     Thriving    — full bright fire
 *     Bonfire     — massive fire, full screen (100 HP)
 *   Animations are driven entirely by the state prop — this component
 *   owns its Reanimated logic. The screen just passes state down.
 *   * Reanimated withSpring gives the organic creature feel.
 *   ^ Sprite images are placeholders — replace with real assets from design team.
 *   ⚪ DEFERRED — cross-state transition animation (fade between sprites)
 *      Reason: out of MVP scope per ADR-001 sprint constraints
 */

import React, { useEffect } from "react";
import { StyleSheet, View, Image, ImageSourcePropType } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { EmberState, EmberStates } from "@/constants/EmberStates";
import Colors from "@/constants/Colors";

// ~ ─────────────────────────────────────────────────────────────────

// 🟡 STUB — placeholder PNG files exist but are empty (0 bytes)
// ⚪ DEFERRED — sprite assets awaited from design export; placeholder PNGs are functional
// ^ empty PNGs render as blank space — expected during development
const EMBER_SPRITES: Record<EmberState, ImageSourcePropType> = {
  Thriving: require("@/assets/images/ember-thriving.png"),
  Steady: require("@/assets/images/ember-steady.png"),
  Strained: require("@/assets/images/ember-strained.png"),
  Flickering: require("@/assets/images/ember-flickering.png"),
};

// ~ ─────────────────────────────────────────────────────────────────

interface EmberCreatureProps {
  state: EmberState;
  isBonfire?: boolean;  // passed from screen — triggers size override
}

// ~ ─────────────────────────────────────────────────────────────────

export function EmberCreature({ state, isBonfire = false }: EmberCreatureProps) {
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

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Semicircle backdrop — the purple arc behind the creature in Figma */}
      <View style={styles.backdrop} />

      <Animated.View style={[styles.creatureWrapper, animStyle]}>
        {/* 🟡 STUB — replace require() paths with real assets */}
        <Image
          source={EMBER_SPRITES[state]}
          style={styles.sprite}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

// ~ ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: 260,
    width: "100%",
  },
  // * The dark semicircle arc visible behind the creature in Figma
  backdrop: {
    position: "absolute",
    bottom: 0,
    width: "90%",
    height: 180,
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    backgroundColor: Colors.creatureBg,
  },
  creatureWrapper: {
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sprite: {
    width: 180,
    height: 180,
  },
});
