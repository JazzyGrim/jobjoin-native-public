/*
*
*    Sardži stilove za poruke uspijeha i poruke pogrešaka
*
*/

import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get( 'window' ); // Get the window dimensions

export default StyleSheet.create( {

    success: {
        width: width,
        padding: 10,
        color: '#ffffff',
        backgroundColor: '#34C191',
        fontSize: 20,
        fontFamily: 'NotoSans',
        zIndex: 5
    },
    error: {
        width: width,
        padding: 10,
        color: '#ffffff',
        backgroundColor: '#ff4a49',
        fontSize: 20,
        fontFamily: 'CaviarDreams',
        zIndex: 5
    }

} );