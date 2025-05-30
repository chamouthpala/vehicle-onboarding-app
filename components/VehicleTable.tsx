import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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

interface VehiclesViewWizardProps {
  vehicles: Vehicle[];
   onUpdate?: () => void; 
}

const VehiclesViewWizard: React.FC<VehiclesViewWizardProps> = ({ vehicles,onUpdate }) => {
 const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const handleDelete = async (id: number) => {


    Alert.alert('Confirm Delete', 'Are you sure you want to delete this vehicle?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const response = await fetch(`http://172.104.60.219:8080/api/vehicles/${id}`, {
              method: 'DELETE',
            });
            if (response.ok) {
              Alert.alert('Deleted', 'Vehicle deleted successfully.');
              onUpdate?.();
            } else {
              Alert.alert('Error', 'Failed to delete vehicle.');
            }
          } catch (error) {
            console.error('Delete error:', error);
            Alert.alert('Error', 'An error occurred.');
          }
        },
      },
    ]);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
  };
  const closeWizard = () => {
    setEditingVehicle(null); 
    onUpdate?.(); 
  };
   if (editingVehicle) {
    return (
      <EditVehicleWizard vehicle={editingVehicle} onClose={closeWizard} />
    );
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {vehicles.map((vehicle) => (
        <View key={vehicle.id} style={styles.vehicleCard}>
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
            <TouchableOpacity onPress={() => handleEdit(vehicle)} style={styles.buttonEdit}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(vehicle.id)} style={styles.buttonDelete}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};



interface EditVehicleWizardProps {
  vehicle: Vehicle;
  onClose: () => void;
}

const EditVehicleWizard: React.FC<EditVehicleWizardProps> = ({ vehicle, onClose }) => {
  const [form, setForm] = useState<Vehicle>(vehicle);

  const handleChange = (field: keyof Vehicle, value: string | number) => {
    setForm({ ...form, [field]: value });
  };

  const handleDone = async () => {
    try {
      const response = await fetch(`http://172.104.60.219:8080/api/vehicles/${form.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        Alert.alert('Success', 'Vehicle updated successfully.');
        onClose();
      } else {
        Alert.alert('Failed', 'Failed to update vehicle.');
      }
    } catch (error) {
      console.error('Error updating vehicle:', error);
      Alert.alert('Error', 'An error occurred while updating.');
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Vehicle</Text>

      <TextInput
        style={styles.input}
        value={form.make}
        onChangeText={(text) => handleChange('make', text)}
        placeholder="Make"
      />
      <TextInput
        style={styles.input}
        value={form.model}
        onChangeText={(text) => handleChange('model', text)}
        placeholder="Model"
      />
      <TextInput
        style={styles.input}
        value={String(form.year)}
        onChangeText={(text) => handleChange('year', Number(text))}
        placeholder="Year"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        value={form.regnum}
        onChangeText={(text) => handleChange('regnum', text)}
        placeholder="Registration Number"
      />
      <TextInput
        style={styles.input}
        value={form.vehicletype}
        onChangeText={(text) => handleChange('vehicletype', text)}
        placeholder="Vehicle Type"
      />
      <TextInput
        style={styles.input}
        value={form.fuelType}
        onChangeText={(text) => handleChange('fuelType', text)}
        placeholder="Fuel Type"
      />

      <TouchableOpacity style={styles.button} onPress={handleDone}>
        <Text style={styles.buttonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};


export default VehiclesViewWizard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  vehicleCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  imageRow: {
    marginTop: 10,
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 80,
    marginRight: 8,
    borderRadius: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  buttonEdit: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
  },
  buttonDelete: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 6,
    flex: 1,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4caf50',
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
  },
});
