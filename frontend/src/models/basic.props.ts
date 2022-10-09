import React, { Dispatch, SetStateAction } from 'react';

export interface ChildrenProps {
  children: React.ReactNode;
}

export interface ChildrenConditionalProps {
  children?: React.ReactNode;
}

export interface ClassNameProps {
  className: string;
}

export interface ClassNameChildrenProps {
  children: React.ReactNode;
  className?: string;
}

export interface ResponseProp {
  response: string[];
  setResponse: Dispatch<SetStateAction<string[]>>;
}

export interface ResponseStringProp {
  response?: string;
  setResponse?: Dispatch<SetStateAction<string>>;
}

export interface OptionList
  extends Array<{
    value: string;
    text: string;
  }> {}
