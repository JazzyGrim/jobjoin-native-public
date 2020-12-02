/*
*
*    Računa godine i datum objave
*
*/

const MilisecondsPerDay = 1000 * 60 * 60 * 24;

export function getDateDifference( date ) {

  // UTC removes time zones
  const utc1 = Date.UTC( date.getFullYear( ), date.getMonth( ) , date.getDate( ) );
  const utc2 = Date.UTC( new Date( ) );

  return Math.floor( ( utc2 - utc1 ) / MilisecondsPerDay );
}

export function getDateDifferenceInWords( date ) {
    const difference = getDateDifference( date )

    switch ( difference ) {
        case 0:
            return "danas"
        case 1:
            return "jucer"
        case 2:
            return "prekjucer"
        default:
            return date.getDate( ) + "/" + ( date.getMonth( ) + 1 ) + "/" + date.getFullYear( )
    }

}

export function getAge( birthday ) {
    var ageDifferenceInMiliseconds = Date.now() - birthday.getTime()
    var ageDate = new Date( ageDifferenceInMiliseconds )
    return Math.abs( ageDate.getUTCFullYear( ) - 1970 )
}