/*
*
*    Prikazuje stranicu za ispunjavanje upitnika prilikom prijave na oglas
*
*/

import Icon from '@expo/vector-icons/MaterialIcons';
import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { getQuiz, submitQuizAnswers } from '../../../../actions/job';
import { createLoadingSelector, createSuccessMessageSelector, createErrorMessageSelector } from '../../../../actions/selector';

const { width } = Dimensions.get( 'window' ); // Get the window dimensions

const quizLoading = createLoadingSelector( [ 'SUBMIT_QUIZ' ] );
const quizSuccess = createSuccessMessageSelector( [ 'SUBMIT_QUIZ' ] );
const quizError = createErrorMessageSelector( [ 'SUBMIT_QUIZ' ] );

const mapStateToProps = ( state ) => {
    return {
        token: state.user.token,
        quiz: state.job.quiz,
        quizID: state.job.quizID,
        submitting: quizLoading( state ),
        submitted: quizSuccess( state ),
        quizError: quizError( state )
    }
}

const mapDispatchToProps = {
    getQuiz,
    submitQuizAnswers
}

const QuizScreen =  React.memo( ( props ) => {

    const [ questionIndex, setQuestionIndex ] = useState( 0 );
    const [ questionAnswers, setQuestionAnswers ] = useState( [ ] );
    const [ timer, setTimer ] = useState( 0 );
    
    const animation = useRef( );
    const interval = useRef( );

    useEffect( ( ) => {
        props.getQuiz( props.route.params.jobID, props.token );
    }, [ ] )

    useEffect( ( ) => {
        if ( !props.quiz ) return;
        const new_array = new Array( props.quiz.length ).fill( null );
        setQuestionAnswers( new_array );
    }, [ props.quiz ] )

    useEffect( ( ) => {
        if ( !props.quiz ) return;
        if ( !props.quiz[ questionIndex ].timeLimit ) return;
        setTimer( props.quiz[ questionIndex ].timeLimit );
        interval.current = setInterval(
            ( ) => setTimer( prev_timer => prev_timer - 1 ), 1000 );
    }, [ props.quiz, questionIndex ] );

    useEffect( ( ) => {
        if ( timer == 0 && interval.current != null ) {
            nextQuestion( true );
            clearInterval( interval.current );
        }
    }, [ timer ] );

    const handleCheckbox = ( answer_id ) => {
        let new_question_answers = [ ...questionAnswers ];
        
        let new_answers;
        
        if ( !new_question_answers[ questionIndex ] ) {
            new_answers = [ ];
        } else {
            new_answers = [ ...new_question_answers[ questionIndex ] ];
        }

        if ( new_answers.includes( answer_id ) ) {
            new_answers = new_answers.filter( i => i !== answer_id );
        } else {
            new_answers.push( answer_id );
        }

        new_question_answers[ questionIndex ] = new_answers;
        setQuestionAnswers( new_question_answers );

    }

    const handleRadio = ( answer_id ) => {
        let new_question_answers = [ ...questionAnswers ];
        new_question_answers[ questionIndex ] = answer_id;

        setQuestionAnswers( new_question_answers );
    }

    const handleInput = ( value ) => {
        let new_question_answers = [ ...questionAnswers ];
        new_question_answers[ questionIndex ] = value;

        setQuestionAnswers( new_question_answers );
    }

    const nextQuestion = ( force = false ) => {

        if ( !force ) {
            if ( ( props.quiz[ questionIndex ].type == 0 || props.quiz[ questionIndex ].type == 2 ) && !questionAnswers[ questionIndex ] ) return;
            if ( props.quiz[ questionIndex ].type == 1 && ( !questionAnswers[ questionIndex ] || questionAnswers[ questionIndex ].length < 2 ) ) return;
        }
        
        if ( questionIndex !== ( props.quiz.length - 1 ) ) {
            clearInterval( interval.current );
            setQuestionIndex( prev_i => prev_i + 1 );
            return;
        }

        // Otherwise submit
        props.submitQuizAnswers( questionAnswers, props.quizID, props.token )
    }

    useEffect( ( ) => {
        
        if ( props.submitted ) {        
            animation.current.play( );
        }

    }, [ props.submitted ] );

    const goBackHome = ( ) => {
        // Clear the timer if it is still on
        if ( interval.current ) clearInterval( interval.current );
        props.navigation.reset( {
            index: 0,
            routes: [ { name: 'Home', params: { quizSuccess: props.submitted } } ],
        } );
    }

    return <>
            <StatusBar barStyle="dark-content" />
            <View style={ { flex: 1, alignItems: "center", justifyContent: "center" }  }>
                { ( ( ) => {
                    if ( props.submitted ) {
                        return <View style={ styles.quizEndContainer }>
                            <LottieView
                                ref={a => {
                                    animation.current = a;
                                }}
                                loop={ false }
                                style={{
                                    width: ( width / 3 ) * 2,
                                    height: ( width / 3 ) * 2
                                }}
                                source={require('../../../../../assets/check.json')}
                            />
                            <Text style={ styles.quizEndText }>Završili ste s upitnikom!</Text>
                            <TouchableOpacity onPress={ goBackHome } style={ styles.continueButton }>
                                <Text style={ styles.continueText }>Povratak</Text>
                            </TouchableOpacity>
                        </View>
                    }

                    if ( props.quizError ) {
                        return <View style={ styles.quizEndContainer }>
                            <LottieView
                                ref={a => {
                                    animation.current = a;
                                }}
                                loop={ false }
                                style={{
                                    width: ( width / 3 ) * 2,
                                    height: ( width / 3 ) * 2
                                }}
                                source={require('../../../../../assets/error.json')}
                            />
                            <Text style={ { ...styles.quizEndText, fontSize: 18 } }>Došlo je do pogreške prilikom ispune kviza</Text>
                            <Text style={ { ...styles.quizEndText, fontSize: 18 } }>Bez brige, poslodavac će biti obaviješten da je došlo do problema!</Text>
                            <TouchableOpacity onPress={ goBackHome } style={ styles.continueButton }>
                                <Text style={ styles.continueText }>Povratak</Text>
                            </TouchableOpacity>
                        </View>
                    }

                    return ( props.quiz ? <ScrollView contentContainerStyle={ styles.container }>
                        <Text style={ styles.title }>{ props.route.params.title }</Text>
                        <Text style={ styles.companyName }>{ props.route.params.companyName.toUpperCase( ) }</Text>
                        <View style={ styles.timerRow }>
                            <Icon name={ 'timer' } size={ 40 } color={ '#068CDD' } />
                            <Text style={ styles.timerText }>{ props.quiz[ questionIndex ].type == 2 ? '--:--' : ( ( '0' + Math.floor( timer / 60 ) ).slice( -2 ) + ':' + ( '0' + ( timer % 60 ) ).slice( -2 ) ) }</Text>
                        </View>
                        <View style={ styles.question }>
                            <Text style={ styles.questionNumber }>Pitanje { ( questionIndex + 1 ) + '/' + props.quiz.length }</Text>
                            <Text style={ styles.questionText }>{ props.quiz[ questionIndex ].text }</Text>
                            { props.quiz[ questionIndex ].type == 0 && props.quiz[ questionIndex ].answers.map( ( answer, i ) => {
                                return <TouchableOpacity key={ i } onPress={ ( ) => handleRadio( answer.id ) } style={ styles.answer }>
                                    <View style={ questionAnswers[ questionIndex ] == answer.id ? { ...styles.radio, backgroundColor: '#00D6A1' } : styles.radio }></View>
                                    <Text style={ styles.answerText }>{ answer.value }</Text>
                                </TouchableOpacity>
                            } ) }
                            { props.quiz[ questionIndex ].type == 1 && props.quiz[ questionIndex ].answers.map( ( answer, i ) => {
                                
                                let answers = questionAnswers[ questionIndex ] ? [ ...questionAnswers[ questionIndex ] ] : [ ];
                                
                                return <TouchableOpacity key={ i } onPress={ ( ) => handleCheckbox( answer.id ) } style={ styles.answer }>
                                    <View style={ answers.includes( answer.id ) ? { ...styles.checkbox, backgroundColor: '#00D6A1' } : styles.checkbox }></View>
                                    <Text style={ styles.answerText }>{ answer.value }</Text>
                                </TouchableOpacity> 
                            } ) }
    
                            { props.quiz[ questionIndex ].type == 2 && <View style={ styles.inputContainer }>
                                    <Text style={ styles.inputText }>Odgovor</Text>
                                    <TextInput style={ styles.input } multiline={ true } numberOfLines={ 3 } value={ questionAnswers[ questionIndex ] || "" } onChangeText={ handleInput } />
                                </View> }
                            <TouchableOpacity onPress={ ( ) => nextQuestion( ) } style={ styles.continueButton }>
                                { !props.submitting ? 
                                    <Text style={ styles.continueText }>{ questionIndex == ( props.quiz.length - 1 ) ? 'Završi' : 'Dalje' }</Text>
                                : <ActivityIndicator size="large" color='#ffffff' /> }
                            </TouchableOpacity>
                        </View>
                        <Text style={ styles.footerText }>Nemojte izlaziti iz aplikacije za vrijeme kviza. Izlazak iz aplikacije označiti će kviz kao nedovršen.</Text>
                    </ScrollView> : <ActivityIndicator size="large" color='#068CDD' /> )

                } )( ) }
            </View>
        </>;
} );

