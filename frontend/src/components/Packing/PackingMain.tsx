import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import { PackingList } from '../../models/packing.models';
import { Status, toggleFeedback } from '../../store/feedback';
import { errorHandlingFetch } from '../../utils/errorHanling';

import PackingListDetail from './PackingListDetail/PackingListDetail';
import PackingListSelector from './PackingListSelector/PackingListSelector';

import styles from './PackingMain.module.scss';

const PackingMain = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  const [packingLists, setPackingLists] = useState<PackingList[]>([]);
  const [selectedPackingList, setSelectedPackingList] = useState<PackingList>({
    id: 0,
    name: '',
  });

  useEffect(() => {
    const getPackingLists = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/packinglist/', {
          method: 'GET',
          headers: {
            'x-access-token': token,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }

        setPackingLists([{ id: 0, name: '...' }].concat(data.packingLists));
      } catch (err: any) {
        errorHandlingFetch(err);
      }
    };

    getPackingLists();
  }, [selectedPackingList]);

  return (
    <div className={styles['packing-container']}>
      <PackingListSelector
        packingLists={packingLists}
        selectedPackingList={selectedPackingList}
        setSelectedPackingList={setSelectedPackingList}
      />
      {selectedPackingList.id !== 0 && (
        <PackingListDetail
          selectedPackingList={selectedPackingList}
          setSelectedPackingList={setSelectedPackingList}
        />
      )}
    </div>
  );
};

export default PackingMain;
