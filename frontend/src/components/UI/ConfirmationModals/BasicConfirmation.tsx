import { ChildrenProps } from "../../../models/basic.props";

const BasicConfirmation = ({children}: ChildrenProps) => {
  return (
    <>
      <p>{children}</p>
    </>
  );
};

export default BasicConfirmation;
