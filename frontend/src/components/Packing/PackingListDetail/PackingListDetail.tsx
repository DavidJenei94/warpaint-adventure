import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useAppSelector } from '../../../hooks/redux-hooks';
import { PackingList, PackingItem } from '../../../models/packing.models';
import { getAllPackingItem } from '../../../lib/packingitem-api';
import useHttp from '../../../hooks/http-hook';
import useDelayLoading from '../../../hooks/delay-loading-hook';
import useFetchDataEffect from '../../../hooks/fetch-data-effect-hook';

import PackingItemNewForm from './PackingItemNewForm';
import PackingListEditForm from './PackingListEditForm';
import LoadingIcon from '../../UI/LoadingIcon';
import PackingItemList from './PackingItemList';

import styles from './PackingListDetail.module.scss';

interface PackingListProps {
  setPackingLists: Dispatch<SetStateAction<PackingList[]>>;
  selectedPackingList: PackingList;
  setSelectedPackingList: Dispatch<SetStateAction<PackingList>>;
}

const PackingListDetail = ({
  setPackingLists,
  selectedPackingList,
  setSelectedPackingList,
}: PackingListProps) => {
  const token: string = useAppSelector((state) => state.auth.token);

  const [packingItems, setPackingItems] = useState<PackingItem[]>([]);
  const [cardView, setCardView] = useState<boolean>(false);

  const {
    sendRequest: sendGetAllItemRequest,
    status: getAllItemStatus,
    error: getAllItemError,
    data: getAllItemData,
  } = useHttp(getAllPackingItem, false);

  const loadDelay: boolean = useDelayLoading([getAllItemStatus]);

  useEffect(() => {
    if (selectedPackingList.id !== 0 && !isNaN(selectedPackingList.id)) {
      sendGetAllItemRequest({ token, listId: selectedPackingList.id });
    }
  }, [sendGetAllItemRequest, selectedPackingList.id]);

  useFetchDataEffect(() => {
    setPackingItems(getAllItemData.packingItems);
  }, [getAllItemStatus, getAllItemError, getAllItemData]);

  if (loadDelay && (getAllItemStatus !== 'completed' || !getAllItemData)) {
    return (
      <div className={styles['packing-list-container']}>
        <LoadingIcon />
      </div>
    );
  }

  const packedItems: PackingItem[] = packingItems.filter(
    (item) => item.status === 1
  );
  const unPackedItems: PackingItem[] = packingItems.filter(
    (item) => item.status === 0
  );
  const irrelevantItems: PackingItem[] = packingItems.filter(
    (item) => item.status === -1
  );

  return (
    <div className={styles['packing-list-container']}>
      <PackingListEditForm
        setPackingLists={setPackingLists}
        selectedPackingList={selectedPackingList}
        setSelectedPackingList={setSelectedPackingList}
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
    </div>
  );
};

export default PackingListDetail;
