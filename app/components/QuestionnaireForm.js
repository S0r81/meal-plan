"use client";

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Question from './Question';
import { useRouter } from 'next/navigation';

const schema = yup.object().shape({
  goal: yup.string().required('Goal is required'),
  gender: yup.string().required('Gender is required'),
  age: yup.number().required('Age is required').positive().integer(),
  weight: yup.number().required('Weight is required').positive(),
  height: yup.number().required('Height is required').positive(),
  bodyFatKnown: yup.string().required('Body fat knowledge is required'),
  lifestyleActivity: yup.string().required('Lifestyle activity is required'),
  leanBodyMass: yup.number().when('bodyFatKnown', {
    is: 'Yes',
    then: yup.number().required('Lean Body Mass is required').positive(),
  }),
  fatMass: yup.number().when('bodyFatKnown', {
    is: 'Yes',
    then: yup.number().required('Fat Mass is required').positive(),
  }),
});

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;

const Button = styled.button`
  background-color: #0070f3;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
  &:hover {
    background-color: #005bb5;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const questions = [
  { name: 'goal', label: 'What is your goal?', type: 'radio', options: ['Gain Weight', 'Lose Weight', 'Maintain'] },
  { name: 'gender', label: 'What is your gender?', type: 'radio', options: ['Male', 'Female'] },
  { name: 'age', label: 'What is your age?', type: 'number' },
  { name: 'weight', label: 'What is your weight (kg)?', type: 'number' },
  { name: 'height', label: 'What is your height (cm)?', type: 'number' },
  { name: 'bodyFatKnown', label: 'Do you know your body fat percentage?', type: 'radio', options: ['Yes', 'No'] },
  {
    name: 'lifestyleActivity', label: 'What is your lifestyle activity level?', type: 'radio', options: [
      'Sedentary: You work a desk job and don’t exercise',
      'Light Activity: You work a desk job but do a bit of regular exercise. Or you don’t exercise but you work at a job that’s pretty active (a nurse, teacher, etc.) where you’re on your feet most of the day.',
      'Moderate Activity: Most of you will probably fall into this category. Maybe you work a sedentary job, but you train like a madman. Or maybe you train moderately, but you also have a job where you stand on your feet all the time. Someone who doesn’t train but works a hard labor job would also fall into this category.',
      'Very Active: You train hard most days of the week, and you also work a job where you’re on your feet quite a bit. Overall, you’re active most of the day.',
      'Extra Active: You train hard and work a job that is physically intense in nature. As an example, you’re a roofer who also goes to the gym five days a week.',
    ]
  },
  { name: 'leanBodyMass', label: 'What is your Lean Body Mass (kg)?', type: 'number', conditional: 'bodyFatKnown', conditionValue: 'Yes' },
  { name: 'fatMass', label: 'What is your Fat Mass (kg)?', type: 'number', conditional: 'bodyFatKnown', conditionValue: 'Yes' },
];
const activityFactorMapping = {
  'Sedentary: You work a desk job and don’t exercise': 1.2,
  'Light Activity: You work a desk job but do a bit of regular exercise. Or you don’t exercise but you work at a job that’s pretty active (a nurse, teacher, etc.) where you’re on your feet most of the day.': 1.375,
  'Moderate Activity: Most of you will probably fall into this category. Maybe you work a sedentary job, but you train like a madman. Or maybe you train moderately, but you also have a job where you stand on your feet all the time. Someone who doesn’t train but works a hard labor job would also fall into this category.': 1.55,
  'Very Active: You train hard most days of the week, and you also work a job where you’re on your feet quite a bit. Overall, you’re active most of the day.': 1.725,
  'Extra Active: You train hard and work a job that is physically intense in nature. As an example, you’re a roofer who also goes to the gym five days a week.': 1.9,
};

const QuestionnaireForm = () => {
  const { control, handleSubmit, reset, watch } = useForm({
    resolver: yupResolver(schema)
  });
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const onSubmit = (data) => {
    data.lifestyleActivity = activityFactorMapping[data.lifestyleActivity];
    router.push(`/result?${new URLSearchParams(data).toString()}`);
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, filteredQuestions.length - 1));
  };

  const previousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const restartQuestionnaire = () => {
    reset();
    setCurrentQuestionIndex(0);
  };

  const bodyFatKnown = watch('bodyFatKnown');

  const filteredQuestions = bodyFatKnown === 'Yes'
    ? questions
    : questions.filter(q => !q.conditional || q.conditionValue !== 'Yes');

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="container">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Question
            name={filteredQuestions[currentQuestionIndex].name}
            label={filteredQuestions[currentQuestionIndex].label}
            control={control}
            type={filteredQuestions[currentQuestionIndex].type}
            options={filteredQuestions[currentQuestionIndex].options}
          />
        </motion.div>
      </AnimatePresence>
      <NavigationButtons>
        {currentQuestionIndex > 0 && <Button type="button" onClick={previousQuestion}>Previous</Button>}
        {currentQuestionIndex < filteredQuestions.length - 1 ? (
          <Button type="button" onClick={nextQuestion}>Next</Button>
        ) : (
          <Button type="submit">Submit</Button>
        )}
      </NavigationButtons>
      {currentQuestionIndex > 0 && (
        <Button type="button" onClick={restartQuestionnaire} style={{ marginTop: '20px' }}>
          Restart
        </Button>
      )}
    </Form>
  );
};

export default QuestionnaireForm;
