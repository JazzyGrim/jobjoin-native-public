/*
*
*    Prikazuje stranicu za listu oglasa
*
*/

import IonIcon from '@expo/vector-icons/Ionicons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, SafeAreaView, ScrollView, StatusBar, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { getFilters, saveFiltersToStorage } from '../../../../auth';
import jobTypes from '../../../../jobTypes';
import { resetErrors } from '../../../actions/error';
import { getFavorites, refreshJobList, resetJobList, search } from '../../../actions/job';
import { createErrorMessageSelector, createLoadingSelector } from '../../../actions/selector';
import messageStyles from '../../../styles/messages';
import Empty from '../utils/Empty';
import Button from './Button';
import IconButton from './IconButton';
import JobCard from './JobCard';
import SliderLabel from './SliderLabel';

const { width, height } = Dimensions.get( 'window' ); // Get the window dimensions

const loadingSelector = createLoadingSelector( [ 'GET_JOB_LIST' ] );
const errorSelector = createErrorMessageSelector( [ 'GET_JOB_LIST' ] );

const mapStateToProps = ( state ) => {
    return {
        token: state.user.token,
        jobList: state.job.jobList,
        loadingJobs: loadingSelector( state ),
        page: state.job.jobPage,
        errorMessage: errorSelector( state )
    }
}

const mapDispatchToProps = { 
    search,
    getFavorites,
    refreshJobList,
    resetJobList,
    resetErrors
}

