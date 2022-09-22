import { Dispatch, SetStateAction, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hooks';
import { Status, toggleFeedback } from '../../../store/feedback';
import { PackingItem, PackingList } from '../../../models/packing.models';
import { errorHandlingFetch } from '../../../utils/errorHanling';
import useModal from '../../../hooks/modal-hook';

import Button from '../../UI/Button';
import Modal from '../../UI/Modal/Modal';
import BasicConfirmation from '../../UI/ConfirmationModals/BasicConfirmation';

import styles from './PackingListEditForm.module.scss';
import cardViewIcon from '../../../assets/icons/view-card.png';
import listViewIcon from '../../../assets/icons/view-list.png';
import EditDeleteText from '../../UI/Combined/EditDeleteText';

type PackingListProps = {
  packingList: PackingList;
  setPackingList: Dispatch<SetStateAction<PackingList>>;
  onEditItems: Dispatch<SetStateAction<PackingItem[]>>;
  cardView: boolean;
  onViewToggle: Dispatch<SetStateAction<boolean>>;
};

const PackingListEditForm = ({
  packingList,
  setPackingList,
  onEditItems,
  cardView,
  onViewToggle,
}: PackingListProps) => {
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();

  const [packingListName, setPackingListName] = useState(packingList.name);
  const { isShown: deleteModalIsShown, toggleModal: toggleDeleteModal } =
    useModal();

  const confirmNameChangeHandler = async () => {
    // If name was not changed
    if (packingList.name === packingListName) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/api/packinglist/${packingList.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
          body: JSON.stringify({
            name: packingListName,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      setPackingList((prevState: PackingList) => {
        return { ...prevState, name: packingListName };
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

  const deleteListHandler = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/packinglist/${packingList.id}`,
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

      dispatch(
        toggleFeedback({
          status: Status.SUCCESS,
          message: data.message,
        })
      );
    } catch (err: any) {
      errorHandlingFetch(err);
    }

    // trigger useEffect in PackingMain to refresh the selection list
    setPackingList({ id: 0, name: '...' });
  };

  const unpackAllHandler = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/packinglist/${packingList.id}/packingitem/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
          body: JSON.stringify({ status: 0 }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      onEditItems((prevState) =>
        prevState.map((item) => {
          return { ...item, status: 0 };
        })
      );

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

  const viewToggler = () => {
    onViewToggle((prevState) => !prevState);
  };

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
