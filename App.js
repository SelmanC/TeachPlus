import React, { Component } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { RootRouter } from './src/Router';

class App extends Component {
  render() {
    return (
      <View style={styles.appStyle}>
         <StatusBar barStyle="light-content" />
        <RootRouter />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  appStyle: {
    flex: 1
  }
});

export default App;