const styles = StyleSheet.create( {
    container: {
        paddingVertical: 20,
        paddingHorizontal: 20
    },
    title: {
        width: '100%',
        color: '#0B323C',
        fontSize: 22,
        fontFamily: 'NotoSans-Bold',
        marginTop: 5,
        textAlign: "center"
    },
    companyName: {
        width: '100%',
        color: '#808080',
        fontSize: 15,
        fontFamily: 'NotoSans-Bold',
        textAlign: "center"
    },
    timerRow: {
        width: '100%',
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20
    },
    timerText: {
        marginLeft: 5,
        color: '#0B323C',
        fontSize: 20,
        fontFamily: 'NotoSans-Bold',
    },
    question: {
        width: width - 40,
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderRadius: 10,
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
    questionNumber: {
        color: '#0B323C',
        fontSize: 20,
        fontFamily: 'NotoSans',
        marginVertical: 5,
        textAlign: "center"
    },
    questionText: {
        color: '#0B323C',
        fontSize: 18,
        fontFamily: 'NotoSans',
        marginVertical: 5,
        textAlign: "center",
        marginBottom: 20
    },
    answer: {
        width: width - 80,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.23,
        shadowRadius: 4,
        elevation: 5,

        paddingVertical: 10,
        paddingHorizontal: 15,
        marginVertical: 5,

        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    radio: {
        width: 25,
        height: 25,
        borderRadius: 25,
        backgroundColor: '#C8C8C8'
    },
    checkbox: {
        width: 25,
        height: 25,
        borderRadius: 4,
        backgroundColor: '#C8C8C8'
    },
    answerText: {
        color: '#0B323C',
        fontSize: 18,
        fontFamily: 'NotoSans',
        marginLeft: 5,
    },
    continueButton: {
        width: width - 80,
        paddingVertical: 5,
        borderRadius: 5,
        backgroundColor: '#068CDD',
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.23,
        shadowRadius: 4,
        elevation: 5,

        paddingVertical: 10,
        marginTop: 20
    },
    continueText: {
        color: '#ffffff',
        fontSize: 20,
        fontFamily: 'NotoSans'
    },
    footerText: {
        paddingHorizontal: 20,
        textAlign: "center",
        marginTop: 20,
        color: '#808080',
        fontSize: 16,
        fontFamily: 'NotoSans',
    },
    inputContainer: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#E4E4E4',
        marginTop: 10,
        marginBottom: 5
    },
    inputText: {
        color: '#808080',
        fontSize: 16,
        fontFamily: 'NotoSans',
        alignSelf: "flex-start"
    },
    input: {
        color: '#0B323C',
        fontSize: 18,
        fontWeight: "normal",
    },
    quizEndContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    quizEndText: {
        width: width - 80,
        marginTop: 20,
        color: '#0B323C',
        fontSize: 20,
        fontFamily: 'NotoSans',
        textAlign: "center"
    },
} );

export default connect( mapStateToProps, mapDispatchToProps )( QuizScreen );