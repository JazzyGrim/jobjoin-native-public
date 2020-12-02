/*
*
*    Prikazuje sve detalje o oglasu te omogućuje prijavu i dodavanje oglasa u favorite
*
*/

import Icon from '@expo/vector-icons/Ionicons';
import AntIcon from '@expo/vector-icons/AntDesign';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Image, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { getDateDifferenceInWords } from '../../../../utils/DateDifference';
import { getImageUrl, getJobImageUrl } from '../../../../utils/imageManager';
import { apply, getJob, resetJob, toggleFavorite } from '../../../actions/job';
import { createErrorMessageSelector, createLoadingSelector } from '../../../actions/selector';
import messageStyles from '../../../styles/messages';
import AppModal from './ApplicationConfirmation';

const errorSelector = createErrorMessageSelector( [ 'GET_JOB' ] );
const applyLoading = createLoadingSelector( [ 'APPLY_JOB' ] );
const saveLoading = createLoadingSelector( [ 'SAVE_JOB' ] );

const mapStateToProps = ( state ) => {
    return {
        token: state.user.token,
        job: state.job.job,
        applyLoading: applyLoading( state ),
        saveLoading: saveLoading( state ),
        errorMessage: errorSelector( state )
    }
}

const mapDispatchToProps = {
    getJob,
    resetJob,
    toggleFavorite,
    apply
}

const JobScreen = ( props ) => {
    
    const [ modalVisible, setModalVisible ] = useState( false );
    const [ redirectToQuiz, setRedirectToQuiz ] = useState( false );
    
    const jobID = props.route.params.id;

    useEffect( ( ) => {
        if ( jobID ) { // If the job ID was specified in route params
            props.getJob( jobID, props.token ); // Get the job
        } else { // If the job ID wasn't specified
            props.navigation.goBack( ); // Go back to where we were
        }
        return ( ) => {
            props.resetJob( ); // Reset the job in the Redux state
        }
    }, [ ] );

    const openModal = ( ) => {
        setModalVisible( true );
    }

    const closeModal = ( ) => {
        setModalVisible( false );
    }

    const apply = ( will_do_quiz ) => {

        if( !props.job ) return;
        setModalVisible( false );
        
        if ( !props.job.quizRequired && !will_do_quiz ) {
            props.apply( false, props.job.id, props.token );
        } else {
            props.apply( true, props.job.id, props.token );
        }

        if ( props.job.quizID ) {
            if ( props.job.quizRequired || will_do_quiz ) {
                setRedirectToQuiz( true );
                return;
            }
        }
        
        // If the quiz is optional and the user doesn't want to fill it out
        // Apply for the job ( below code )
    }

    useEffect( ( ) => {
        
        if ( props.job && props.job.applied && redirectToQuiz ) props.navigation.reset( {
            index: 0,
            routes: [ { name: 'QuizScreen', params: { jobID, title: props.job.title, companyName: props.job.companyName } } ],
        } );

    }, [ props.job, redirectToQuiz ] );

    return  <SafeAreaView style={ styles.screen }>
                { ( props.route.params.quizSuccess ) && <Text style={ messageStyles.success }>{ props.route.params.quizSuccess }</Text> }
                { ( props.errorMessage.text ) && <Text style={ messageStyles.error }>{ props.errorMessage.text }</Text> }
                { props.job ? <>
                <View style={ styles.fixedFooter }>
                    
                    { props.job.applied ? <View style={ styles.applyButton }>
                        <Text style={ { ...styles.applyText, backgroundColor: '#808080' } }>Prijava poslana</Text>
                    </View> : 
                    // onPress={ ( ) => { props.apply( props.job.id, props.token ) } }
                    <TouchableOpacity onPress={ openModal } activeOpacity={ 0.7 } style={ styles.applyButton }>
                        { !props.applyLoading ? <Text style={ styles.applyText }>Prijavi se</Text>
                        : <ActivityIndicator size="large" color='#068CDD' />  }
                    </TouchableOpacity>
                    }
                    
                    <TouchableOpacity onPress={ ( ) => props.toggleFavorite( props.job.id, props.job.saved, props.token ) } activeOpacity={ 0.7 } style={ styles.favoriteButton }>
                        { !props.saveLoading ?
                            <Icon style={ styles.favoriteIcon } name={ props.job.saved ? "md-star" : 'md-star-outline' } size={ 35 } color={ '#068CDD' } />
                        : <ActivityIndicator size="large" color='#068CDD' />  }
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={ styles.backButton } activeOpacity={ 0.7 } onPress={ props.navigation.goBack }>
                    <AntIcon name="arrowleft" size={ 30 } color={ '#ffffff' } />
                </TouchableOpacity>
                <ScrollView contentContainerStyle={ styles.container }>
                    <ImageBackground resizeMode="cover" style={ styles.image } source={ getJobImageUrl( props.job.imagePath ) }>
                        <Text style={ styles.contractStyle }>{ props.job.employmentContract ? 'Puno radno vrijeme' : 'Nepuno radno vrijeme' }</Text>
                        { props.job.salary && <Text style={ styles.salaryStyle }>{ props.job.salary + ' HRK' }{ !props.job.salaryType && '/h' }</Text> }
                    </ImageBackground>
                    <View style={ styles.content }>
                        <View style={ styles.fullRow }>
                            <Text style={ styles.companyText }>{ props.job.companyName.toUpperCase( ) }</Text>
                            <Text style={ styles.timeText }>{ 'Objavljeno ' + getDateDifferenceInWords( new Date( props.job.created ) ) }</Text>
                        </View>
                        <Text style={ styles.titleText }>{ props.job.title }</Text>
                        <View style={ styles.row }>
                            <Icon name="md-pin" size={ 20 } color={ '#808080' } />
                            <Text style={ styles.locationText }>{ props.job.city + ', ' + props.job.country }</Text>
                        </View>
                        <View style={ styles.row }>
                            <Text style={ { ...styles.experienceStyle, 
                            backgroundColor: props.job.experience ? '#34C191' : '#F95F62', 
                            borderColor: props.job.experience ? '#34C191' : '#F95F62' } }>
                                { props.job.experience ? 'Iskustvo potrebno' : 'Iskustvo nepotrebno' }</Text>
                            <Text style={ styles.timeStyle }>{ props.job.employmentTime ? 'Trajna pozicija' : 'Privremena pozicija' }</Text>
                        </View>
                        <Text style={ styles.descriptionText }>{ props.job.description }</Text>
                        <Text style={ styles.typeContainer }>
                            <Text style={ styles.typeText }>Studenti prihvaćeni: </Text>
                            <Text style={ { ...styles.typeText, fontFamily: 'NotoSans' } }> { props.job.studentsAccepted ? 'Da' : 'Ne' } </Text>
                        </Text>
                        <Text style={ styles.typeContainer }>
                            <Text style={ styles.typeText }>Kategorija posla: </Text>
                            <Text style={ { ...styles.typeText, fontFamily: 'NotoSans' } }> { props.job.type } </Text>
                        </Text>
                        <TouchableOpacity activeOpacity={ 0.5 } style={ styles.recruiterContainer } onPress={ ( ) => props.navigation.navigate( 'RecruiterJobs', { recruiterID: props.job.recruiterID } ) } >
                                <Image style={ styles.recruiterImage } source={ getImageUrl( props.job.recruiterImagePath ) } />
                                <View style={ styles.recruiterContent }>
                                    <Text style={ styles.recruiterTitle }>Poslodavac:</Text>
                                    <Text style={ styles.recruiterName }>{ props.job.recruiterFirstName + ' ' + props.job.recruiterLastName }</Text>
                                </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                
                <AppModal
                    visible={ modalVisible }
                    closeModal={ closeModal }
                    quizID={ props.job.quizID }
                    quizRequired={ props.job.quizRequired }
                    apply={ apply }
                />
                
                </> : <ActivityIndicator size="large" color='#068CDD' /> }
            </SafeAreaView>
};

