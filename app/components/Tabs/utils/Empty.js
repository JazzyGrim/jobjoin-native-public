/*
*
*    Prikazuje poruku ukoliko tražene informacije ne postoje ( primjerice nije pronađen niti jedan oglas )
*
*/

import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import LottieView from "lottie-react-native";

const { width } = Dimensions.get( 'window' ); // Get the window dimensions

const Empty = React.memo( props => {
    return  <View style={ styles.container }>
                {/* <Image resizeMode="cover" style={ styles.image } source={ props.image } /> */}
                <LottieView
                    autoPlay
                    loop={ true }
                    style={{
                        width: ( width / 4 ) * 2,
                        height: ( width / 4 ) * 2
                    }}
                    source={require('../../../../assets/notfound.json')}
                />
                <Text style={ styles.titleText }>{ props.title }</Text>
                <Text style={ styles.subtitleText }>{ props.subtitle }</Text>
            </View>
} );

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    image: {
        width: width / 3,
        height: width / 3
    },
    titleText: {
        color: '#0B323C',
        fontSize: 20,
        fontFamily: 'NotoSans-Bold',
        marginTop: 5
    },
    subtitleText: {
        color: '#0B323C',
        fontSize: 16,
        fontFamily: 'NotoSans',
        marginTop: 5
    }
} );

export default Empty;