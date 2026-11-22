/**
 * Civic Pulse & Community Disaster Management (SDG 11)
 * Root Layout for Expo Router
 */

import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0284C7',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '700',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Civic Pulse (SDG 11)',
          }}
        />
      </Stack>
    </>
  );
}
