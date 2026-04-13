// 🔵 DECISION — merged Aaron's tab navigator with Kaley's spec tabs [Apr 2026]
// ? Aaron: your layout had 4 tabs: Home, Quests, Tasks, Profile.
//   Spec defines 4 tabs: Home, Quest Board, Add Quest, Profile.
//   Resolution: Added "Add Quest" tab, renamed "Quests" to "Quest Board".
//   Tasks and Quest Detail are kept as hidden routes (accessible via navigation, not tab bar).
//   This gives 4 visible tabs matching Figma + keeps Aaron's task screens accessible.

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
 *   Quest Board → (tabs)/quests.tsx      → Nested stack: quests/[id].tsx
 *   Add Quest   → (tabs)/add-quest.tsx
 *   Profile     → (tabs)/profile.tsx
 *
 * HIDDEN ROUTES (accessible via navigation, not in tab bar):
 *   Tasks       → (tabs)/tasks/index.tsx → Nested stack: tasks/[id].tsx
 *   Quest Detail→ (tabs)/quests/[id].tsx
 */

import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { Typography } from "@/constants/Typography";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.tabBarBg,
          borderTopColor: Colors.border,
        },
        tabBarActiveTintColor: Colors.tabBarActive,
        tabBarInactiveTintColor: Colors.tabBarInactive,
        tabBarLabelStyle: {
          fontSize: Typography.xs,
        },
      }}
    >
      {/* Tab 1: Home — creature + HP bar + Daily Spark + task preview */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />

      {/* Tab 2: Quest Board — quest list with filter tabs */}
      <Tabs.Screen
        name="quests"
        options={{
          title: "Quest Board",
          tabBarIcon: ({ color }) => (
            <Ionicons name="list-outline" size={24} color={color} />
          ),
        }}
      />

      {/* Tab 3: Add Quest — form to create a new quest */}
      <Tabs.Screen
        name="add-quest"
        options={{
          title: "Add Quest",
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle-outline" size={24} color={color} />
          ),
        }}
      />

      {/* Tab 4: Profile — avatar, stats, HP trend, goal config */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />

      {/* Hidden: Tasks — accessible via "See All Today's Tasks" link on Home */}
      <Tabs.Screen
        name="tasks"
        options={{ href: null }}
      />
    </Tabs>
  );
}
