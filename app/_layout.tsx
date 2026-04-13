import { Stack } from "expo-router";
import { AuthProvider } from "@/context/authContext";
import { setupNotificationChannels } from "@/services/NotificationService";
import { useEffect } from "react";


export default function RootLayout() {
  useEffect(() => {
    setupNotificationChannels();
  }, [])
  return (

    <AuthProvider>
    <Stack />
  </AuthProvider>
  
  )
  
}