const Jobs = ( props ) => {

    useFocusEffect( useCallback( ( ) => {
            StatusBar.setBarStyle( 'light-content' );
            Platform.OS === 'android' && StatusBar.setBackgroundColor('#068CDD');
        }, [ ] )
    );

    const [ inputs, setInputs ] = useState( {
        locationType: 0,
        city: '',
        type: 'hzp9Ns0xhuB',
        experience: true,
        contract: true,
        temporary: true,
        studentsAccepted: true
    } );

    const oldFilters = useRef( );
    const oldSalary = useRef( );
    
    const [ settingDefaultFilters, setSettingDefaultFilters ] = useState( false );
    const [ modalVisible, setModalVisible ] = useState( false );
    const [ categoryModalVisible, setCategoryModalVisible ] = useState( false );
    const [ showingFavorites, setShowingFavorites ] = useState( false );
    const [ refreshing, setRefreshing ] = useState( false );
    
    useEffect( ( ) => {
        if ( refreshing && !props.loadingJobs ) setRefreshing( false );
    }, [ props.loadingJobs ] );

    useEffect( ( ) => {

        // Try and recover the saved config, and then search either way
        getFilters( ).then( filters => {
            if ( filters && global.config.saveFilters ) {
                setSettingDefaultFilters( true );
                setInputs( filters.inputs );
                setSliderValue( filters.sliderValue );
            }
        } );

        return ( ) => {
            props.resetJobList( ); // Reset the job list, job page, and set loading to true
        }
    }, [ ] );

    useEffect( ( ) => {
        if ( settingDefaultFilters ) {
            setSettingDefaultFilters( false );
            search( );
        }
    }, [ inputs ] );

    const loadMoreJobs = ( ) => {
        if ( props.jobList.length % 10 !== 0 ) return; // If there are no more jobs to be found
        if ( props.loadingJobs ) return; // Prevent duplicate calls from being made
        !showingFavorites ? search( props.page ) : props.getFavorites( props.token, props.page );
    }

    const showFavorites = ( ) => {
        setShowingFavorites( true );
        props.resetJobList( ); // Reset the job list, job page, and set loading to true
        props.getFavorites( props.token, 0 );
    }

    const hideFavorites = ( ) => {
        setShowingFavorites( false );
        props.resetJobList( ); // Reset the job list, job page, and set loading to true
        search( )
    }

    const handleRefresh = ( ) => {    
        if ( JSON.stringify( oldFilters.current ) != JSON.stringify( inputs ) || JSON.stringify( oldSalary.current ) != JSON.stringify( sliderValue ) ) {
            if ( global.config.saveFilters ) saveFiltersToStorage( { inputs, sliderValue } );

            props.resetErrors( );
            setRefreshing( true );
            props.refreshJobList( );
            !showingFavorites ? search( 0 ) : props.getFavorites( props.token, 0 );
        
            oldFilters.current = { ...inputs }
        }
    }

    const handleChange = ( name, value ) => {
        setInputs( { ...inputs, [name]: value } );
    }

    const [ sliderValue, setSliderValue ] = useState( [ 1000, 4000 ] );
    const handleSliderChange = values => setSliderValue( values );

    const search = ( page = 0 ) => {
        const data = { }

        if ( inputs.locationType == 1 && inputs.city != '' ) data.city = inputs.city;
        data.gte = sliderValue[ 0 ];
        data.lte = sliderValue[ 1 ];
        data.type = inputs.type;
        data.experience = inputs.experience ? 1 : 0;
        data.contract = inputs.contract ? 1 : 0;
        data.temporary = inputs.temporary ? 1 : 0;
        data.studentsAccepted = inputs.studentsAccepted ? 1 : 0;
        props.search( props.token, data, page );
    }

    const openModal = ( ) => {
        oldFilters.current = { ...inputs };
        oldSalary.current = [ ...sliderValue ];
        setModalVisible( true );
    }

    const closeModal = ( ) => {
        setModalVisible( false );
        handleRefresh( );
    };

    const closeCategoryModal = ( ) => {
        setCategoryModalVisible( false );
        handleRefresh( );
    };

    return <>
            { ( props.errorMessage.text ) && <Text style={ messageStyles.error }>{ props.errorMessage.text }</Text> }
            <SafeAreaView style={ { flex: 1, alignItems: "center", justifyContent: "flex-start", backgroundColor: '#ffffff' }  }>
                <StatusBar barStyle="light-content" backgroundColor="#068CDD" />
                <View style={ styles.header }>
                    <IconButton icon="sliders-h" disabled={ ( props.loadingJobs || props.refreshing ) || showingFavorites } text="Filteri" onPress={ openModal } />
                    <IconButton icon="box" disabled={ ( props.loadingJobs || props.refreshing ) || showingFavorites } text="Kategorija" onPress={ ( ) => setCategoryModalVisible( true ) } />
                    <IconButton icon="star" disabled={ props.loadingJobs || props.refreshing } text="Spremljeno" solid={ showingFavorites } onPress={ ( ) => showingFavorites ? hideFavorites() : showFavorites() } />
                </View>
                <Modal
                    isVisible={ modalVisible }
                    onBackButtonPress={ closeModal }
                    onBackdropPress={ closeModal }
                    onSwipeComplete={ closeModal }
                    swipeDirection={ [ 'down' ] }
                    style={ styles.modal }
                    backdropOpacity={ 0.3 }
                    useNativeDriver={ true }
                >
                    <View style={ styles.container }>
                            <Text style={ styles.sectionText }>Sortiraj po</Text>
                            <View style={ styles.row }>
                                <Button onPress={ ( ) => handleChange( 'locationType', 0 ) } text="Udaljenosti od kuce" active={ inputs.locationType == 0 } />
                                <Button onPress={ ( ) => handleChange( 'locationType', 1 ) } text="Gradu" active={ inputs.locationType == 1 } />
                            </View>
                            
                            { inputs.locationType == 1 && <View style={ styles.inputContainer }>
                                <IonIcon style={ styles.inputIcon } name="md-pin" size={ 20 } color={ '#0B323C' } />
                                <TextInput style={ styles.input } placeholder="Ime grada" value={ inputs.city } onChangeText={ ( value ) => handleChange( 'city', value ) } />
                            </View> }

                            <Text style={ styles.sectionText }>Placa</Text>
                            
                            <MultiSlider
                                sliderLength={ width - 60 }
                                onValuesChange={ handleSliderChange }
                                values={ [ sliderValue[ 0 ], sliderValue[ 1 ] ] }
                                min={ 500 }
                                max={ 30000 }
                                step={ 500 }
                                allowOverlap={ false }
                                snapped
                                enableLabel
                                customLabel={ SliderLabel }
                                customMarker={ ( ) => <View style={ styles.sliderMarker }></View> }
                                selectedStyle={ {
                                    backgroundColor: '#068CDD'
                                } }
                                unselectedStyle={ {
                                    backgroundColor: '#E4E4E4'
                                } }
                                containerStyle={ styles.slider }
                                trackStyle={ {
                                    height: 10,
                                    borderRadius: 5
                                } }
                                touchDimensions={ {
                                    height: 25,
                                    width: 25,
                                    borderRadius: 20,
                                    slipDisplacement: 200
                                } }
                            />

                            <View style={ styles.fullRow }>
                                <Text style={ styles.sliderText }>500</Text>
                                <Text style={ styles.sliderText }>30,000</Text>
                            </View>
                            <View style={ styles.fullRow }>
                                <Text style={ styles.optionText }>Iskustvo potrebno</Text>
                                <Switch trackColor="#C8C8C8" ios_backgroundColor="#C8C8C8" thumbColor='#068CDD' value={ inputs.experience } onValueChange={ ( value ) => handleChange( 'experience', value ) } />
                            </View>

                            <View style={ styles.fullRow }>
                                <Text style={ styles.optionText }>Puno radno vrijeme</Text>
                                <Switch trackColor="#C8C8C8" ios_backgroundColor="#C8C8C8" thumbColor='#068CDD' value={ inputs.contract } onValueChange={ ( value ) => handleChange( 'contract', value ) } />
                            </View>

                            <View style={ styles.fullRow }>
                                <Text style={ styles.optionText }>Trajna pozicija</Text>
                                <Switch trackColor="#C8C8C8" ios_backgroundColor="#C8C8C8" thumbColor='#068CDD' value={ inputs.temporary } onValueChange={ ( value ) => handleChange( 'temporary', value ) } />
                            </View>

                            <View style={ styles.fullRow }>
                                <Text style={ styles.optionText }>Studentski posao</Text>
                                <Switch trackColor="#C8C8C8" ios_backgroundColor="#C8C8C8" thumbColor='#068CDD' value={ inputs.studentsAccepted } onValueChange={ ( value ) => handleChange( 'studentsAccepted', value ) } />
                            </View>
                    </View>
                </Modal>
                <Modal
                    isVisible={ categoryModalVisible }
                    onBackButtonPress={ closeCategoryModal }
                    onBackdropPress={ closeCategoryModal }
                    onSwipeComplete={ closeCategoryModal }
                    swipeDirection={ [ 'right' ] }
                    animationIn="slideInRight"
                    animationOut="slideOutRight"
                    style={ styles.categoryModal }
                    useNativeDriver={ true }
                >
                    <View style={ styles.header }>
                        <TouchableOpacity onPress={ closeCategoryModal }>
                            <IonIcon style={ styles.headerBackIcon } name="md-arrow-back" size={ 26 } color={ '#ffffff' } />
                        </TouchableOpacity>
                        <Text style={ styles.headerText }>Kategorije</Text>
                    </View>
                    <ScrollView
                        contentContainerStyle={ styles.categoryContainer }>
                        { Object.keys( jobTypes ).map( key => {
                            return <TouchableOpacity activeOpacity={ 0.7 } style={ styles.categoryItem } key={ key } onPress={ ( ) => {
                                handleChange( 'type', key );
                            } }>
                                <Text style={ inputs.type == key ? { ...styles.categoryText, color: "#068CDD" } : styles.categoryText }>{ jobTypes[ key ] }</Text>
                            </TouchableOpacity>
                        } ) }
                    </ScrollView>
                </Modal>
                <FlatList
                    contentContainerStyle={{
                        width: width,
                        flexGrow: 1
                    }}
                    data={ props.jobList }
                    keyExtractor={ item => {
                        if ( showingFavorites ) return item.SavedID;
                        return item.JobID;
                    } }
                    renderItem={ ( { item } ) => (
                        <JobCard job={ item } handlePress={ ( ) => props.navigation.navigate( 'JobScreen', { id: showingFavorites ? item.SavedJobID : item.JobID } ) } />
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
                    ListEmptyComponent={
                        !props.loadingJobs
                        && <Empty
                            image={ require( '../../../../assets/empty-jobs.png' ) }
                            title="Prazno"
                            subtitle="Nije pronađen niti jedan oglas"
                        />
                    }
                />
            </SafeAreaView>
            </>;
};

const styles = StyleSheet.create( {
    header: {
        width: width,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#068CDD',

        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: "center"
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    container: {
        width: width,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#ffffff',

        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start"
    },
    row: {
        width: width,
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginBottom: 10
    },
    sectionText: {
        color: '#0B323C',
        fontSize: 16,
        fontFamily: 'NotoSans',
        marginBottom: 5
    },
    inputContainer: {
        marginBottom: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: '#E4E4E4',
        borderRadius: 5,

        width: '100%',
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    inputIcon: {
        marginRight: 10
    },
    input: {
        flex: 1,
        color: '#0B323C',
        fontSize: 12,
        fontFamily: 'NotoSans',
    },
    slider: {
        height: 25,
        marginLeft: 10
    },
    sliderMarker: {
        height: 25,
        width: 25,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#ffffff',
        backgroundColor: '#068CDD',
        transform: [
            {
                translateY: 5
            }
        ]
    },
    fullRow: {
        width: width - 40,
        marginVertical: 5,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    sliderText: {
        color: '#0B323C',
        fontSize: 12,
        fontFamily: 'NotoSans',
    },
    optionText: {
        color: '#0B323C',
        fontSize: 16,
        fontFamily: 'NotoSans',
        marginBottom: 5
    },

    // Category modal

    categoryModal: {
        margin: 0,
        justifyContent: "center"
    },
    categoryContainer: {
        width: width,
        minHeight: height,
        paddingHorizontal: 10,
        backgroundColor: '#E4E4E4',
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start"
    },
    categoryItem: {
        width: '100%',
        backgroundColor: '#ffffff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 5,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,

        elevation: 1,
    },
    categoryText: {
        color: '#0B323C',
        fontSize: 14,
        fontFamily: 'NotoSans-Bold',
    },
    headerBackIcon: {
        marginHorizontal: 10
    },
    headerText: {
        color: '#ffffff',
        fontSize: 16,
        lineHeight: 26,
        fontFamily: 'NotoSans',
    }

} );

export default connect( mapStateToProps, mapDispatchToProps )( Jobs );