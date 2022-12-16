// Example: Example of SQLite Database in React Native
// https://aboutreact.com/example-of-sqlite-database-in-react-native
// Screen to update the project

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

var db = openDatabase({name: 'ProjectDatabase.db'});

const UpdateProject = ({navigation}) => {
  let [inputprojectId, setInputProjectId] = useState('');
  let [projectName, setProjectName] = useState('');
  let [projectAccademicYear, setProjectAccademicYear] = useState('');
  let [projectOwner, setProjectOwner] = useState('');

  let updateAllStates = (name, accademicYear, owner) => {
    setProjectName(name);
    setProjectAccademicYear(accademicYear);
    setProjectOwner(owner);
  };

  let searchProject = () => {
    console.log(inputprojectId);
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM table_project where project_id = ?',
        [inputProjectId],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            let res = results.rows.item(0);
            updateAllStates(res.project_name, res.project_accademicYear, res.project_owner);
          } else {
            alert('No project found');
            updateAllStates('', '', '');
          }
        },
      );
    });
  };
  let updateproject = () => {
    console.log(inputProjectId, projectName, projectAccademicYear, projectOwner);

    if (!inputProjectId) {
      alert('Please fill project id');
      return;
    }
    if (!projectName) {
      alert('Please fill name');
      return;
    }
    if (!projectAccademicYear) {
      alert('Please fill AccademicYear');
      return;
    }
    if (!projectOwner) {
      alert('Please fill Owner');
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE table_project set project_name=?, project_accademicYear=? , project_owner=? where project_id=?',
        [projectName, projectAccademicYear, projectOwner, inputProjectId],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'project updated successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('HomeScreen'),
                },
              ],
              {cancelable: false},
            );
          } else alert('Updation Failed');
        },
      );
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{flex: 1}}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <KeyboardAvoidingView
              behavior="padding"
              style={{flex: 1, justifyContent: 'space-between'}}>
              <Mytextinput
                placeholder="Enter Project Id"
                style={{padding: 10}}
                onChangeText={(inputProjectId) => setInputProjectId(inputProjectId)}
              />
              <Mybutton title="Search Project" customClick={searchProject} />
              <Mytextinput
                placeholder="Enter Name"
                value={projectName}
                style={{padding: 10}}
                onChangeText={(projectName) => setProjectName(projectName)}
              />
              <Mytextinput
                placeholder="Enter AccademicYear No"
                value={'' + projectAccademicYear}
                onChangeText={(projectAccademicYear) => setProjectAccademicYear(projectAccademicYear)}
                maxLength={10}
                style={{padding: 10}}
                keyboardType="numeric"
              />
              <Mytextinput
                value={projectOwner}
                placeholder="Enter Owner"
                onChangeText={(projectOwner) => setProjectOwner(projectOwner)}
                maxLength={225}
                numberOfLines={5}
                multiline={true}
                style={{textAlignVertical: 'top', padding: 10}}
              />
              <Mybutton title="Update Project" customClick={updateProject} />
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
        <Text style={{fontSize: 18, textAlign: 'center', color: 'grey'}}>
          Example of SQLite Database in React Native
        </Text>
        <Text style={{fontSize: 16, textAlign: 'center', color: 'grey'}}>
          www.aboutreact.com
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default UpdateProject;
