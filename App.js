/*
*
*   Prikazuje mobilnu aplikaciju te učitava potrebne datoteke i biblioteke prilikom pokretanja aplikacije
*
*/

console.ignoredYellowBox = [ 'Remote debugger' ];

import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import AppContainer from './navigators';
import store from './store';
import TimeoutModal from './TimeoutModal';

const NotoSans = require( './assets/fonts/NotoSans-Regular.ttf' );
const NotoSansBold = require( './assets/fonts/NotoSans-Bold.ttf' );
const CaviarDreams = require( './assets/fonts/CaviarDreams.ttf' );
const CaviarDreamsBold = require( './assets/fonts/CaviarDreams_Bold.ttf' );

function cacheImages( images ) {
    return images.map(image => Asset.fromModule( image ).downloadAsync( ) );
}

function cacheFonts(fonts) {
    return fonts.map( font => Font.loadAsync( font ) );
}

// Ignore the annoying socket IO warning
YellowBox.ignoreWarnings( [
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
] );

export default function App( ) {

    const [ assetsLoaded, setAssetsLoaded ] = useState( false );

    async function _loadAssetsAsync( ) {
        const imageAssets = cacheImages( [ require('./assets/timeout.png'), require('./assets/empty-jobs.png'), require('./assets/login-bg.png'), require( './assets/default-job.jpg' ), require( './assets/default-img.jpg' ) ] ); // Select which images to cache
        
        const fontAssets = cacheFonts( [ { 'CaviarDreams': CaviarDreams }, { 'CaviarDreams-Bold': CaviarDreamsBold },
        { 'NotoSans': NotoSans }, { 'NotoSans-Bold': NotoSansBold },
        FontAwesome.font, Ionicons.font, SimpleLineIcons.font, AntDesign.font, MaterialIcons.font, MaterialCommunityIcons.font ] );

        await Promise.all( [ ...imageAssets, ...fontAssets ] );
    }

    return ( assetsLoaded ) ? (
        <Provider store={ store }>
            <AppContainer />
            <TimeoutModal />
        </Provider>
    ) : ( <AppLoading
        startAsync={ _loadAssetsAsync }
        onFinish={ () => setAssetsLoaded( true ) }
        onError={ console.warn }
    /> );
}