const styles = StyleSheet.create( {
    screen: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: "center"
    },
    container: {
        width: '100%',
        backgroundColor: 'white',
        minHeight: '100%',
        paddingBottom: 45
    },
    fixedFooter: {
        position: "absolute",
        bottom: 20,
        width: '100%',
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center'
    },
    applyButton: {
        zIndex: 10,
        width: 200,
        marginLeft: 'auto',
        transform: [
            { translateX: 35.5 }
        ]
    },
    applyText: {
        color: '#ffffff',
        backgroundColor: '#F95F62',
        borderRadius: 30,
        fontSize: 16,
        fontFamily: 'CaviarDreams-Bold',
        paddingVertical: 15,
        textAlign: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.23,
        shadowRadius: 4,
        elevation: 5
    },
    favoriteButton: {
        width: 46,
        height: 46,
        backgroundColor: '#ffffff',
        borderRadius: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.23,
        shadowRadius: 4,
        elevation: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 'auto',
        marginRight: 25,
        zIndex: 10,
    },
    image: {
        width: null,
        height: null,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10
    },
    backButton: {
        position: "absolute",
        left: 10,
        top: 20,
        paddingHorizontal: 10,
        backgroundColor: 'rgba( 0, 0, 0, 0.3 )',
        borderRadius: 10,
        zIndex: 10
    },
    contractStyle: {
        color: '#068CDD',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        fontSize: 14,
        fontFamily: 'NotoSans-Bold',
        marginTop: 200,
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    salaryStyle: {
        color: '#ffffff',
        backgroundColor: '#F95F62',
        borderRadius: 10,
        fontSize: 14,
        fontFamily: 'NotoSans-Bold',
        marginTop: 200,
        paddingVertical: 10,
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
    fullRow: {
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
        marginTop: 5,
        marginBottom: 10
    },
    locationText: {
        color: '#808080',
        fontSize: 15,
        fontFamily: 'NotoSans',
        marginLeft: 10,
    },
    experienceStyle: {
        color: '#ffffff',
        borderWidth: 1,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        fontSize: 14,
        fontFamily: 'CaviarDreams-Bold',
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    timeStyle: {
        color: '#068CDD',
        borderColor: '#068CDD',
        borderWidth: 1,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        fontSize: 14,
        fontFamily: 'CaviarDreams-Bold',
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginLeft: 10
    },
    typeContainer: {
        marginTop: 10
    },
    typeText: {
        color: '#333333',
        fontSize: 16,
        fontFamily: 'NotoSans-Bold'
    },
    descriptionText: {
        color: '#333333',
        fontSize: 16,
        fontFamily: 'NotoSans'
    },
    recruiterContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginVertical: 20,
        borderTopColor: '#E4E4E4',
        borderTopWidth: 1,
        paddingTop: 20
    },
    recruiterImage: {
        width: 60,
        height: 60,
        borderRadius: 75,
        marginRight: 20
    },
    recruiterTitle: {
        color: '#333333',
        fontSize: 15,
        fontFamily: 'NotoSans'
    },
    recruiterName: {
        color: '#333333',
        fontSize: 18,
        fontFamily: 'NotoSans'
    }
} );

export default connect( mapStateToProps, mapDispatchToProps )( JobScreen );