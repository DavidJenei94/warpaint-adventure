import { ResponseProp } from '../../../models/basic.props';

import Input from '../Input';

const SingleInputConfirmation = ({ response, setResponse }: ResponseProp) => {
  return (
    <>
      <p>Please give a value:</p>
      <Input
        value={response[0]}
        onChange={(event) => setResponse([event.target.value])}
      />
    </>
  );
};

export default SingleInputConfirmation;
