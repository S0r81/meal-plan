// page.js
import React from 'react';
import QuestionnaireForm from './components/QuestionnaireForm';

export default function Home() {
  return (
    <div className="container">
      <h1>Meal Plan Questionnaire</h1>
      <QuestionnaireForm />
    </div>
  );
}