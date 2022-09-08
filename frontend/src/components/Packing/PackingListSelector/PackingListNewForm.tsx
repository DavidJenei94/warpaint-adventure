import { ResponseProp } from '../../../models/basic.props';

import Input from '../../UI/Input';
import Select from '../../UI/Select';

const PackingListNewForm = ({ response, setResponse }: ResponseProp) => {
  return (
    <>
      <p>New Packing list:</p>
      <Input
        placeholder="Name..."
        value={response[0]}
        onChange={(event) => setResponse([event.target.value])}
        autoFocus
      />
      <p>You can copy an existing list or create an empty one.</p>
      <Select
        optionList={[
          { value: '0', text: 'empty' },
          // { value: '1', text: 'random one to implement later' },
        ]}
      ></Select>
    </>
  );
};

export default PackingListNewForm;
