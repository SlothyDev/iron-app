export default {
  expo: {
    name: "IRON",
    slug: "iron-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.slothyyy.ironapp",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },

    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "com.slothyyy.ironapp",
    },

    web: {
      favicon: "./assets/favicon.png",
    },

    plugins: [
      "expo-web-browser",
      "expo-font",
      "@react-native-community/datetimepicker",
    ],

    extra: {
      eas: {
        projectId: "a6cd55f7-b65a-425c-bc96-faf287eaa6a7",
      },

      // Firebase env (IMPORTANT)
      EXPO_PUBLIC_API_KEY: process.env.EXPO_PUBLIC_API_KEY,
      EXPO_PUBLIC_AUTH_DOMAIN: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
      EXPO_PUBLIC_PROJECT_ID: process.env.EXPO_PUBLIC_PROJECT_ID,
      EXPO_PUBLIC_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
      EXPO_PUBLIC_STORAGE_BUCKET: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
      EXPO_PUBLIC_APP_ID: process.env.EXPO_PUBLIC_APP_ID,
    },
  },
};