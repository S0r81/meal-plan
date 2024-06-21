"use client";

import React from 'react';
import { Controller } from 'react-hook-form';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
`;

const RadioInput = styled.input.attrs({ type: 'radio' })`
  accent-color: #0070f3; /* For modern browsers */
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Option = styled.option`
  padding: 8px;
`;

const Question = ({ name, label, control, type, options }) => {
  return (
    <Wrapper>
      <Label>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          if (type === 'radio') {
            return (
              <RadioGroup>
                {options.map((option) => (
                  <RadioOption key={option}>
                    <RadioInput
                      value={option}
                      checked={field.value === option}
                      onChange={() => field.onChange(option)}
                    />
                    {option}
                  </RadioOption>
                ))}
              </RadioGroup>
            );
          } else if (type === 'select') {
            return (
              <Select {...field}>
                {options.map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            );
          } else {
            return <Input {...field} type={type} />;
          }
        }}
      />
    </Wrapper>
  );
};

export default Question;
