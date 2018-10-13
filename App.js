import React, { Component } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { RootRouter } from './src/Router';
import reducers from './src/reducers';

class App extends Component {
  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
    
    return (
      <Provider store={store}>
        <View style={styles.appStyle}>
          <StatusBar barStyle="light-content" />
          <RootRouter />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  appStyle: {
    flex: 1
  }
});

export default App;
