// page.js
import React from 'react';
import QuestionnaireForm from './components/QuestionnaireForm';

export default function Home() {
  return (
    <div className="container">
    <div className="logo"></div>
      <QuestionnaireForm />
    </div>
  );
}