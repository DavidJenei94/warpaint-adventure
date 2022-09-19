import { ComponentProps } from 'react';
import {
  ChildrenConditionalProps,
  ResponseStringProp,
} from '../../../models/basic.props';

import Input from '../Input';

type SingleInputConfirmationProps = ChildrenConditionalProps &
  ComponentProps<'input'>;

const SingleInputConfirmation = ({
  children,
  ...otherProps
}: SingleInputConfirmationProps) => {
  return (
    <>
      <p>{children}</p>
      <Input {...otherProps} />
    </>
  );
};

export default SingleInputConfirmation;
