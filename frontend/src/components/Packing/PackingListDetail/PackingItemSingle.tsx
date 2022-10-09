import { Dispatch, SetStateAction, useState } from 'react';
import { useAppSelector } from '../../../hooks/redux-hooks';
import useModal from '../../../hooks/modal-hook';
import { PackingItem } from '../../../models/packing.models';
import PackingItemActions from './PackingItemActions';
import useFetchDataEffect from '../../../hooks/fetch-data-effect-hook';
import useHttp from '../../../hooks/http-hook';
import {
  deletePackingItem,
  updatePackingItem,
} from '../../../lib/packingitem-api';

import Modal from '../../UI/Modal/Modal';
import BasicConfirmation from '../../UI/ConfirmationModals/BasicConfirmation';
import EditDeleteText from '../../UI/Combined/EditDeleteText';

import styles from './PackingItemSingle.module.scss';

interface PackingItemProps extends PackingItem {
  cardView: boolean;
  packingListId: number;
  onEditItems: Dispatch<SetStateAction<PackingItem[]>>;
}

const PackingItemSingle = ({
  cardView,
  packingListId,
  id,
  name,
  status,
  onEditItems,
}: PackingItemProps) => {
  const token: string = useAppSelector((state) => state.auth.token);

  const { isShown: deleteModalIsShown, toggleModal: toggleDeleteModal } =
    useModal();

  const [packingItemName, setPackingItemName] = useState<string>(name);

  const {
    sendRequest: sendUpdateItemRequest,
    status: updateItemStatus,
    error: updateItemError,
    data: updateItemData,
  } = useHttp(updatePackingItem);
  const {
    sendRequest: sendDeleteItemRequest,
    status: deleteItemStatus,
    error: deleteItemError,
    data: deleteItemData,
  } = useHttp(deletePackingItem);

  const confirmNameChangeHandler = async () => {
    // If name was not changed
    if (name === packingItemName) {
      return;
    }

    sendUpdateItemRequest({
      token,
      listId: packingListId,
      id,
      name: packingItemName,
      status: 0,
    });
  };

  useFetchDataEffect(() => {
    onEditItems((prevState) => {
      return prevState.map((item) => {
        if (item.id === id) {
          return { id, name: packingItemName, status };
        }
        return item;
      });
    });
  }, [updateItemStatus, updateItemError, updateItemData]);

  const deleteItemHandler = async () => {
    sendDeleteItemRequest({ token, listId: packingListId, id });
  };

  useFetchDataEffect(() => {
    // refresh list items by removing that one element
    onEditItems((prevState) => {
      return prevState.filter((item) => item.id !== id);
    });
  }, [deleteItemStatus, deleteItemError, deleteItemData]);

  return (
    <>
      {deleteModalIsShown && (
        <Modal onClose={toggleDeleteModal} onConfirm={deleteItemHandler}>
          <BasicConfirmation>
            Are you sure you want to delete it?
          </BasicConfirmation>
        </Modal>
      )}
      <div
        className={
          !cardView ? styles['packing-item'] : styles['packing-item-card']
        }
      >
        <EditDeleteText
          text={packingItemName}
          setText={setPackingItemName}
          toggleDeleteModal={toggleDeleteModal}
          onConfirmChange={confirmNameChangeHandler}
          className={!cardView ? '' : styles['packing-name-container']}
        />
        <div className={styles['packing-item-actions']}>
          <PackingItemActions
            packingListId={packingListId}
            packingItem={{ id, name, status }}
            onEditItems={onEditItems}
          />
        </div>
      </div>
    </>
  );
};

export default PackingItemSingle;
