import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useAppSelector } from '../../../hooks/redux-hooks';
import { PackingItem, PackingList } from '../../../models/packing.models';
import useHttp from '../../../hooks/http-hook';
import useModal from '../../../hooks/modal-hook';
import {
  deletePackingList,
  updatePackingListName,
} from '../../../lib/packinglist-api';
import { updateAllPackingItemStatus } from '../../../lib/packingitem-api';
import useDelayLoading from '../../../hooks/delay-loading-hook';
import useFetchDataEffect from '../../../hooks/fetch-data-effect-hook';

import Button from '../../UI/Button';
import Modal from '../../UI/Modal/Modal';
import BasicConfirmation from '../../UI/ConfirmationModals/BasicConfirmation';
import EditDeleteText from '../../UI/Combined/EditDeleteText';
import LoadingIcon from '../../UI/LoadingIcon';

import styles from './PackingListEditForm.module.scss';
import cardViewIcon from '../../../assets/icons/view-card.png';
import listViewIcon from '../../../assets/icons/view-list.png';

type PackingListProps = {
  setPackingLists: Dispatch<SetStateAction<PackingList[]>>;
  selectedPackingList: PackingList;
  setSelectedPackingList: Dispatch<SetStateAction<PackingList>>;
  onEditItems: Dispatch<SetStateAction<PackingItem[]>>;
  cardView: boolean;
  onViewToggle: Dispatch<SetStateAction<boolean>>;
};

const PackingListEditForm = ({
  setPackingLists,
  selectedPackingList,
  setSelectedPackingList,
  onEditItems,
  cardView,
  onViewToggle,
}: PackingListProps) => {
  const token = useAppSelector((state) => state.auth.token);

  const [packingListName, setPackingListName] = useState('');
  const { isShown: deleteModalIsShown, toggleModal: toggleDeleteModal } =
    useModal();

  const {
    sendRequest: updateListSendRequest,
    status: updateListStatus,
    error: updateListError,
    data: updateListData,
  } = useHttp(updatePackingListName);

  const {
    sendRequest: deleteListSendRequest,
    status: deleteListStatus,
    error: deleteListError,
    data: deleteListData,
  } = useHttp(deletePackingList);

  const {
    sendRequest: updateAllItemSendRequest,
    status: updateAllItemStatus,
    error: updateAllItemError,
    data: updateAllItemData,
  } = useHttp(updateAllPackingItemStatus);

  const statuses = [updateListStatus, deleteListStatus, updateAllItemStatus];
  const loadDelay = useDelayLoading(statuses);

  useEffect(() => {
    setPackingListName(selectedPackingList.name);
  }, [selectedPackingList.name]);

  const confirmNameChangeHandler = async () => {
    // If name was not changed
    if (selectedPackingList.name === packingListName) {
      return;
    }

    await updateListSendRequest({
      token: token,
      id: selectedPackingList.id,
      name: packingListName,
    });
  };

  useFetchDataEffect(() => {
    setSelectedPackingList((prevState: PackingList) => {
      return { ...prevState, name: packingListName };
    });
    // Update selection in Packing Main
    setPackingLists((prevState) =>
      prevState.map((list) => {
        if (list.id === selectedPackingList.id) {
          return { id: list.id, name: packingListName };
        }
        return list;
      })
    );

    // change back the packing list name field to original
    if (updateListError) {
      setPackingListName(selectedPackingList.name);
    }
  }, [updateListStatus, updateListError, updateListData]);

  const deleteListHandler = async () => {
    await deleteListSendRequest({
      token: token,
      id: selectedPackingList.id,
    });
  };

  useFetchDataEffect(() => {
    // trigger useEffect in PackingMain to refresh the selection list
    setSelectedPackingList({ id: 0, name: '...' });
    setPackingLists((prevState) =>
      prevState.filter((list) => list.id !== selectedPackingList.id)
    );
  }, [deleteListStatus, deleteListError, deleteListData]);
  const unpackAllHandler = async () => {
    await updateAllItemSendRequest({
      token: token,
      listId: selectedPackingList.id,
      status: 0,
    });
  };

  useFetchDataEffect(() => {
    onEditItems((prevState) =>
      prevState.map((item) => {
        return { ...item, status: 0 };
      })
    );
  }, [updateAllItemStatus, updateAllItemError, updateAllItemData]);

  const viewToggler = () => {
    onViewToggle((prevState) => !prevState);
  };

  if (loadDelay) {
    return (
      <>
        <LoadingIcon />
      </>
    );
  }

  return (
    <div className={styles['packing-list-edit']}>
      {deleteModalIsShown && (
        <Modal onClose={toggleDeleteModal} onConfirm={deleteListHandler}>
          <BasicConfirmation>
            Are you sure you want to delete it?
          </BasicConfirmation>
        </Modal>
      )}
      <EditDeleteText
        text={packingListName}
        setText={setPackingListName}
        toggleDeleteModal={toggleDeleteModal}
        onConfirmChange={confirmNameChangeHandler}
      />
      <div className={styles['packing-actions']}>
        <Button onClick={viewToggler}>
          {cardView ? <img src={listViewIcon} /> : <img src={cardViewIcon} />}
        </Button>
        <Button onClick={unpackAllHandler}>
          <p>Unpack all</p>
        </Button>
      </div>
    </div>
  );
};

export default PackingListEditForm;
