/*
*
*    Prikazuje univerzalnu pomičnu traku
*
*/

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const AnimatedView = Animated.createAnimatedComponent(View);

CustomLabel.defaultProps = {
  leftDiff: 0,
};

function LabelBase(props) {
  const { position, value, leftDiff, pressed } = props;
  const scaleValue = React.useRef(new Animated.Value(0.1)); // Behaves oddly if set to 0
  const cachedPressed = React.useRef(pressed);
  const [ labelWidth, setLabelWidth ] = useState( 0 );

  useEffect(() => {
    Animated.timing(scaleValue.current, {
      toValue: pressed ? 1 : 0.1,
      duration: 200,
      delay: pressed ? 0 : 2000,
      useNativeDriver: false,
    }).start();
    cachedPressed.current = pressed;
  }, [pressed]);

  return (
    Number.isFinite(position) &&
    Number.isFinite(value) && (
      <AnimatedView
        style={[
          styles.sliderLabel,
          {
            left: position - labelWidth / 2 - 10,
            transform: [
                { translateY: 24 },
                { scale: scaleValue.current },
                { translateY: -24 },
            ],
          },
        ]}
        onLayout={ ( event ) => {
            var { width } = event.nativeEvent.layout;
            setLabelWidth( Math.round( width ) );
        } }>
        <View style={styles.pointer} />
        <Text style={styles.sliderLabelText}>{value}</Text>
      </AnimatedView>
    )
  );
}

export default function CustomLabel(props) {
  const {
    leftDiff,
    oneMarkerValue,
    twoMarkerValue,
    oneMarkerLeftPosition,
    twoMarkerLeftPosition,
    oneMarkerPressed,
    twoMarkerPressed,
  } = props;

  return (
    <View style={styles.parentView}>
      <LabelBase
        position={oneMarkerLeftPosition}
        value={oneMarkerValue}
        leftDiff={leftDiff}
        pressed={oneMarkerPressed}
      />
      <LabelBase
        position={twoMarkerLeftPosition}
        value={twoMarkerValue}
        leftDiff={leftDiff}
        pressed={twoMarkerPressed}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  parentView: {
    position: 'relative',
  },
  sliderLabel: {
    position: 'absolute',
    justifyContent: 'center',
    bottom: '100%',
    height: 24,
    marginLeft: 20,
    marginBottom: 5
  },
  sliderLabelText: {
    textAlign: 'center',
    borderColor: '#E4E4E4',
    borderWidth: 1,
    backgroundColor: '#fff',
    fontSize: 18,
    color: '#111',
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 5
  },
});