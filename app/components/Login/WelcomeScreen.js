/*
*
*    Prikazuje animirane stranice prilikom prvog pokretanja aplikacije
*
*/

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, View, Text } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import LottieView from "lottie-react-native";
import { setWalkthroughFinished } from '../../../auth';
 
const { width } = Dimensions.get( 'window' ); // Get the window dimensions

const location = require( '../../../assets/location.json' );
const chat = require( '../../../assets/chat.json' );
const profile = require( '../../../assets/profile.json' );

const slides = [
    {
        key: '1',
        title: 'Filtriraj oglase',
        text: 'Postavi svoju kućnu adresu te filtriraj oglase po udaljenosti od kuće, plaći, radnom iskustvu i mnogo više!',
        source: location,
        backgroundColor: '#ffffff',
    },
    {
        key: '2',
        title: 'Prijave',
        text: 'Prati status svoje prijave, a nakon što poslodavac prihvati tvoju prijavu, razgovor vodite direktno unutar aplikacije.',
        source: chat,
        backgroundColor: '#ffffff',
    },
    {
        key: '3',
        title: 'Uredi svoj profil',
        text: 'Dodaj sliku, kratki opis i svoja prijašnja radna iskustva! Dobra profilna stranica povećava šanse da poslodavac prihvati tvoju prijavu!',
        source: profile,
        backgroundColor: '#ffffff',
    }
];
 
const WelcomeScreen = ( props ) => {
  
    const animationOne = useRef( );
    const animationTwo = useRef( );
    const animationThree = useRef( );

    const [ showRealApp, setShowRealApp ] = useState( false );

    const _renderItem = ( { item } ) => {
        return <View style={ styles.slide }>
            <LottieView
                ref={a => {
                    if ( item.key == '1' ) animationOne.current = a;
                    if ( item.key == '2' ) animationTwo.current = a;
                    if ( item.key == '3' ) animationThree.current = a;
                }}
                loop={ false }
                style={{
                    width: width / 3 * 2,
                    height: width / 3 * 2
                }}
                source={ item.source }
            />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.text}>{item.text}</Text>
        </View>;
    }
  
    const _onDone = () => {
        setWalkthroughFinished( );
        setShowRealApp( true );
    }

    useEffect( ( ) => {
        if ( animationOne.current ) animationOne.current.play( )
    }, [ animationOne.current ] );

    useEffect( ( ) => {
        if ( showRealApp ) props.navigation.navigate( 'Login' );
    }, [ showRealApp ] );

    const playAnimation = ( index, lastIndex ) => {
        if ( index == 0 ) {
            animationOne.current.play( );
            animationTwo.current.reset( );
            animationThree.current.reset( );
        }
        if ( index == 1 ) {
            animationOne.current.reset( );
            animationTwo.current.play( );
            animationThree.current.reset( );
        }
        if ( index == 2 ) {
            animationOne.current.reset( );
            animationTwo.current.reset( );
            animationThree.current.play( );
        }
    }

    return <AppIntroSlider
        onSlideChange={ playAnimation }
        renderItem={ _renderItem}
        data={slides}
        showPrevButton
        prevLabel={ <Text style={ styles.prevButton }>Nazad</Text> }
        doneLabel={ <Text style={ styles.nextButton }>Kreni!</Text> }
        nextLabel={ <Text style={ styles.nextButton }>Dalje</Text> }
        onDone={_onDone}
        activeDotStyle={ { backgroundColor: '#068CDD' } } />;
    
}

const styles = StyleSheet.create( {
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
    },
    image: {
        width: width - 80,
        height: width - 80,
        marginBottom: 20
    },
    title: {
        fontSize: 22,
        fontFamily: 'NotoSans',
        color: '#0B323C',
        fontWeight: "bold",
        textAlign: 'center',
        marginBottom: 10
    },
    text: {
        width: width - 40,
        fontSize: 16,
        lineHeight: 24,
        fontFamily: 'NotoSans',
        color: '#111111',
        textAlign: 'center',
    },
    prevButton: {
        fontSize: 18,
        fontFamily: 'NotoSans',
        color: '#808080',
    },
    nextButton: {
        fontSize: 18,
        fontFamily: 'NotoSans',
        color: '#0B323C',
        fontWeight: "bold",
    }
} );

export default WelcomeScreen;