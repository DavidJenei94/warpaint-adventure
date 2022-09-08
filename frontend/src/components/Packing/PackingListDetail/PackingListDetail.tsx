import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hooks';
import { PackingList, PackingItem } from '../../../models/packing.models';
import { errorHandlingFetch } from '../../../utils/errorHanling';
import { feedbackActions, Status } from '../../../store/feedback';

import PackingItemSingle from './PackingItemSingle';
import PackingItemNewForm from './PackingItemNewForm';
import PackingListEditForm from './PackingListEditForm';
import LoadingIcon from '../../UI/LoadingIcon';

import styles from './PackingListDetail.module.scss';
import PackingItemList from './PackingItemList';

type PackingListProps = {
  selectedPackingList: PackingList;
  setSelectedPackingList: Dispatch<SetStateAction<PackingList>>;
};

const PackingListDetail = ({
  selectedPackingList,
  setSelectedPackingList,
}: PackingListProps) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const feedbackStatus = useAppSelector((state) => state.feedback.status);

  const [packingItems, setPackingItems] = useState<PackingItem[]>([]);
  const [cardView, setCardView] = useState(false);

  useEffect(() => {
    const fetchPackingItems = async () => {
      dispatch(feedbackActions.pendingFeedback());

      try {
        const response = await fetch(
          `http://localhost:4000/api/packinglist/${selectedPackingList.id}/packingitem/`,
          {
            method: 'GET',
            headers: {
              'x-access-token': token,
            },
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }

        setPackingItems(data.packingItems);

        dispatch(feedbackActions.resetFeedback());
      } catch (err: any) {
        errorHandlingFetch(err);
      }
    };

    fetchPackingItems();
  }, [selectedPackingList.id]);

  const packedItems = packingItems.filter((item) => item.status === 1);
  const unPackedItems = packingItems.filter((item) => item.status === 0);
  const irrelevantItems = packingItems.filter((item) => item.status === -1);

  const componentToShow =
    feedbackStatus === Status.PENDING ? (
      <LoadingIcon />
    ) : (
      <>
        <PackingListEditForm
          packingList={selectedPackingList}
          setPackingList={setSelectedPackingList}
          onEditItems={setPackingItems}
          cardView={cardView}
          onViewToggle={setCardView}
        />
        <PackingItemNewForm
          packingListId={selectedPackingList.id}
          onAddItem={setPackingItems}
        />
        {packingItems.length > 0 && (
          <>
            <PackingItemList
              category="Unpacked items"
              packingItems={unPackedItems}
              packingListId={selectedPackingList.id}
              onEditItems={setPackingItems}
              cardView={cardView}
            />
            <PackingItemList
              category="Packed items"
              packingItems={packedItems}
              packingListId={selectedPackingList.id}
              onEditItems={setPackingItems}
              cardView={cardView}
            />
            <PackingItemList
              category="Irrelevant items"
              packingItems={irrelevantItems}
              packingListId={selectedPackingList.id}
              onEditItems={setPackingItems}
              cardView={cardView}
            />
          </>
        )}
        {/* {packingItems.length > 0 && (
          <>
            <p className={styles['item-category']}>Unpacked items</p>
            <div className={packingItemsClass}>
              {packingItems
                .filter((item) => item.status === 0)
                .map((item: PackingItem) => (
                  <PackingItemSingle
                    key={item.id}
                    id={item.id}
                    status={item.status}
                    name={item.name}
                    packingListId={selectedPackingList.id}
                    onEditItems={setPackingItems}
                    cardView={cardView}
                  />
                ))}
            </div>
          </>
        )}
        {packingItems.length > 0 && (
          <>
            <p className={styles['item-category']}>Packed items</p>
            <div className={packingItemsClass}>
              {packingItems

                .filter((item) => item.status === 1)
                .map((item: PackingItem) => (
                  <PackingItemSingle
                    key={item.id}
                    id={item.id}
                    status={item.status}
                    name={item.name}
                    packingListId={selectedPackingList.id}
                    onEditItems={setPackingItems}
                    cardView={cardView}
                  />
                ))}
            </div>
          </>
        )}
        {packingItems.length > 0 && (
          <>
            <p className={styles['item-category']}>Irrelevant items</p>
            <div className={packingItemsClass}>
              {packingItems
                .filter((item) => item.status === -1)
                .map((item: PackingItem) => (
                  <PackingItemSingle
                    key={item.id}
                    id={item.id}
                    status={item.status}
                    name={item.name}
                    packingListId={selectedPackingList.id}
                    onEditItems={setPackingItems}
                    cardView={cardView}
                  />
                ))}
            </div>
          </>
        )} */}
      </>
    );

  return (
    <div className={styles['packing-list-container']}>{componentToShow}</div>
  );
};

export default PackingListDetail;
