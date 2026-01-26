import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text, View } from 'react-native';

// Simple test component
const HelloWorld = () => (
  <View testID="hello-container">
    <Text>Hello, Testing!</Text>
  </View>
);

describe('Example Component Tests', () => {
  test('renders HelloWorld component correctly', () => {
    render(<HelloWorld />);
    const element = screen.getByText('Hello, Testing!');
    expect(element).toBeTruthy();
  });

  test('finds component by testID', () => {
    render(<HelloWorld />);
    const container = screen.getByTestId('hello-container');
    expect(container).toBeTruthy();
  });
});

describe('Basic JavaScript Tests', () => {
  test('simple math works', () => {
    expect(1 + 1).toBe(2);
    expect(2 * 3).toBe(6);
  });

  test('string concatenation works', () => {
    expect('Hello' + ' ' + 'World').toBe('Hello World');
  });
});
