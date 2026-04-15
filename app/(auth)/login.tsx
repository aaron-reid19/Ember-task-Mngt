import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import Colors from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";
import { useAuth } from "@/store/authContext";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});
type LoginFormData = z.infer<typeof loginSchema>;

const DEMO_EMAIL = "demo@ember.app";
const DEMO_PASSWORD = "demo1234";

export default function LoginScreen() {
  const { login, signup } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: LoginFormData) {
    setAuthError(null);
    setSubmitting(true);
    const result = await login(data.email, data.password);
    setSubmitting(false);

    if (result.error) {
      setAuthError(result.error);
    } else {
      router.replace("/");
    }
  }

  async function onDemoLogin() {
    setAuthError(null);
    setSubmitting(true);

    // Try signup first (works on first use), fall back to login if account exists
    let result = await signup(DEMO_EMAIL, DEMO_PASSWORD, "Demo User");
    if (result.error) {
      result = await login(DEMO_EMAIL, DEMO_PASSWORD);
    }

    setSubmitting(false);
    if (result.error) {
      setAuthError(result.error);
    } else {
      router.replace("/");
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Branding */}
          <View style={styles.brandSection}>
            <Text style={styles.appName}>Ember</Text>
            <Text style={styles.tagline}>Keep your fire alive</Text>
          </View>

          {/* Form card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Welcome Back</Text>

            {/* Email */}
            <Text style={styles.fieldLabel}>EMAIL</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  value={value}
                  onChangeText={onChange}
                  placeholder="you@example.com"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  returnKeyType="next"
                />
              )}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}

            {/* Password */}
            <Text style={[styles.fieldLabel, { marginTop: Spacing.lg }]}>PASSWORD</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <View style={[styles.passwordRow, errors.password && styles.inputError]}>
                  <TextInput
                    style={styles.passwordInput}
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter your password"
                    placeholderTextColor={Colors.textMuted}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password"
                    returnKeyType="done"
                  />
                  <Pressable
                    onPress={() => setShowPassword((prev) => !prev)}
                    hitSlop={8}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={20}
                      color={Colors.textMuted}
                    />
                  </Pressable>
                </View>
              )}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}

            {/* Auth error */}
            {authError && (
              <View style={styles.authErrorBox}>
                <Text style={styles.authErrorText}>{authError}</Text>
              </View>
            )}
          </View>

          {/* Actions */}
          <Button
            label={submitting ? "Signing in..." : "Sign In"}
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            disabled={submitting}
          />

          {/* Sign up link */}
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Don't have an account? </Text>
            <Text
              style={styles.switchLink}
              onPress={() => router.replace("/(auth)/signup")}
            >
              Sign Up
            </Text>
          </View>

          {/* Demo shortcut */}
          <Pressable
            style={styles.demoButton}
            onPress={onDemoLogin}
            disabled={submitting}
          >
            <Ionicons name="flash" size={16} color={Colors.accent} />
            <Text style={styles.demoButtonText}>
              {submitting ? "Signing in..." : "Skip — use demo account"}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bgDeep,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xxl,
    justifyContent: "center",
    gap: Spacing.cardGap,
  },
  brandSection: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  appName: {
    fontSize: Typography.hero,
    fontWeight: Typography.extraBold,
    color: Colors.accent,
  },
  tagline: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: Spacing.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  fieldLabel: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    letterSpacing: Typography.capsTracking,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.bgInput,
    borderRadius: 12,
    padding: Spacing.md,
    fontSize: Typography.md,
    color: Colors.textPrimary,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bgInput,
    borderRadius: 12,
    paddingRight: Spacing.md,
  },
  passwordInput: {
    flex: 1,
    padding: Spacing.md,
    fontSize: Typography.md,
    color: Colors.textPrimary,
  },
  inputError: {
    borderWidth: 1,
    borderColor: Colors.priorityHigh,
  },
  errorText: {
    color: Colors.priorityHigh,
    fontSize: Typography.sm,
    marginTop: Spacing.xs,
  },
  authErrorBox: {
    backgroundColor: Colors.bgCardAlt,
    borderRadius: 8,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.priorityHigh,
  },
  authErrorText: {
    color: Colors.priorityHigh,
    fontSize: Typography.sm,
    textAlign: "center",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing.md,
  },
  switchText: {
    color: Colors.textSecondary,
    fontSize: Typography.md,
  },
  switchLink: {
    color: Colors.accent,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
  },
  demoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed",
  },
  demoButtonText: {
    color: Colors.accent,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
  },
});
