import React, { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite'


import { SafeAreaView, Text, View, StyleSheet, Alert, TouchableOpacity, TextInput, FlatList } from 'react-native';

import { openDatabase } from 'react-native-sqlite-storage';

import { NavigationContainer, useIsFocused } from '@react-navigation/native';

import { createStackNavigator } from '@react-navigation/stack';

const db = SQLite.openDatabase('SchoolDatabase.db') ;

function HomeScreen({ navigation }) {

  const [S_Name, setName] = useState('');
  const [S_AccYear, setAccYear] = useState();
  const [S_Owner, setOwner] = useState('');

  useEffect(() => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Student_Table'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS Student_Table', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS Student_Table(student_id INTEGER PRIMARY KEY AUTOINCREMENT, student_name VARCHAR(30), student_accYear INT(15), student_owner VARCHAR(255))',
              []
            );
          }
        }
      );
    })

  }, []);

  const insertData = () => {

    if (S_Name == '' || S_AccYear == '' || S_Owner == '') {
      Alert.alert('Please Enter All the Values');
    } else {

      db.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO Student_Table (student_name, student_accYear, student_owner) VALUES (?,?,?)',
          [S_Name, S_AccYear, S_Owner],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              Alert.alert('Data Inserted Successfully....');
            } else Alert.alert('Failed....');
          }
        );
      });

    }
  }

  navigateToViewScreen = () => {

    navigation.navigate('ViewAllProjectScreen');
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.mainContainer}>

      <Text style={{ fontSize: 24, textAlign: 'center', color: '#000',fontWeight:'bold', fontStyle:'italic' }}>
          CSEARCHIVE SYSTEM
        </Text>

        <Text style={{ fontSize: 18, textAlign: 'center', color: '#000' }}>
          CREATE & VIEW PROJECT
        </Text>

        <Text style={{ fontSize: 14, textAlign: 'center',color: '#000',  marginTop: 10 }}>
          Project Name
        </Text>

        <TextInput
          style={styles.textInputStyle} 
          onChangeText={
            (text) => setName(text)
          }
          placeholder="Enter Project Name"
          value={S_Name} />
 
        <Text style={{ fontSize: 14, textAlign: 'center', color: '#000',  marginTop: 10 }}>
          Accademic Year
        </Text>

        <TextInput
          style={styles.textInputStyle}
          onChangeText={
            (text) => setAccYear(text)
          }
          placeholder="Enter Accademic year"
          keyboardType={'numeric'}
          value={S_AccYear} />

        <Text style={{ fontSize: 14, textAlign: 'center', color: '#000' ,  marginTop: 10}}>
          Project Owner(student)
        </Text>

        <TextInput
          style={[styles.textInputStyle, { marginBottom: 10 }]}
          onChangeText={
            (text) => setOwner(text)
          }
          placeholder="Enter Owner of Project"
          value={S_Owner} />

        <TouchableOpacity
          style={styles.touchableOpacity}
          onPress={insertData}>

          <Text style={styles.touchableOpacityText}> ADD PROJECT</Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.touchableOpacity, { marginTop: 20, backgroundColor: 'aqua' }]}
          onPress={navigateToViewScreen}>

          <Text style={styles.touchableOpacityText}> VIEW ALL </Text>

        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
};

function ViewAllProjectScreen({ navigation }) {

  const [items, setItems] = useState([]);
  const [empty, setEmpty] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM Student_Table',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setItems(temp);

          if (results.rows.length >= 1) {
            setEmpty(false);
          } else {
            setEmpty(true)
          }

        }
      );

    });
  }, [isFocused]);

  const listViewItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#000'
        }}
      />
    );
  };

  const emptyMSG = (status) => {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>

        <Text style={{ fontSize: 25, textAlign: 'center' }}>
          No Record Inserted Database is Empty...
          </Text>

      </View>
    );
  }

  const navigateToEditScreen = (id, name, accYearNumber, owner) => {

    navigation.navigate('EditRecordScreen', {
      student_id: id,
      student_name: name,
      student_accYear: accYearNumber,
      student_owner: owner
    });
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {empty ? emptyMSG(empty) :

          <FlatList
            data={items}
            ItemSeparatorComponent={listViewItemSeparator}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) =>
              <View key={item.student_id} style={{ padding: 20, backgroundColor:'#fff' }}>
                <TouchableOpacity onPress={() => navigateToEditScreen(item.student_id, item.student_name, item.student_accYear, item.student_owner)} >
                  <Text style={styles.itemsStyle}> Id: {item.student_id} </Text>
                  <Text style={styles.itemsStyle}> Project Name: {item.student_name} </Text>
                  <Text style={styles.itemsStyle}> Accademic Year: {item.student_accYear} </Text>
                  <Text style={styles.itemsStyle}> Project Owner: {item.student_owner} </Text>
                </TouchableOpacity>
              </View>
            }
          />
        }
      </View>
    </SafeAreaView>

  );
}

function EditRecordScreen({ route, navigation }) {

  const [S_Id, setID] = useState('');
  const [S_Name, setName] = useState('');
  const [S_AccYear, setAccYear] = useState();
  const [S_Owner, setOwner] = useState('');

  useEffect(() => {

    setID(route.params.student_id);
    setName(route.params.student_name);
    setAccYear(route.params.student_accYear.toString());
    setOwner(route.params.student_owner);

  }, []);

  const editData = () => {

    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE Student_Table set student_name=?, student_accYear=? , student_owner=? where student_id=?',
        [S_Name, S_AccYear, S_Owner, S_Id],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert('Record Updated Successfully...')
          } else Alert.alert('Error');
        }
      );
    });
  }

  const deleteRecord = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM Student_Table where student_id=?',
        [S_Id],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Done',
              'Record Deleted Successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('ViewAllProjectScreen'),
                },
              ],
              { cancelable: false }
            );
          }
        }
      );
    });

  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.mainContainer}>

        <Text style={{ fontSize: 24, textAlign: 'center', color: '#000' }}>
          Edit Project </Text>
    
        <TextInput
          style={styles.textInputStyle}
          onChangeText={
            (text) => setName(text)
          }
          value={S_Name} />

        <TextInput
          style={styles.textInputStyle}
          onChangeText={
            (text) => setAccYear(text)
          }
          keyboardType={'numeric'}
          value={S_AccYear} />

        <TextInput
          style={[styles.textInputStyle, { marginBottom: 20 }]}
          onChangeText={
            (text) => setOwner(text)
          }
          value={S_Owner} />

        <TouchableOpacity
          style={styles.touchableOpacity}
          onPress={editData}>

          <Text style={styles.touchableOpacityText}> UPDATE </Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.touchableOpacity, { marginTop: 20, backgroundColor: 'red' }]}
          onPress={deleteRecord}>

          <Text style={styles.touchableOpacityText}> DELETE  </Text>

        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen name="HomeScreen" component={HomeScreen} />

        <Stack.Screen name="ViewAllProjectScreen" component={ViewAllProjectScreen} />

        <Stack.Screen name="EditRecordScreen" component={EditRecordScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },

  touchableOpacity: {
    backgroundColor: '#0091EA',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '55%'
  },

  touchableOpacityText: {
    color: '#FFFFFF',
    fontSize: 23,
    textAlign: 'center',
    padding: 8
  },

  textInputStyle: {
    height: 45,
    width: '90%',
    textAlign: 'left',
    borderWidth: 1,
    borderColor: '#00B8D4',
    borderRadius: 7,
    marginTop: 15,
  },

  itemsStyle: {
    fontSize: 18,
    color: '#000'
  }
});