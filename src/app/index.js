import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Page() {
  return (
    <View className="flex flex-1">
      <Content />
    </View>
  );
}

function Content() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <View className="py-12 md:py-24 lg:py-32 xl:py-48">
        <View className="container px-4 md:px-6">
          <View className="flex flex-col items-center gap-4">
            <Text
              role="heading"
              className="text-3xl text-center native:text-5xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl"
            >
              Welcome to DEU Health Tracking Project
            </Text>

            <View className="gap-4">
              <Link
                suppressHighlighting
                className="flex h-9 items-center justify-center overflow-hidden rounded-md bg-primary px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                href="auth"
              >
                Login
              </Link>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
