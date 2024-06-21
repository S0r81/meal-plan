"use client";

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styled from 'styled-components';
import Result from '../components/Result';

const Container = styled.div`
  background-color: #262626; /* Semi-transparent white */
  border-radius: 10px;
  padding: 20px;
  margin: 20px auto; /* Center the card */
  max-width: 800px; /* Adjust based on your preference */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px); /* Glassy effect */
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  flex-direction: column;
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

export default function ResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  
  
  const data = {
    goal: searchParams.get('goal'),
    gender: searchParams.get('gender'),
    age: searchParams.get('age'),
    weight: searchParams.get('weight'),
    height: searchParams.get('height'),
    bodyFatKnown: searchParams.get('bodyFatKnown'),
    lifestyleActivity: searchParams.get('lifestyleActivity'),
    workoutActivity: searchParams.get('workoutActivity'),
  };

  const restartQuestionnaire = () => {
    router.push('/');
  };

  return (
    <Container>
      <h1>Meal Plan Recommendation</h1>
      <Result data={data} />
      <Button onClick={restartQuestionnaire} style={{ marginTop: '20px' }}>
        Restart
      </Button>
    </Container>
  );
}
