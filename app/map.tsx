import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

const FIXED_RADIUS = 3000; // m*1000 = km 

const initialWorkers = [ //Backend Work to, but for now lagyan lang muna mock/dummy arrays
  {
    id: 1,
    name: 'Plumber - Mario D. Qpal',
    latitude: 14.57716050540969,
    longitude: 121.14338136999869,
  },
  {
    id: 2,
    name: 'Electrician - Juan Dela Cruz',
    latitude: 14.595,
    longitude: 120.990,
  },
  {
    id: 3,
    name: 'Baker - Nicole Jiesselle M. Badua',
    latitude: 14.571113864083832,
    longitude: 121.13559753728642,
  },
];

const MapScreen = () => {
  const [location, setLocation] = useState<null | { latitude: number; longitude: number }>(null);
  const [role, setRole] = useState<'JobMaster' | 'TaskMaster'>('JobMaster');
  const [searching, setSearching] = useState(false);
  const [skilledWorkers, setSkilledWorkers] = useState<Worker[]>([]);

  type Worker = {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
  };

  const handleSearch = () => {
    setSearching(true);
    setTimeout(() => {
      setSkilledWorkers(initialWorkers);
      setSearching(false);
    }, 2000);
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    })();
  }, []);

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          showsUserLocation
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          <Marker coordinate={location} title="You" />
          <Circle
            center={location}
            radius={FIXED_RADIUS}
            strokeColor="#a30000"
            fillColor="rgba(255, 0, 0, 0.14)"
          />
          {skilledWorkers.map(worker => (
            <Marker
              key={worker.id}
              coordinate={{
                latitude: worker.latitude,
                longitude: worker.longitude,
              }}
              title={worker.name}
              description="Available"
            />
          ))}
        </MapView>
      )}

      {/* Hamburger Button */}
      <TouchableOpacity style={styles.hamburger}>
        <Ionicons name="menu" size={30} color="black" />
      </TouchableOpacity>

      {/* Bottom Panel */}
      <View style={styles.bottomPanel}>
        <Text style={styles.roleLabel}>{role}</Text>
        {searching ? (
          <Text style={styles.searchingText}>
            {role === 'JobMaster' ? 'Searching for Task Masters...' : 'Searching for Jobs...'}
          </Text>
        ) : (
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>
              {role === 'JobMaster' ? 'Search for Task Masters' : 'Search for Jobs'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  hamburger: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: -3 },
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'left',
    paddingVertical: 5,
  },
  searchingText: {
    color: '#888',
    fontStyle: 'italic',
  },
  searchButton: {
    backgroundColor: '#a30000',
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    textAlign: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
