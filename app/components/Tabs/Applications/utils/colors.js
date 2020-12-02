/*
*
*    Računa teskt i boje prijava
*
*/

export const getStatus = ( status, expired ) => {
    if ( expired ) return 'Isteklo'
    if ( status == 0 ) return 'Aktivno'
    if ( status == 1 ) return 'Uži odabir'
    if ( status == 3 ) return 'Odbijeno'
}

export const getBackgroundColor = ( status, expired ) => {
    if ( expired ) return '#F95F62'
    if ( status == 0 ) return '#F8F8F8'
    if ( status == 1 ) return '#34C191'
    if ( status == 3 ) return '#F95F62'
}

export const getColor = ( status, expired ) => {
    if ( expired ) return '#ffffff'
    if ( status == 0 ) return '#111111'
    if ( status == 1 ) return '#ffffff'
    if ( status == 3 ) return '#ffffff'
}