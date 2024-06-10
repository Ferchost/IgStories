import React from 'react';
import 'react-native-gesture-handler'
import { SafeAreaView, StyleSheet } from 'react-native';
import StoryCarousel from './screens/StoryCarouselContent';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StoryCarousel />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});

export default App;
