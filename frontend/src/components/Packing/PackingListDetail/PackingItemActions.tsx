import React, { Dispatch, SetStateAction, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hooks';
import { PackingItem } from '../../../models/packing.models';
import { Status, toggleFeedback } from '../../../store/feedback';
import { errorHandlingFetch } from '../../../utils/errorHanling';
import { arraysEqual } from '../../../utils/general.utils';
import CheckBox from '../../UI/CheckBox';

type PackingItemActionsProps = {
  packingListId: number;
  packingItem: PackingItem;
  onEditItems: Dispatch<SetStateAction<PackingItem[]>>;
};

const getCheckedValuesFromStatus = (status: number) => {
  switch (status) {
    case 0:
      return [false, true, false];
    case 1:
      return [true, false, false];
    case -1:
      return [false, false, true];
    default:
      return [false, true, false];
  }
};

const PackingItemActions = ({
  packingListId,
  packingItem,
  onEditItems
}: PackingItemActionsProps) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  const [actionValues, setActionValues] = useState(getCheckedValuesFromStatus(packingItem.status));

  const fetchUpdateItem = async (
    status: number,
    currentActionValues: boolean[]
  ) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/packinglist/${packingListId}/packingitem/${packingItem.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
          body: JSON.stringify({
            name: packingItem.name,
            status: status,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      setActionValues(currentActionValues);
      onEditItems((prevState) => {
        return prevState.map((item) => {
          if (item.id === packingItem.id) {
            return { id: packingItem.id, name: packingItem.name, status };
          }
          return item;
        });
      });
    } catch (err: any) {
      errorHandlingFetch(err);
    }
  };

  const onChangeHandler = async (event: React.ChangeEvent) => {
    let currentActionValues: boolean[];
    let status: number;
    switch (event.target.id) {
      case `${packingItem.id}-pack`:
        currentActionValues = [true, false, false];
        status = 1;
        break;
      case `${packingItem.id}-unpack`:
        currentActionValues = [false, true, false];
        status = 0;
        break;
      case `${packingItem.id}-irrelevant`:
        currentActionValues = [false, false, true];
        status = -1;
        break;
      default:
        dispatch(
          toggleFeedback({
            status: Status.ERROR,
            message: 'Unexpected error while selecting id.',
          })
        );
        return;
    }

    if (!arraysEqual(currentActionValues, actionValues)) {
      await fetchUpdateItem(status, currentActionValues);
    }
  };

  return (
    <>
      <CheckBox
        title='Pack'
        id={`${packingItem.id}-pack`}
        checked={actionValues[0]}
        onChange={onChangeHandler}
        checkedImageClassName="image-pack"
        uncheckedImageClassName="image-pack-unchecked"
        />
      <CheckBox
        title='Unpack'
        id={`${packingItem.id}-unpack`}
        checked={actionValues[1]}
        onChange={onChangeHandler}
        checkedImageClassName="image-unpack"
        uncheckedImageClassName="image-unpack-unchecked"
        />
      <CheckBox
        title='Irrelevant'
        id={`${packingItem.id}-irrelevant`}
        checked={actionValues[2]}
        onChange={onChangeHandler}
        checkedImageClassName="image-irrelevant"
        uncheckedImageClassName="image-irrelevant-unchecked"
      />
    </>
  );
};

export default PackingItemActions;
