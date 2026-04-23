import React from 'react';
import {
  View,
  Image
} from 'react-native';

export default () => {
  return (
    <View style = {
      {
        "alignItems": "flex-start",
        "flex": 1
      }
    } >
    <Image style = {
      {
        "width": 1920,
        "height": 1035
      }
    }
    source = {
      {
        /* add your source here */ }
    }
    />
    </View>

  );
};