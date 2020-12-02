/*
*
*    Prikazuje sve oglase odabranog poslodavca
*
*/

import Icon from '@expo/vector-icons/MaterialIcons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { getImageUrl } from '../../../../utils/imageManager';
import { getRecruiter, getRecruiterJobs, refreshJobList, resetJobList } from '../../../actions/recruiter';
import { createLoadingSelector, createErrorMessageSelector } from '../../../actions/selector';
import messageStyles from '../../../styles/messages';
import JobCard from './JobCard';

const { width } = Dimensions.get( 'window' ); // Get the window dimensions

const loadingSelector = createLoadingSelector( [ 'GET_RECRUITER', 'GET_RECRUITER_JOBS' ] );
const errorSelector = createErrorMessageSelector( [ 'GET_RECRUITER', 'GET_RECRUITER_JOBS' ] );

const mapStateToProps = ( state ) => {
    return {
        token: state.user.token,
        jobList: state.recruiter.jobList,
        loadingJobs: loadingSelector( state ),
        page: state.recruiter.jobPage,
        recruiter: state.recruiter.recruiter,
        errorMessage: errorSelector( state )
    }
}

const mapDispatchToProps = {
    getRecruiter,
    getRecruiterJobs,
    refreshJobList,
    resetJobList
}

const RecruiterJobs = ( props ) => {
    
    const recruiterID = props.route.params.recruiterID;

    const [ refreshing, setRefreshing ] = useState( false );
    
    useEffect( ( ) => {
        if ( refreshing && !props.loadingJobs ) setRefreshing( false );
    }, [ props.loadingJobs ] );

    useEffect( ( ) => {
        if ( recruiterID ) { // If the recruiter ID was specified in route params
            props.getRecruiter( recruiterID, props.token );
            props.getRecruiterJobs( recruiterID, props.token, 0 );
        } else { // If the recruiter ID wasn't specified
            props.navigation.goBack( ); // Go back to where we were
        }
        return ( ) => {
            props.resetJobList( ); // Reset the job list, job page, and set loading to true
        }
    }, [ ] );

    useEffect( ( ) => {

        if ( recruiterID ) {
            props.navigation.setOptions( {
                headerRight: ( ) => {
                        return <TouchableOpacity onPress={ ( ) => props.navigation.navigate( 'ReportRecruiter', { recruiterID } ) }>
                            <Icon name="report" size={ 25 } color={ '#111111' } />
                        </TouchableOpacity>
                },
                headerRightContainerStyle: {
                    marginRight: 20
                }
            } );
        }

    }, [ ] );

    const loadMoreJobs = ( ) => {
        if ( props.jobList.length % 10 !== 0 ) return; // If there are no more jobs to be found
        if ( props.loadingJobs ) return; // Prevent duplicate calls from being made
        props.getRecruiterJobs( recruiterID, props.token, props.page );
    }

    const handleRefresh = ( ) => {
        setRefreshing( true );
        props.refreshJobList( );
        props.getRecruiterJobs( recruiterID, props.token, 0 );
    }

    return <>
            <StatusBar barStyle="dark-content" />
            { ( props.errorMessage.text ) && <Text style={ messageStyles.error }>{ props.errorMessage.text }</Text> }
            <View style={ { flex: 1, alignItems: "center", justifyContent: "flex-start" }  }>
                { props.recruiter ? <>
                <View style={ styles.recruiterContainer }>
                    <Image style={ styles.recruiterImage } source={ getImageUrl( props.recruiter.imagePath ) } />
                    <View style={ styles.recruiterContent }>
                        <Text style={ styles.recruiterCompany }>{ props.recruiter.companyName }</Text>
                        <Text style={ styles.recruiterName }>{ props.recruiter.firstName + ' ' + props.recruiter.lastName }</Text>
                    </View>
                </View>
                <FlatList
                    contentContainerStyle={{
                        width: width
                    }}
                    data={ props.jobList }
                    keyExtractor={ item => item.JobID }
                    renderItem={ ( { item } ) => (
                        <JobCard job={ item } handlePress={ ( ) => props.navigation.navigate( 'JobScreen', { id: item.JobID } ) } />
                    ) }
                    onEndReached={ loadMoreJobs }
                    onEndReachedThreshold={0.1}
                    initialNumToRender={10}
                    ListFooterComponent={
                        props.loadingJobs && !refreshing && <ActivityIndicator size="large" color='#068CDD' style={ { marginVertical: 10 } } />
                        // If we are loading jobs, render this, if we arent ( for example there are no more jobs ) render nothing
                    }
                    onRefresh={ handleRefresh }
                    refreshing={ refreshing }
                />
                </> : <ActivityIndicator size="large" color='#068CDD' style={ { marginVertical: 10 } } /> }
            </View>
            </>;
};

RecruiterJobs.navigationOptions = {
    headerTitleAlign: 'center',
    headerTitle: 'Oglasi poslodavca'
};

const styles = StyleSheet.create( {
    recruiterContainer: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginVertical: 20,
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: '#ffffff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.23,
        shadowRadius: 4,
        elevation: 5
    },
    recruiterImage: {
        width: 60,
        height: 60,
        borderRadius: 75,
        marginRight: 20
    },
    recruiterCompany: {
        color: '#333333',
        fontSize: 15,
        fontFamily: 'NotoSans-Bold'
    },
    recruiterName: {
        color: '#333333',
        fontSize: 18,
        fontFamily: 'NotoSans'
    }
} );

export default connect( mapStateToProps, mapDispatchToProps )( RecruiterJobs );