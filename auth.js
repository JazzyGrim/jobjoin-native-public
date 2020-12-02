/*
*
*   Pohrana i čitanje podataka s uređaja korisnika
*
*/

import * as SecureStore from 'expo-secure-store';

export const signIn = ( id, token, type ) => {
    SecureStore.setItemAsync( 'user', JSON.stringify( { id, token, type } ) ).catch( error => {
        console.log( error );
    } );
}

export const signOut = ( ) => SecureStore.deleteItemAsync( 'user' );

export const getWalkthroughStatus = ( ) => {
  return new Promise( ( resolve, reject ) => {
    SecureStore.getItemAsync( 'walkthrough' ).then( result => {
        resolve( JSON.parse( result ) );
      } ).catch( error => {
        reject( error );
        console.warn( error );
      } );
  } );
};

export const setWalkthroughFinished = ( ) => {
  SecureStore.setItemAsync( 'walkthrough', JSON.stringify( true ) ).catch( error => {
    console.log( error );
} );
};

export const getUser = ( ) => {
  return new Promise( ( resolve, reject ) => {
    SecureStore.getItemAsync( 'user' ).then( result => {
        resolve( JSON.parse( result ) );
      } ).catch( error => {
        reject( error );
        console.warn( error );
      } );
  } );
};

export const getConfig = ( ) => {
  return new Promise( ( resolve, reject ) => {
    SecureStore.getItemAsync( 'config' ).then( result => {
        resolve( JSON.parse( result ) );
      } ).catch( error => {
        reject( error );
        console.warn( error );
      } );
  } );
};

export const saveConfig = ( config ) => {
  SecureStore.setItemAsync( 'config', JSON.stringify( config ) ).catch( error => {
    console.log( error );
} );
};

export const getFilters = ( ) => {
  return new Promise( ( resolve, reject ) => {
    SecureStore.getItemAsync( 'filters' ).then( result => {
        resolve( JSON.parse( result ) );
      } ).catch( error => {
        reject( error );
        console.warn( error );
      } );
  } );
};

export const saveFiltersToStorage = ( filters ) => {
  SecureStore.setItemAsync( 'filters', JSON.stringify( filters ) ).catch( error => {
    console.log( error );
} );
};