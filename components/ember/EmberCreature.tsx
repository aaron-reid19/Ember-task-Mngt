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

import React from "react";
import { StyleSheet, View, Image, ImageSourcePropType } from "react-native";
import Animated from "react-native-reanimated";
import type { EmberState } from "@/types";
import { EmberStates } from "@/constants/EmberStates";
import Colors from "@/constants/Colors";
import { useEmberAnimation } from "./EmberAnimations";

// ~ ─────────────────────────────────────────────────────────────────

// ^ Real sprite assets in assets/images/ember-states/ — using first frame per state
const EMBER_SPRITES: Record<EmberState, ImageSourcePropType> = {
  Thriving: require("@/assets/images/ember-thriving.png"),
  Steady: require("@/assets/images/ember-states/ember-steady1.png"),
  Strained: require("@/assets/images/ember-states/ember-strain1.png"),
  Flickering: require("@/assets/images/ember-states/ember-flicker1.png"),
};

// ~ ─────────────────────────────────────────────────────────────────

interface EmberCreatureProps {
  state: EmberState;
  isBonfire?: boolean;  // passed from screen — triggers size override
}

// ~ ─────────────────────────────────────────────────────────────────

export function EmberCreature({ state, isBonfire = false }: EmberCreatureProps) {
  const { animatedStyle } = useEmberAnimation({ state, isBonfire });

  return (
    <View style={styles.container}>
      {/* Semicircle backdrop — the purple arc behind the creature in Figma */}
      <View style={styles.backdrop} />

      <Animated.View style={[styles.creatureWrapper, animatedStyle]}>
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
