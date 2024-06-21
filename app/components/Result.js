"use client";

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styled from 'styled-components';

const Wrapper = styled.div`
  background-color: #262626; /* Semi-transparent white */
  border-radius: 10px;
  padding: 20px;
  margin: 20px auto; /* Center the card */
  max-width: 800px; /* Adjust based on your preference */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px); /* Glassy effect */
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  flex-direction: column;
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

  const heightString = searchParams.get('height');
  const heightParts = heightString ? heightString.split("'") : [];
  const heightInInches = heightParts.length === 2 ? parseInt(heightParts[0], 10) * 12 + parseInt(heightParts[1], 10) : undefined;
  const heightInCm = heightInInches ? heightInInches * 2.54 : undefined;

  const data = {
    goal: searchParams.get('goal'),
    gender: searchParams.get('gender'),
    age: searchParams.get('age') ? parseInt(searchParams.get('age'), 10) : undefined,
    weight: searchParams.get('weight') ? parseFloat(searchParams.get('weight')) * 0.453592 : undefined,
    height: heightInCm,
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
      
      const BMR = (13.587 * LBM) + (9.613 * FM) + (198 * genderMultiplier) - (3.351 * age) + 674; //This is TDEE for body fat known
      if (data.goal === 'Gain Weight') {
        const adjustedBMR = BMR * 1.1; // Add 10% to TDEE for weight gain goal
      
        if (adjustedBMR >= 0 && adjustedBMR <= 1600) {
          return 'Recommend a small meal plan: '+ Math.round(adjustedBMR) + " Here is a link for our product pages: https://www.vagaro.com/cocoonwellnessandrecovery/products";
        } else if (adjustedBMR >= 1601 && adjustedBMR <= 2900) {
          return 'Recommend a medium meal plan: '+ Math.round(adjustedBMR) + "\n Here is a link for our product pages: https://www.vagaro.com/cocoonwellnessandrecovery/products";
        } else if (adjustedBMR >= 2901) {
          return 'Recommend a large meal plan: '+ Math.round(adjustedBMR) + " Here is a link for our product pages: https://www.vagaro.com/cocoonwellnessandrecovery/products";
        }
      }
        if (data.goal === 'Lose Weight') {
          const adjustedBMR = BMR * 0.8; // Subtract 20% from TDEE for weight loss goal
        
          if (adjustedBMR >= 0 && adjustedBMR <= 1600) {
            return 'Recommend a small meal plan: '+ Math.round(adjustedBMR) + "\n Here is a link for our product pages: https://www.vagaro.com/cocoonwellnessandrecovery/products";
          } else if (adjustedBMR >= 1601 && adjustedBMR <= 2900) {
            return 'Recommend a medium meal plan: ' + Math.round(adjustedBMR) + "\n Here is a link for our product pages: https://www.vagaro.com/cocoonwellnessandrecovery/products";
          } else if (adjustedBMR >= 2901) {
            return 'Recommend a large meal plan: '+ Math.round(adjustedBMR) + "\n Here is a link for our product pages: https://www.vagaro.com/cocoonwellnessandrecovery/products";
          }
        }
        if (data.goal === 'Maintain') {
          if (BMR >= 0 && BMR <= 1600) {
            return 'Recommend a small meal plan: '+ Math.round(BMR) + "/n Here is a link for our product pages: https://www.vagaro.com/cocoonwellnessandrecovery/products";
          } else if (BMR >= 1601 && BMR <= 2900) {
            return 'Recommend a medium meal plan: '+ Math.round(BMR) + "/n Here is a link for our product pages: https://www.vagaro.com/cocoonwellnessandrecovery/products";
          } else if (BMR >= 2901) {
            return 'Recommend a large meal plan: '+ Math.round(BMR)+ "/n Here is a link for our product pages: https://www.vagaro.com/cocoonwellnessandrecovery/products";
          }
        }
    } else if (data.bodyFatKnown === 'No' && data.weight !== undefined && data.height !== undefined && data.age !== undefined && data.lifestyleActivity !== undefined) {
      const weight = data.weight;
      const height = data.height;
      const age = data.age;
      const lifestyleActivity = data.lifestyleActivity;
      let BMR;
    
      if (data.gender === 'Male') {
        BMR = Math.round((88.362 + (13.397 * weight) + (4.799 * height) - (5.667 * age)) * lifestyleActivity);
      } else {
        BMR = Math.round((447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)) * lifestyleActivity);
      }
    
      // Adjust BMR based on goal
      let adjustedBMR = BMR;
      if (data.goal === 'Gain Weight') {
        adjustedBMR *= 1.1;
      } else if (data.goal === 'Lose Weight') {
        adjustedBMR *= 0.8;
      } else if (data.goal === 'Maintain') {
        adjustedBMR *= 1;
      }
    
      // Recommend meal plan based on adjusted BMR
      if (adjustedBMR <= 1600) {
        return 'Recommend a small meal plan: ' + Math.round(adjustedBMR);
      } else if (adjustedBMR > 1600 && adjustedBMR <= 2900) {
        return 'Recommend a medium meal plan: ' + Math.round(adjustedBMR);
      } else {
        return 'Recommend a large meal plan: ' + Math.round(adjustedBMR) + "Here is a link for our product pages: https://www.vagaro.com/cocoonwellnessandrecovery/products";
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
      <Text>{getMealPlan()}</Text>
    </Wrapper>
  );
};

export default Result;
