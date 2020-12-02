/*
*
*    Prikazuje karticu za individualan oglas s osnovnim informacijama
*
*/

import Icon from '@expo/vector-icons/Ionicons';
import React from 'react';
import { ImageBackground, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getDateDifferenceInWords } from '../../../../utils/DateDifference';
import { getJobImageUrl } from '../../../../utils/imageManager';

const { width } = Dimensions.get( 'window' ); // Get the window dimensions

const JobCard =  React.memo( ( { job, handlePress } ) => {
    if ( job == null ) return;
    return  <TouchableOpacity style={ styles.container } activeOpacity={0.8} onPress={ handlePress }>
                <ImageBackground imageStyle={ { borderTopLeftRadius: 5, borderTopRightRadius: 5 } } resizeMode="cover" style={ styles.image } source={ getJobImageUrl( job.JobImagePath ) }>
                    <Text style={ styles.contractStyle }>{ job.JobEmploymentContract ? 'Puno radno vrijeme' : 'Nepuno radno vrijeme' }</Text>
                    { job.JobSalary && <Text style={ styles.salaryStyle }>{ job.JobSalary + ' HRK' }{ !job.JobSalaryType && '/h' }</Text> }
                </ImageBackground>
                <View style={ styles.content }>
                    <View style={ styles.topRow }>
                        { job.JobCompanyName && <Text style={ styles.companyText }>{ job.JobCompanyName.toUpperCase( ) }</Text> }
                        <Text style={ styles.timeText }>{ 'Objavljeno ' + getDateDifferenceInWords( new Date( job.JobCreated ) ) }</Text>
                    </View>
                    <Text style={ styles.titleText }>{ job.JobTitle }</Text>
                    <View style={ styles.row }>
                        <Icon name="md-pin" size={ 20 } color={ '#808080' } />
                        <Text style={ styles.locationText }>{ job.JobCity + ', ' + job.JobCountry }</Text>
                    </View>
                    { job.JobDescription != null && <Text numberOfLines={ 3 } style={ styles.descriptionText }>{ job.JobDescription.replace( /^\s*[\r\n]/gm, "" ) }</Text> }
                    { job.distance != null && <Text numberOfLines={ 3 } style={ styles.distanceText }>{ job.distance.toFixed( 2 ) + 'km' }</Text> }
                </View>
            </TouchableOpacity>
} );

const styles = StyleSheet.create( {
    container: {
        marginHorizontal: 15,
        marginVertical: 10,
        width: width - 30,
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
    },
    image: {
        width: null,
        height: null,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10
    },
    contractStyle: {
        color: '#068CDD',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        fontSize: 14,
        fontFamily: 'NotoSans',
        marginTop: 150,
        paddingVertical: 5,
        paddingHorizontal: 15
    },
    salaryStyle: {
        color: '#ffffff',
        backgroundColor: '#F95F62',
        borderRadius: 10,
        fontSize: 14,
        fontFamily: 'NotoSans',
        marginTop: 150,
        paddingVertical: 5,
        paddingHorizontal: 15,
        marginLeft: 10
    },
    content: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: "center",
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 20
    },
    companyText: {
        color: '#808080',
        fontSize: 15,
        fontFamily: 'NotoSans-Bold',
    },
    timeText: {
        color: '#808080',
        fontSize: 14,
        fontFamily: 'NotoSans',
    },
    titleText: {
        color: '#0B323C',
        fontSize: 20,
        fontFamily: 'NotoSans-Bold',
        marginTop: 5
    },
    topRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 5,
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: "center",
        marginBottom: 5
    },
    locationText: {
        color: '#808080',
        fontSize: 15,
        fontFamily: 'NotoSans',
        marginLeft: 10,
    },
    descriptionText: {
        color: '#333333',
        fontSize: 16,
        fontFamily: 'NotoSans'
    },
    distanceText: {
        alignSelf: 'flex-end',
        color: '#808080',
        fontSize: 14,
        fontFamily: 'NotoSans'
    }
} );

export default JobCard;