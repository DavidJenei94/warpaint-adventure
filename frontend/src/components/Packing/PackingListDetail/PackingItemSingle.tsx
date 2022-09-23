import { Dispatch, SetStateAction, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hooks';
import { Status, toggleFeedback } from '../../../store/feedback';
import { errorHandlingFetch } from '../../../utils/errorHanling';
import useModal from '../../../hooks/modal-hook';
import { PackingItem } from '../../../models/packing.models';
import PackingItemActions from './PackingItemActions';

import Modal from '../../UI/Modal/Modal';
import BasicConfirmation from '../../UI/ConfirmationModals/BasicConfirmation';
import EditDeleteText from '../../UI/Combined/EditDeleteText';

import styles from './PackingItemSingle.module.scss';

type PackingItemProps = PackingItem & {
  cardView: boolean;
  packingListId: number;
  onEditItems: Dispatch<SetStateAction<PackingItem[]>>;
};

const PackingItemSingle = ({
  cardView,
  packingListId,
  id,
  name,
  status,
  onEditItems,
}: PackingItemProps) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  const { isShown: deleteModalIsShown, toggleModal: toggleDeleteModal } =
    useModal();

  const [packingItemName, setPackingItemName] = useState(name);

  const confirmNameChangeHandler = async () => {
    // If name was not changed
    if (name === packingItemName) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/api/packinglist/${packingListId}/packingitem/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
          body: JSON.stringify({
            name: packingItemName,
            status: 0,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      onEditItems((prevState) => {
        return prevState.map((item) => {
          if (item.id === id) {
            return { id, name: packingItemName, status };
          }
          return item;
        });
      });

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

  const deleteItemHandler = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/packinglist/${packingListId}/packingitem/${id}`,
        {
          method: 'DELETE',
          headers: {
            'x-access-token': token,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      // refresh list items by removing that one element
      onEditItems((prevState) => {
        return prevState.filter((item) => item.id !== id);
      });

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
