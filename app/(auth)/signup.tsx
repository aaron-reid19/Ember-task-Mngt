/**
 * Ember — Signup Screen
 * Layer: UI
 * Owner: Kaley
 * Task IDs: U10
 * Status: 🟢 READY
 *
 * Dependencies:
 *   - store/authContext.useAuth(): signup / loginWithGoogle — Aaron — READY
 *   - react-hook-form + zod — READY
 *
 * Notes:
 *   New account creation with Zod validation (name, email, password).
 *   On success, firebaseAuth.signup() also calls ensureUserProfile() to create
 *   the user's Firestore doc before the root layout redirects to onboarding.
 *   // * password min length is enforced in the schema, not in the TextInput
 *   // & see login.tsx for the mirror form; keep validation rules in sync
 */

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

const signupSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required."),
    lastName: z.string().trim().min(1, "Last name is required."),
    email: z.string().trim().min(1, "Email is required.").email("Enter a valid email."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupScreen() {
  const { signup } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(data: SignupFormData) {
    setAuthError(null);
    setSubmitting(true);
    const displayName = `${data.firstName} ${data.lastName}`;
    const result = await signup(data.email, data.password, displayName);
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
            <Text style={styles.cardTitle}>Create Account</Text>

            {/* First & Last Name — side by side */}
            <View style={styles.nameRow}>
              <View style={styles.nameField}>
                <Text style={styles.fieldLabel}>FIRST NAME</Text>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.firstName && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      placeholder="First"
                      placeholderTextColor={Colors.textMuted}
                      autoCapitalize="words"
                      returnKeyType="next"
                    />
                  )}
                />
                {errors.firstName && (
                  <Text style={styles.errorText}>{errors.firstName.message}</Text>
                )}
              </View>

              <View style={styles.nameField}>
                <Text style={styles.fieldLabel}>LAST NAME</Text>
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.lastName && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      placeholder="Last"
                      placeholderTextColor={Colors.textMuted}
                      autoCapitalize="words"
                      returnKeyType="next"
                    />
                  )}
                />
                {errors.lastName && (
                  <Text style={styles.errorText}>{errors.lastName.message}</Text>
                )}
              </View>
            </View>

            {/* Email */}
            <Text style={[styles.fieldLabel, { marginTop: Spacing.lg }]}>EMAIL</Text>
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
                    placeholder="At least 6 characters"
                    placeholderTextColor={Colors.textMuted}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password"
                    returnKeyType="next"
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

            {/* Confirm Password */}
            <Text style={[styles.fieldLabel, { marginTop: Spacing.lg }]}>CONFIRM PASSWORD</Text>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <View style={[styles.passwordRow, errors.confirmPassword && styles.inputError]}>
                  <TextInput
                    style={styles.passwordInput}
                    value={value}
                    onChangeText={onChange}
                    placeholder="Re-enter your password"
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
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
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
            label={submitting ? "Creating account..." : "Create Account"}
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            disabled={submitting}
          />

          {/* Sign in link */}
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Already have an account? </Text>
            <Text
              style={styles.switchLink}
              onPress={() => router.replace("/(auth)/login")}
            >
              Sign In
            </Text>
          </View>
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
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
    justifyContent: "center",
    gap: Spacing.cardGap,
  },
  brandSection: {
    alignItems: "center",
    marginBottom: Spacing.lg,
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
  nameRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  nameField: {
    flex: 1,
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
});
