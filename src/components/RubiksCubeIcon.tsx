import React from 'react';

export const RubiksCubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 10 L90 30 L50 50 L10 30 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1"/>
    <path d="M36.67 16.67 L76.67 36.67 M23.33 23.33 L63.33 43.33" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M63.33 16.67 L23.33 36.67 M76.67 23.33 L36.67 43.33" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M10 30 L50 50 L50 90 L10 70 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="currentColor" fillOpacity="0.05"/>
    <path d="M10 43.33 L50 63.33 M10 56.67 L50 76.67" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M23.33 36.67 L23.33 76.67 M36.67 43.33 L36.67 83.33" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M50 50 L90 30 L90 70 L50 90 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15"/>
    <path d="M90 43.33 L50 63.33 M90 56.67 L50 76.67" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M76.67 36.67 L76.67 76.67 M63.33 43.33 L63.33 83.33" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);
