/*
*
*    Vraća token za notifikacije koristeći Expo platformu
*
*/

import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

export const getNotificationToken = ( ) => {

    return new Promise( ( resolve, reject ) => {
        Permissions.askAsync(Permissions.NOTIFICATIONS).then( ( { status } ) => {
            if (status !== 'granted') {
                console.log('No notification permissions!');
                return;
              }
            
              // Get the token that identifies this device
              Notifications.getExpoPushTokenAsync().then( token => {
                  resolve( token );
              } ).catch( error => {
                  reject( error );
              } );

        } ).catch( error => {
            reject( error );
        } );

    } );

}