import PackingListNewForm from './PackingListNewForm';
import Button from '../../UI/Button';
import Select from '../../UI/Select';

import styles from './PackingListSelector.module.scss';
import { PackingList } from '../../../models/packing.models';
import React from 'react';
import useModal from '../../../hooks/modal-hook';
import Modal from '../../UI/Modal/Modal';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hooks';
import { Status, toggleFeedback } from '../../../store/feedback';
import { errorHandlingFetch } from '../../../utils/errorHanling';

type SelectorProps = {
  packingLists: PackingList[];
  selectedPackingList: PackingList;
  setSelectedPackingList: (packingList: PackingList) => void;
};

const PackingListSelector = ({
  packingLists,
  selectedPackingList,
  setSelectedPackingList,
}: SelectorProps) => {
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();

  const {
    isShown: formIsShown,
    toggleModal: toggleFormIsShown,
    response: formResponse,
    setResponse: setFormResponse,
  } = useModal();

  const optionList = packingLists.map((packingList) => {
    return {
      value: packingList.id.toString(),
      text: packingList.name,
    };
  });

  const selectionChangeHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const target = event.target;
    const index = target.selectedIndex;
    const text = (target[index] as HTMLOptionElement).text;

    setSelectedPackingList({ id: Number(target.value), name: text });
  };

  const formSubmitHandler = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/packinglist/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify({
          name: formResponse[0],
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      dispatch(
        toggleFeedback({
          status: Status.SUCCESS,
          message: data.message,
        })
      );
    } catch (err: any) {
      errorHandlingFetch(err);
    }
  };

  return (
    <>
      <div className={styles['packing-selector']}>
        <label htmlFor="packingLists">Select packing list:</label>
        <Select
          onChange={selectionChangeHandler}
          value={selectedPackingList.id.toString()}
          optionList={optionList}
        />

        <Button
          className={styles['new-packing-list']}
          onClick={toggleFormIsShown}
        >
          <p>Create packing list</p>
        </Button>
        {formIsShown && (
          <Modal onClose={toggleFormIsShown} onConfirm={formSubmitHandler}>
            <PackingListNewForm
              response={formResponse}
              setResponse={setFormResponse}
            />
          </Modal>
        )}
      </div>
    </>
  );
};

export default PackingListSelector;
