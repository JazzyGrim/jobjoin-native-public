/*
*
*    Vraća zadane slike korisnika ili oglasa
*
*/

import config from '../config'

export const getImageUrl = ( url ) => {
    if ( !url ) return require( '../assets/default-img.jpg' );
    return url.startsWith( 'http' ) ? { uri: url } : { uri: config.server.url + url }
}

export const getJobImageUrl = ( url ) => {
    if ( !url ) return require( '../assets/default-job.jpg' );
    return { uri: config.server.url + url }
}