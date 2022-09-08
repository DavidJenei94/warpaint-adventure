import React, { Dispatch, SetStateAction } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hooks';
import useInput from '../../../hooks/use-input';
import { PackingItem } from '../../../models/packing.models';
import { Status, toggleFeedback } from '../../../store/feedback';
import { errorHandlingFetch } from '../../../utils/errorHanling';

import Button from '../../UI/Button';
import Input from '../../UI/Input';

import styles from './PackingItemNewForm.module.scss';

type NewPackingItemProps = {
  packingListId: number;
  onAddItem: Dispatch<SetStateAction<PackingItem[]>>;
};

const PackingItemNewForm = ({
  packingListId,
  onAddItem,
}: NewPackingItemProps) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  const {
    value: newItemName,
    isValid: newItemIsValid,
    hasError: newItemHasError,
    changeHandler: newItemNameChangeHandler,
    blurHandler: newItemBlurHandler,
    reset: newItemReset,
  } = useInput((value) => value.trim() !== '');

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:4000/api/packinglist/${packingListId}/packingitem/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
          body: JSON.stringify({ name: newItemName }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      newItemReset();

      dispatch(
        toggleFeedback({
          status: Status.SUCCESS,
          message: data.message,
        })
      );

      onAddItem((prevState) => [
        ...prevState,
        { id: data.packingItemId, name: newItemName, status: 0 },
      ]);
    } catch (err: any) {
      errorHandlingFetch(err);
    }
  };

  return (
    <form className={styles['new-item']} onSubmit={submitFormHandler}>
      <Input
        placeholder="New item..."
        value={newItemName}
        onChange={newItemNameChangeHandler}
      />
      <Button type="submit"><p>Add</p></Button>
    </form>
  );
};

export default PackingItemNewForm;
