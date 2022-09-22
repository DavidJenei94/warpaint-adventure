import { Dispatch, SetStateAction, useState } from 'react';

import Button from '../Button';
import Input from '../Input';

import styles from './EditDeleteText.module.scss';
import editIcon from '../../../assets/icons/icons-edit-16.png';
import deleteIcon from '../../../assets/icons/icons-trash-16.png';

type EditDeleteTextProps = {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  toggleDeleteModal: Dispatch<SetStateAction<boolean>>;
  onConfirmChange: () => void;
  className?: string;
};

const EditDeleteText = ({
  text,
  setText,
  toggleDeleteModal,
  onConfirmChange,
  className = '',
}: EditDeleteTextProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const editTextHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const editButtonHandler = () => {
    setIsEditMode((prevState) => !prevState);
  };

  const deleteButtonHandler = () => {
    toggleDeleteModal(true);
  };

  const editTextBlurHandler = async () => {
    setIsEditMode(false);

    onConfirmChange();
  };

  const editTextKeyHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') editTextBlurHandler();
  };

  return (
    <div className={className ? className : styles['base-container']}>
      {isEditMode && (
        <Input
          value={text}
          onChange={editTextHandler}
          onBlur={editTextBlurHandler}
          onKeyDown={editTextKeyHandler}
          autoFocus
        />
      )}
      {!isEditMode && <p>{text}</p>}
      <Button onClick={editButtonHandler}>
        <img src={editIcon} />
      </Button>
      <Button onClick={deleteButtonHandler}>
        <img src={deleteIcon} />
      </Button>
    </div>
  );
};

export default EditDeleteText;
