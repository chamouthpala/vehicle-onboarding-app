import React, { useState } from 'react';
import { Alert, Button, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const VehicleOnboardingWizard = () => {
  const [formData, setFormData] = useState({
     regnum: '',
    make: '',
    model: '',
    year: '',
    vehicletype: '',
    fuelType: '',
    images: [] as string[],
  });

  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleImagePick = async (fromCamera: boolean) => {
    const result = fromCamera
      ? await launchCamera({ mediaType: 'photo' })
      : await launchImageLibrary({ mediaType: 'photo' });

    if (result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      if (uri) {
        setFormData({ ...formData, images: [...formData.images, uri] });
      }
    }
  };

 const handleSubmit = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/vehicles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        regnum: formData.regnum,
        vehicletype: formData.vehicletype,
        fuelType: formData.fuelType,
        imageUrls: formData.images,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit vehicle');
    }

    Alert.alert('Success', 'Vehicle registered successfully!');
    console.log('Submitted:', formData);

    setFormData({
      regnum: '',
      make: '',
      model: '',
      year: '',
      vehicletype: '',
      fuelType: '',
      images: [],
    });
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Failed to submit vehicle data.');
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Vehicle Onboarding</Text>

      <TextInput
        placeholder="Registration Number"
        style={styles.input}
        value={formData.regnum}
        onChangeText={(text) => handleChange('regnum', text)}
      />
      <TextInput
        placeholder="Make"
        style={styles.input}
        value={formData.make}
        onChangeText={(text) => handleChange('make', text)}
      />
      <TextInput
        placeholder="Model"
        style={styles.input}
        value={formData.model}
        onChangeText={(text) => handleChange('model', text)}
      />
      <TextInput
        placeholder="Year"
        keyboardType="numeric"
        style={styles.input}
        value={formData.year}
        onChangeText={(text) => handleChange('year', text)}
      />
      <TextInput
        placeholder="Vehicle Type"
        style={styles.input}
        value={formData.vehicletype}
        onChangeText={(text) => handleChange('vehicletype', text)}
      />
      <TextInput
        placeholder="Fuel Type"
        style={styles.input}
        value={formData.fuelType}
        onChangeText={(text) => handleChange('fuelType', text)}
      />

    
      <Button title="Upload from Camera" onPress={() => handleImagePick(true)} />
      <Button title="Upload from Gallery" onPress={() => handleImagePick(false)} />

   
      <View style={styles.imageContainer}>
        {formData.images.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.imagePreview} />
        ))}
      </View>

 
      <View style={styles.reviewBox}>
        <Text style={styles.reviewLabel}>Reg No: {formData.regnum}</Text>
        <Text style={styles.reviewLabel}>Make: {formData.make}</Text>
        <Text style={styles.reviewLabel}>Model: {formData.model}</Text>
        <Text style={styles.reviewLabel}>Year: {formData.year}</Text>
      </View>

  
      <View style={styles.submitButton}>
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

export default VehicleOnboardingWizard;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 20,
  },
  imagePreview: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 8,
  },
  reviewBox: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    marginBottom: 20,
  },
  reviewLabel: {
    fontSize: 16,
    marginVertical: 4,
  },
  submitButton: {
    marginTop: 20,
  },
});
