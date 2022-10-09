import { ComponentProps } from 'react';
import { ChildrenConditionalProps } from '../../../models/basic.props';

import Input from '../Input';

interface SingleInputConfirmationProps
  extends ChildrenConditionalProps,
    ComponentProps<'input'> {}

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
