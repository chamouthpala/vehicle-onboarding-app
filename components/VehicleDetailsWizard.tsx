
import React from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  regnum: string;
  vehicletype: string;
  fuelType: string;
  imageUrls: string[];
}

interface Props {
  route: { params: { vehicle: Vehicle } };
  navigation: any;
}

const VehicleDetailsWizard: React.FC<Props> = ({ route, navigation }) => {
  const { vehicle } = route.params;

  const handleEdit = () => {
    // 
    alert(`Edit vehicle: ${vehicle.id}`);
  };

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:8080/api/vehicles/${vehicle.id}`, {
        method: 'DELETE',
      });
      alert('Vehicle deleted');
      navigation.goBack(); 
    } catch (error) {
      console.error('Delete failed', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{vehicle.make} {vehicle.model}</Text>
      <Text>Reg No: {vehicle.regnum}</Text>
      <Text>Year: {vehicle.year}</Text>
      <Text>Type: {vehicle.vehicletype}</Text>
      <Text>Fuel: {vehicle.fuelType}</Text>

      <ScrollView horizontal style={styles.imageRow}>
        {vehicle.imageUrls.map((url, index) => (
          <Image key={index} source={{ uri: url }} style={styles.image} />
        ))}
      </ScrollView>

      <View style={styles.buttonRow}>
        <Button title="Edit" onPress={handleEdit} />
        <Button title="Delete" onPress={handleDelete} color="red" />
      </View>
    </ScrollView>
  );
};

export default VehicleDetailsWizard;

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  imageRow: { marginTop: 10, flexDirection: 'row' },
  image: { width: 120, height: 90, marginRight: 8, borderRadius: 8 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
});
