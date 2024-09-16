import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Pressable, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserContext from '../contexts/UserContext';
import clsx from 'clsx';
import { X, Check } from 'lucide-react-native';


export default function KouizAnswer({ route }) {
    const { id } = route.params;
    const [quiz, setQuiz] = useState(null);
    const { setUser, user } = React.useContext(UserContext);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [answerResults, setAnswerResults] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                setUser(user);

                const response = await axios.get(`https://api.kouiz.fr/api/kouiz/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.data.success) {
                    setQuiz(response.data.data);
                } else {
                    console.error(response.data.errorsList);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [id]);

    function optionColorClass(questionId, optionId) {
        const isAnswered = !!answerResults[questionId];
        const isCorrectAnswer = optionId === answerResults[questionId]?.correctAnswer;
        const isUserAnswer = optionId === selectedAnswers[questionId];
        const isUserAnswerCorrect = isUserAnswer && isCorrectAnswer;
        const isUserAnswerIncorrect = isUserAnswer && !isCorrectAnswer;

        if (isAnswered) {
            if (isUserAnswerCorrect || isCorrectAnswer) {
                return 'bg-[#e1eddb] dark:bg-[#6aa84f]';
            } else if (isUserAnswerIncorrect) {
                return 'bg-[#F2BFBF] dark:bg-[#C60000]';
            }
        } else if (isUserAnswer) {
            return 'bg-pBrown text-pWhite border-0';
        }
        return 'bg-pWhite dark:bg-pBlue';
    }

    const handleAnswerSelect = (questionId, optionId) => {
        setSelectedAnswers(prevState => {
            const newState = { ...prevState };
            if (prevState[questionId] === optionId) {
                delete newState[questionId];
            } else {
                newState[questionId] = optionId;
            }
            return newState;
        });
    };

    useEffect(() => {
        console.log('Selected answers:', selectedAnswers);
    }, [selectedAnswers]);

    const handleSubmitAnswers = async () => {
        let score = 0;
        const newAnswerResults = {};

        quiz.questions.forEach(question => {
            const userAnswer = selectedAnswers[question.id];
            const correctOption = question.options.find(option => option.is_correct);

            if (correctOption) {
                if (userAnswer === correctOption.id) {
                    score += 1;
                    newAnswerResults[question.id] = { correct: true, userAnswer, correctAnswer: correctOption.id };
                } else {
                    newAnswerResults[question.id] = { correct: false, userAnswer, correctAnswer: correctOption.id };
                }
            }
        });

        setAnswerResults(newAnswerResults);
        console.log(`Score final: ${score}/${quiz.questions.length}`);
        setIsSubmitted(true);
    };

    const allQuestionsAnswered = quiz && quiz.questions.every(question => selectedAnswers[question.id] !== undefined && selectedAnswers[question.id] !== null);

    const handleSubmit = () => {
        if (!allQuestionsAnswered) {
            Alert.alert('Veuillez répondre à toutes les questions avant de soumettre vos réponses.');
            return;
        }
        handleSubmitAnswers();
    };

    const handleResultSending = () => {
        Alert.alert('L\'enregistrement de réponses n\'est pas encore disponible.');
    };

    return (
        <>
            {quiz ? (
                <ScrollView contentContainerStyle={styles.container}>
                    <View className="flex flex-col justify-start items-start dark:bg-sBlue pt-16 p-6 pb-80">
                        <View className="mt-8">
                            <Text className="text-4xl">{quiz.emoji}</Text>
                            <Text className="text-xl text-pBrown my-4" style={styles.title_bold}>{quiz.title}</Text>
                            <Text className="dark:text-pWhite mb-8" style={styles.body_medium}>{quiz.description}</Text>
                        </View>

                        {!answerResults && (
                            <View className="w-full my-4">
                                <Text className="text-pBrown text-lg" style={styles.title}>Instructions</Text>
                                <Text className="dark:text-pWhite" style={styles.body}>Sélectionnez une réponse pour chaque question, puis appuyez sur le bouton "Soumettre les réponses" pour voir les résultats.</Text>
                            </View>
                        )}

                        <View className="w-full">
                            {quiz.questions.map((question, index) => (
                                <View key={question.id} className="mb-12 w-full">
                                    <Text style={styles.title} className="text-pBrown mb-2 text-lg">{index + 1}. {question.text}</Text>
                                    {question.options.map(option => (
                                        <Pressable
                                            key={option.id}
                                            onPress={() => {
                                                if (!answerResults[question.id]) {
                                                    handleAnswerSelect(question.id, option.id);
                                                }
                                            }}
                                            className={clsx(
                                                "rounded-lg p-6 my-2 border border-[#c2c2c2] dark:border-0 w-full",
                                                optionColorClass(question.id, option.id)
                                            )}
                                        >
                                            <View style={styles.body_medium} className="dark:text-pWhite flex flex-row justify-between items-center">
                                                <Text className="dark:text-pWhite">{option.text}</Text>
                                                {answerResults[question.id] && option.id === answerResults[question.id].correctAnswer ? (
                                                    <Check className="text-[#6aa84f]" />
                                                ) : (
                                                    answerResults[question.id] && option.id === selectedAnswers[question.id] ? (
                                                        <X className="text-[#CC0000]" />
                                                    ) : null
                                                )}
                                            </View>
                                        </Pressable>
                                    ))}
                                </View>
                            ))}
                        </View>

                        {!isSubmitted ? (
                            <View className="flex flex-row justify-end w-full">
                                <Pressable
                                    className={`bg-pBrown my-4 p-3 rounded-lg ${!allQuestionsAnswered ? "bg-opacity-50" : ""}`}
                                    onPress={handleSubmit}
                                >
                                    <Text className="text-pWhite" style={styles.title_bold}>
                                        Soumettre les réponses
                                    </Text>
                                </Pressable>
                            </View>
                        ) : (
                            <View className="w-full">
                                <Text className="text-pBrown text-lg" style={styles.title_bold}>Résultats</Text>
                                <View className="flex flex-col justify-between items-center w-full gap-4 my-8">
                                    <Text className="text-3xl text-pBrown" style={styles.title_bold}>
                                        {Object.values(answerResults).filter(result => result.correct).length} / {quiz.questions.length}
                                    </Text>
                                    <Text className="text-lg dark:text-pWhite" style={styles.body_bold}>
                                        {(Object.values(answerResults).filter(result => result.correct).length * 100) / quiz.questions.length} %
                                    </Text>
                                </View>
                                <Pressable className="bg-pBrown h-11 px-8 flex flex-row justify-center items-center rounded-lg">
                                    <Text style={styles.title_bold} className="text-pWhite" onPress={handleResultSending}>
                                        Enregister vos résultats
                                    </Text>
                                </Pressable>
                            </View>
                        )}
                    </View>
                </ScrollView>
            ) : (
                <ScrollView contentContainerStyle={styles.container}>
                    <View className="flex justify-center items-center w-full h-screen pb-32 dark:bg-sBlue">
                        <ActivityIndicator size="large" color="#9D775D" />
                    </View>
                </ScrollView>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexGrow: 1,
    },
    title_bold: {
        fontFamily: 'Unbounded_700Bold',
    },
    title_medium: {
        fontFamily: 'Unbounded_500Medium',
    },
    title: {
        fontFamily: 'Unbounded_400Regular',
    },
    body_bold: {
        fontFamily: 'Manrope_700Bold',
    },
    body_medium: {
        fontFamily: 'Manrope_500Medium',
    },
    body: {
        fontFamily: 'Manrope_400Regular',
    },
});
