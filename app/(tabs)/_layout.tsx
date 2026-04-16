/**
 * Ember — Tab Navigator Layout
 * Layer: UI
 * Owner: Kaley
 * Task IDs: —
 * Status: 🟢 READY
 *
 * Dependencies: None
 *
 * TAB STRUCTURE (visible tabs):
 *   Home        → (tabs)/index.tsx
 *   Add Quest   → (tabs)/add-quest.tsx
 *   Profile     → (tabs)/profile.tsx
 *
 * HIDDEN ROUTES (accessible via navigation, not in tab bar):
 *   Quest Detail → (tabs)/quests/[id].tsx
 *   Quest Edit   → (tabs)/quests/edit/[id].tsx
 */

import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: Colors.bgDeep,
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 16,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarIconStyle: {
          marginBottom: 2,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      {/* Tab 1: Home — creature + HP bar + Daily Spark + quest preview */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />

      {/* Tab 2: Quest Board — quest list with cadence filters */}
      <Tabs.Screen
        name="quests"
        options={{
          title: "Quest Board",
          tabBarIcon: ({ color }) => (
            <Ionicons name="list-outline" size={24} color={color} />
          ),
        }}
      />

      {/* Tab 2: Add Quest — form to create a new quest */}
      <Tabs.Screen
        name="add-quest"
        options={{
          title: "Add Quest",
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle-outline" size={24} color={color} />
          ),
        }}
      />

      {/* Tab 3: Profile — avatar, stats, HP trend, goal config */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />

    </Tabs>
  );
}
