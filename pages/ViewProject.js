// Example: Example of SQLite Database in React Native
// https://aboutreact.com/example-of-sqlite-database-in-react-native
// Screen to view single Project

import React, {useState} from 'react';
import {Text, View, SafeAreaView} from 'react-native';
import Mytextinput from './components/Mytextinput';
import Mybutton from './components/Mybutton';
import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'ProjectDatabase.db'});

const ViewProject= () => {
  let [inputProjectId, setInputProjectId] = useState('');
  let [ProjectData, setProjectData] = useState({});

  let searchProject = () => {
    console.log(inputProjectId);
    setProjectData({});
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM table_project where project_id = ?',
        [inputProjectId],
        (tx, results) => {
          var len = results.rows.length;
          console.log('len', len);
          if (len > 0) {
            setProjectData(results.rows.item(0));
          } else {
            alert('No project found');
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
          <Mybutton title="Search Project" customClick={searchProject} />
          <View style={{marginLeft: 35, marginRight: 35, marginTop: 10}}>
            <Text>Project Id: {projectData.project_id}</Text>
            <Text>Project Name: {projectData.project_name}</Text>
            <Text>Project AccademicYear: {projectData.project_accademicYear}</Text>
            <Text>Project Owner: {projectData.project_owner}</Text>
          </View>
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

export default ViewProject;
