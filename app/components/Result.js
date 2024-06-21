"use client";

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const Title = styled.h2`
  font-size: 24px;
`;
const Text = styled.p`
  font-size: 18px;
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

const Result = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const data = {
    goal: searchParams.get('goal'),
    gender: searchParams.get('gender'),
    age: searchParams.get('age') ? parseInt(searchParams.get('age'), 10) : undefined,
    weight: searchParams.get('weight') ? parseFloat(searchParams.get('weight')) : undefined,
    height: searchParams.get('height') ? parseFloat(searchParams.get('height')) : undefined,
    bodyFatKnown: searchParams.get('bodyFatKnown'),
    lifestyleActivity: searchParams.get('lifestyleActivity') ? parseFloat(searchParams.get('lifestyleActivity')) : undefined,
    leanBodyMass: searchParams.get('leanBodyMass') ? parseFloat(searchParams.get('leanBodyMass')) : undefined,
    fatMass: searchParams.get('fatMass') ? parseFloat(searchParams.get('fatMass')) : undefined,
  };

  const getMealPlan = () => {
    const genderMultiplier = data.gender === 'Male' ? 1 : 0;

    if (data.bodyFatKnown === 'Yes' && data.leanBodyMass !== undefined && data.fatMass !== undefined) {
      const LBM = data.leanBodyMass;
      const FM = data.fatMass;
      const age = data.age;
      
      const BMR = (13.587 * LBM) + (9.613 * FM) + (198 * genderMultiplier) - (3.351 * age) + 674;
      return Math.round(BMR);
    } else if (data.bodyFatKnown === 'No' && data.weight !== undefined && data.height !== undefined && data.age !== undefined && data.lifestyleActivity !== undefined) {
      const weight = data.weight;
      const height = data.height;
      const age = data.age;
      const lifestyleActivity = data.lifestyleActivity;

      if (data.gender === 'Male') {
        return Math.round((88.362 + (13.397 * weight) + (4.799 * height) - (5.667 * age)) * lifestyleActivity);
      } else {
        return Math.round((447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)) * lifestyleActivity);
      }
    } else {
      return 'Insufficient data to calculate BMR';
    }
  };

  const restartQuestionnaire = () => {
    router.push('/');
  };

  return (
    <Wrapper>
      <Title>Based on your answers, we recommend:</Title>
      <Text>Your BMR is: {getMealPlan()}</Text>
    </Wrapper>
  );
};

export default Result;
