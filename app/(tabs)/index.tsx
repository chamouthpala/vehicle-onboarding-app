import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/logo.jpg')}
          style={styles.Logo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Vehicle Management</ThemedText>
      </ThemedView>

      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">Add Your Vehicle</ThemedText>
        <ThemedText>
          Start by adding your vehicle details like make, model, year, registration number, and fuel type.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">Manage Your Fleet</ThemedText>
        <ThemedText>
          Easily edit or update vehicle information from the Vehicles tab.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">Upload Photos</ThemedText>
        <ThemedText>
          Take or upload photos of your vehicle to maintain a visual record.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">Sync to Backend</ThemedText>
        <ThemedText>
          All data is synced securely to the server, ensuring your fleet info is always up to date.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionContainer: {
    gap: 8,
    marginBottom: 12,
  },
  Logo: {
    height: 250,
    width: 350,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
