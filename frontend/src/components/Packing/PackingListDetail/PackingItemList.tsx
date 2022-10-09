import { Dispatch, SetStateAction } from 'react';
import { PackingItem } from '../../../models/packing.models';

import PackingItemSingle from './PackingItemSingle';

import styles from './PackingItemList.module.scss';

interface PackingItemListProps {
  category: string;
  packingItems: PackingItem[];
  packingListId: number;
  cardView: boolean;
  onEditItems: Dispatch<SetStateAction<PackingItem[]>>;
};

const PackingItemList = ({
  category,
  packingItems,
  packingListId,
  cardView,
  onEditItems,
}: PackingItemListProps) => {
  const packingItemsClass: string = cardView ? styles.card : '';

  return (
    <>
      <p className={styles['item-category']}>{category}</p>
      <div className={packingItemsClass}>
        {packingItems.map((item: PackingItem) => (
          <PackingItemSingle
            key={item.id}
            id={item.id}
            status={item.status}
            name={item.name}
            packingListId={packingListId}
            onEditItems={onEditItems}
            cardView={cardView}
          />
        ))}
      </div>
    </>
  );
};

export default PackingItemList;
