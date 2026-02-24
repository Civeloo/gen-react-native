import { Stack } from 'expo-router/stack';
import { useEffect } from 'react';
import { useSession } from "@/services/session/ctx";
import { ActivityIndicator } from "react-native";
import {
  getTrackingPermissionsAsync,
  PermissionStatus,
  requestTrackingPermissionsAsync,
} from 'expo-tracking-transparency';
import { AdsConsent, AdsConsentStatus } from 'react-native-google-mobile-ads';
import mobileAds from 'react-native-google-mobile-ads';


export default function Layout() {
  const { authState, isLoading } = useSession();

  useEffect(() => {
    (async () => {
      const { status } = await getTrackingPermissionsAsync();
      if (status === PermissionStatus.UNDETERMINED) {
        await requestTrackingPermissionsAsync();
      }
      try {
        const consentInfo = await AdsConsent.requestInfoUpdate();
        if (
          consentInfo.isConsentFormAvailable &&
          consentInfo.status === AdsConsentStatus.REQUIRED
        ) {
          await AdsConsent.showForm();
        }
        const { status } = await AdsConsent.requestInfoUpdate();
        if (
          status === AdsConsentStatus.OBTAINED ||
          status === AdsConsentStatus.NOT_REQUIRED
        ) {
          await mobileAds().initialize();
        }
      } catch (error) {
        // console.error("Error setting up ads consent: ", error);
      }
    })();
    authState();
  }, []);

  return (
    isLoading ? <ActivityIndicator />
      :
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
  );
}
