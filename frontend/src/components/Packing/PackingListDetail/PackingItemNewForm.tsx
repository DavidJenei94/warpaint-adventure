import React, { Dispatch, SetStateAction } from 'react';
import useFetchDataEffect from '../../../hooks/fetch-data-effect-hook';
import useHttp from '../../../hooks/http-hook';
import { useAppSelector } from '../../../hooks/redux-hooks';
import useInput from '../../../hooks/use-input';
import { createPackingItem } from '../../../lib/packingitem-api';
import { PackingItem } from '../../../models/packing.models';

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
  const token = useAppSelector((state) => state.auth.token);

  const {
    value: newItemName,
    isValid: newItemIsValid,
    hasError: newItemHasError,
    changeHandler: newItemNameChangeHandler,
    blurHandler: newItemBlurHandler,
    reset: newItemReset,
  } = useInput((value) => value.trim() !== '');

  const {
    sendRequest: sendCreateItemRequest,
    status: createItemStatus,
    error: createItemError,
    data: createItemData,
  } = useHttp(createPackingItem);

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!newItemIsValid) return;

    sendCreateItemRequest({ token, listId: packingListId, name: newItemName });
  };

  useFetchDataEffect(() => {
    newItemReset();

    onAddItem((prevState) => {
      const Items = [...prevState];
      Items.unshift({
        id: createItemData.packingItemId,
        name: newItemName,
        status: 0,
      });

      return Items;
    });
  }, [createItemStatus, createItemError, createItemData]);

  return (
    <form className={styles['new-item']} onSubmit={submitFormHandler}>
      <Input
        placeholder="New item..."
        value={newItemName}
        onChange={newItemNameChangeHandler}
      />
      <Button type="submit">
        <p>Add</p>
      </Button>
    </form>
  );
};

export default PackingItemNewForm;
