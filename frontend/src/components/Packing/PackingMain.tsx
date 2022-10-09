import { useEffect, useState } from 'react';
import useHttp from '../../hooks/http-hook';
import { useAppSelector } from '../../hooks/redux-hooks';
import { getAllPackingList } from '../../lib/packinglist-api';
import { PackingList } from '../../models/packing.models';
import useFetchDataEffect from '../../hooks/fetch-data-effect-hook';

import PackingListDetail from './PackingListDetail/PackingListDetail';
import PackingListSelector from './PackingListSelector/PackingListSelector';
import LoadingIcon from '../UI/LoadingIcon';

import styles from './PackingMain.module.scss';

const PackingMain = () => {
  const token: string = useAppSelector((state) => state.auth.token);

  const [packingLists, setPackingLists] = useState<PackingList[]>([]);
  const [selectedPackingList, setSelectedPackingList] = useState<PackingList>({
    id: 0,
    name: '',
  });

  const {
    sendRequest: sendGetAllListRequest,
    status: getAllListStatus,
    error: getAllListError,
    data: getAllListsData,
  } = useHttp(getAllPackingList, false);

  useEffect(() => {
    sendGetAllListRequest({ token });
  }, [sendGetAllListRequest]);

  useFetchDataEffect(() => {
    setPackingLists(
      [{ id: 0, name: '...' }].concat(getAllListsData.packingLists)
    );
  }, [getAllListStatus, getAllListError, getAllListsData]);

  if (getAllListStatus !== 'completed' || packingLists.length === 0) {
    return (
      <>
        <LoadingIcon />
      </>
    );
  }

  return (
    <div className={styles['packing-container']}>
      <PackingListSelector
        packingLists={packingLists}
        setPackingLists={setPackingLists}
        selectedPackingList={selectedPackingList}
        setSelectedPackingList={setSelectedPackingList}
      />
      {selectedPackingList.id !== 0 && (
        <PackingListDetail
          setPackingLists={setPackingLists}
          selectedPackingList={selectedPackingList}
          setSelectedPackingList={setSelectedPackingList}
        />
      )}
    </div>
  );
};

export default PackingMain;
