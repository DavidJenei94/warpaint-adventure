import React from 'react';

export type ChildrenProps = {
  children: React.ReactNode;
}

export type ChildrenConditionalProps = {
  children?: React.ReactNode;
}

export type ClassNameProps = {
  className: string;
}

export type ClassNameChildrenProps = {
  children: React.ReactNode;
  className?: string;
}


export type ResponseProp = {
  response: string[];
  setResponse: (response: string[]) => void;
};
