import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Alert, Button, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const VehicleOnboardingWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
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

const uploadImageToServer = async (image: {
  uri?: string;
  type?: string;
  fileName?: string;
}): Promise<string | null> => {
  if (!image.uri) return null;

  const form = new FormData();
  form.append('file', {
    uri: image.uri,
    type: image.type || 'image/jpeg',
    name: image.fileName || 'upload.jpg',
  } as any);

  try {
    const response = await fetch('http://172.104.60.219:8080/api/vehicles/upload', {
      method: 'POST',
      body: form,
      headers: {
         Accept: '*/*',
      },
    });

    if (!response.ok) throw new Error('Image upload failed');

    const url = await response.text();
    return url;
  } catch (err) {
    console.error('Image upload error:', err);
    Alert.alert('Error', 'Failed to upload image to server.');
    return null;
  }
};


const handleImagePick = async (fromCamera: boolean) => {
  const result = fromCamera
    ? await launchCamera({ mediaType: 'photo' })
    : await launchImageLibrary({ mediaType: 'photo' });

  if (result.assets && result.assets.length > 0) {
    const asset = result.assets[0];
    if (!asset.uri) {
    console.error('No URI found on selected image:', asset);
    return;
  }
    const uploadedUrl = await uploadImageToServer({
    uri: asset.uri,
    type: asset.type ?? 'image/jpeg',
    fileName: asset.fileName ?? 'upload.jpg',
  });
    if (uploadedUrl) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, uploadedUrl],
      }));
    }
  }
};


  const handleSubmit = async () => {
    try {
      const uploadedImageUrls: string[] = [];

      
      const response = await fetch('http://172.104.60.219:8080/api/vehicles', {
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

      if (!response.ok) throw new Error('Failed to submit vehicle');

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
      setCurrentStep(0);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to submit vehicle data.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
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
          </>
        );
      case 1:
        return (
            <>
              <Picker
                selectedValue={formData.vehicletype}
                onValueChange={(value) => handleChange('vehicletype', value)}
                style={styles.input}
              >
                <Picker.Item label="Select Vehicle Type" value="" />
                <Picker.Item label="Car" value="Car" />
                <Picker.Item label="Van" value="Van" />
                <Picker.Item label="Bike" value="Bike" />
                <Picker.Item label="Truck" value="Truck" />
              </Picker>

              <Picker
                selectedValue={formData.fuelType}
                onValueChange={(value) => handleChange('fuelType', value)}
                style={styles.input}
              >
                <Picker.Item label="Select Fuel Type" value="" />
                <Picker.Item label="Petrol" value="Petrol" />
                <Picker.Item label="Diesel" value="Diesel" />
                <Picker.Item label="Electric" value="Electric" />
                <Picker.Item label="Hybrid" value="Hybrid" />
              </Picker>
            </>
        );
      case 2:
        return (
          <>
            <Button title="Upload from Camera" onPress={() => handleImagePick(true)} />
            <Button title="Upload from Gallery" onPress={() => handleImagePick(false)} />
            <View style={styles.imageContainer}>
              {formData.images.map((uri, index) => (
                <Image key={index} source={{ uri }} style={styles.imagePreview} />
              ))}
            </View>
          </>
        );
      case 3:
        return (
          <View style={styles.reviewBox}>
            <Text style={styles.reviewLabel}>Reg No: {formData.regnum}</Text>
            <Text style={styles.reviewLabel}>Make: {formData.make}</Text>
            <Text style={styles.reviewLabel}>Model: {formData.model}</Text>
            <Text style={styles.reviewLabel}>Year: {formData.year}</Text>
            <Text style={styles.reviewLabel}>Vehicle Type: {formData.vehicletype}</Text>
            <Text style={styles.reviewLabel}>Fuel Type: {formData.fuelType}</Text>
            <View style={styles.imageContainer}>
              {formData.images.map((uri, index) => (
                <Image key={index} source={{ uri }} style={styles.imagePreview} />
              ))}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Vehicle Onboarding</Text>
      <Text style={styles.stepLabel}>Step {currentStep + 1} of 4</Text>

      {renderStep()}

      <View style={styles.buttonRow}>
        {currentStep > 0 && (
          <Button title="Back" onPress={() => setCurrentStep((prev) => prev - 1)} />
        )}
        {currentStep < 3 && (
          <Button title="Next" onPress={() => setCurrentStep((prev) => prev + 1)} />
        )}
        {currentStep === 3 && (
          <Button title="Submit" onPress={handleSubmit} />
        )}
      </View>
    </ScrollView>
  );
};

export default VehicleOnboardingWizard;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
  },
   title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  stepLabel: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    backgroundColor: '#fff',
    marginBottom: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
    marginBottom: 20,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  reviewBox: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  reviewLabel: {
    fontSize: 16,
    marginVertical: 6,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 24,
  },
});
