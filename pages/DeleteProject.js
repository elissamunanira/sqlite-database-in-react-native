

import React, {useState} from 'react';
import {Text, View, Alert, SafeAreaView} from 'react-native';
import Mytextinput from './components/Mytextinput';
import Mybutton from './components/Mybutton';
import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'ProjectDatabase.db'});

const DeleteProject = ({navigation}) => {
  let [inputProjectId, setInputProjectId] = useState('');

  let deleteProject = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM  table_project where project_id=?',
        [inputProjectId],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'Project deleted successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('HomeScreen'),
                },
              ],
              {cancelable: false},
            );
          } else {
            alert('Please insert a valid Project Id');
          }
        },
      );
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{flex: 1}}>
          <Mytextinput
            placeholder="Enter Project Id"
            onChangeText={(inputProjectId) => setInputProjectId(inputProjectId)}
            style={{padding: 10}}
          />
          <Mybutton title="Delete Project" customClick={deleteProject} />
        </View>
        <Text style={{fontSize: 18, textAlign: 'center', color: 'grey'}}>
          Example of SQLite Database in React Native
        </Text>
        <Text style={{fontSize: 16, textAlign: 'center', color: 'grey'}}>
          csearchive
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default DeleteProject;
