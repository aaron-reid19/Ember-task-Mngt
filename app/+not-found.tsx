/**
 * Ember — Not Found Screen
 * Layer: UI
 * Owner: Kaley
 * Task IDs: —
 * Status: 🟢 READY
 *
 * Dependencies: None
 *
 * Notes:
 *   Shown when a route doesn't exist.
 */

import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import Colors from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

export default function NotFoundScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Page Not Found</Text>
        <Link href="/" style={styles.link}>
          Go Home
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDeep,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.lg,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
  },
  link: {
    color: Colors.accent,
    fontSize: Typography.md,
    fontWeight: Typography.medium,
  },
});
