import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image as RNImage, StyleSheet } from 'react-native';

type Vehicle = {
  id: number;
  make: string;
  model: string;
  year: number;
  regnum: string;
  vehicletype: string;
  fuelType: string;
  imageUrls: string[];
};

export default function TabTwoScreen() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/vehicles') 
      .then((res) => res.json())
      .then((data) => {
        setVehicles(data);
      })
      .catch((error) => {
        console.error('Error fetching vehicles:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const renderVehicle = ({ item }: { item: Vehicle }) => (
    <ThemedView style={styles.card}>
      <RNImage
        source={{ uri: item.imageUrls[0] }}
        style={styles.vehicleImage}
        resizeMode="cover"
      />
      <ThemedText type="title">{item.make} {item.model}</ThemedText>
      <ThemedText>Year: {item.year}</ThemedText>
      <ThemedText>Reg#: {item.regnum}</ThemedText>
      <ThemedText>Type: {item.vehicletype}</ThemedText>
      <ThemedText>Fuel: {item.fuelType}</ThemedText>
    </ThemedView>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">View Vehicles</ThemedText>
      </ThemedView>

      {loading ? (
        <ActivityIndicator size="large" color="#888" />
      ) : (
        <FlatList
          data={vehicles}
          renderItem={renderVehicle}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 100,
  },
  card: {
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  vehicleImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
});
