import React, { Dispatch, SetStateAction } from 'react';
import { PackingList } from '../../../models/packing.models';
import useModal from '../../../hooks/modal-hook';
import { useAppSelector } from '../../../hooks/redux-hooks';
import useHttp from '../../../hooks/http-hook';
import { createPackingList } from '../../../lib/packinglist-api';
import useFetchDataEffect from '../../../hooks/fetch-data-effect-hook';

import PackingListNewForm from './PackingListNewForm';
import Button from '../../UI/Button';
import Select from '../../UI/Select';
import Modal from '../../UI/Modal/Modal';

import styles from './PackingListSelector.module.scss';

type SelectorProps = {
  packingLists: PackingList[];
  setPackingLists: Dispatch<SetStateAction<PackingList[]>>;
  selectedPackingList: PackingList;
  setSelectedPackingList: Dispatch<SetStateAction<PackingList>>;
};

const PackingListSelector = ({
  packingLists,
  setPackingLists,
  selectedPackingList,
  setSelectedPackingList,
}: SelectorProps) => {
  const token = useAppSelector((state) => state.auth.token);

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

  const {
    sendRequest: sendCreateListRequest,
    status: createListStatus,
    error: createListError,
    data: createListData,
  } = useHttp(createPackingList);

  const selectionChangeHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const target = event.target;
    const index = target.selectedIndex;
    const text = (target[index] as HTMLOptionElement).text;

    setSelectedPackingList({ id: Number(target.value), name: text });
  };

  const formSubmitHandler = async () => {
    sendCreateListRequest({ token, name: formResponse[0] });
  };

  useFetchDataEffect(
    () => {
      const newPackingList = {
        id: Number(createListData.packingListId),
        name: formResponse[0],
      };

      setPackingLists((prevState) => prevState.concat([newPackingList]));
      setSelectedPackingList(newPackingList);
    },
    createListStatus,
    createListError,
    createListData
  );

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
