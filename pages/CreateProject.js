// Example: Example of SQLite Database in React Native
// https://aboutreact.com/example-of-sqlite-database-in-react-native
// Screen to create project

import React, {useState} from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  SafeAreaView,
  Text,
} from 'react-native';
import Mytextinput from './components/Mytextinput';
import Mybutton from './components/Mybutton';
import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'projectDatabase.db'});

const CreateProject = ({navigation}) => {
  let [projectName, setProjectName] = useState('');
  let [projectAccademicYear, setProjectAccademicYear] = useState('');
  let [projectOwner, setProjectOwner] = useState('');

  let create_project = () => {
    console.log(projectName, projectAccademicYear, projectOwner);

    if (!projectName) {
      alert('Please fill name');
      return;
    }
    if (!projectAccademicYear) {
      alert('Please fill Accademic Year');
      return;
    }
    if (!projectOwner) {
      alert('Please name of owner');
      return;
    }

    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO table_project (project_name, project_accademicYear, project_owner) VALUES (?,?,?)',
        [projectName, projectAccademicYear, projectOwner],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'The project inserted Successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('HomeScreen'),
                },
              ],
              {cancelable: false},
            );
          } else alert('Failed to insert the project');
        },
      );
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: 'red'}}>
        <View style={{flex: 1}}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <KeyboardAvoidingView
              behavior="padding"
              style={{flex: 1, justifyContent: 'space-between'}}>
              <Mytextinput
                placeholder="Enter Project Name"
                onChangeText={(projectName) => setProjectName(projectName)}
                style={{padding: 10}}
              />
              <Mytextinput
                placeholder="Enter AccademicYear No"
                onChangeText={(projectAccademicYear) => setProjectAccademicYear(projectAccademicYear)}
                maxLength={13}
                keyboardType="numeric"
                style={{padding: 10}}
              />
              <Mytextinput
                placeholder="Enter Owner"
                onChangeText={(projectOwner) => setProjectOwner(projectName)}
                maxLength={225}
                numberOfLines={5}
                multiline={true}
                style={{textAlignVertical: 'top', padding: 10}}
              />
              <Mybutton title="Submit" customClick={create_project} />
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
        <Text style={{fontSize: 18, textAlign: 'center', color: 'grey'}}>
          student management with SQLite Database in React Native
        </Text>
        <Text style={{fontSize: 16, textAlign: 'center', color: 'grey'}}>
          sqlite database with react native
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default CreateProject;
