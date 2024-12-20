import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState([]);

  // Load users from AsyncStorage on app load
  useEffect(() => {
    loadUsers();
  }, []);

  // Save users list to AsyncStorage
  const saveUsers = async (userList) => {
    try {
      await AsyncStorage.setItem('users', JSON.stringify(userList));
    } catch (error) {
      console.log('Error saving users:', error);
    }
  };

  // Load users from AsyncStorage
  const loadUsers = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem('users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
    } catch (error) {
      console.log('Error loading users:', error);
    }
  };

  // Add a new user
  const addUser = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const newUser = { id: Date.now(), name, email };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveUsers(updatedUsers); // Save the updated user list

    setName('');
    setEmail('');
    Alert.alert('Success', 'User added successfully');
  };

  // Clear all users (optional functionality)
  const clearUsers = async () => {
    try {
      await AsyncStorage.removeItem('users');
      setUsers([]);
      Alert.alert('Success', 'All users cleared');
    } catch (error) {
      console.log('Error clearing users:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Registration</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.button} onPress={addUser}>
        <Text style={styles.buttonText}>Add User</Text>
      </TouchableOpacity>
      <Text style={styles.subtitle}>Registered Users</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.userText}>
              {item.name} ({item.email})
            </Text>
          </View>
        )}
      />
      <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearUsers}>
        <Text style={styles.buttonText}>Clear Users</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6200ee',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  clearButton: {
    backgroundColor: '#ff4d4d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  userItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  userText: {
    fontSize: 16,
    color: '#333',
  },
});

export default App;
