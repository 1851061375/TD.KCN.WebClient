import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { requestPOST } from '@/utils/baseAPI';
import { IPaginationResponse, INhomDanhMuc } from '@/models';
import { SearchData } from '@/types';
import { AppDispatch, RootState } from '@/redux/Store';
import { IDiaBan } from '@/models/DiaBan';

interface UseDataTableProps {
  searchData?: SearchData;
  initialPageSize?: number;
}

export const useDataTable = ({ searchData, initialPageSize = 20 }: UseDataTableProps) => {
  const dispatch: AppDispatch = useDispatch();
  const random = useSelector((state: RootState) => state.global.random);

  const [data, setData] = useState<IDiaBan[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
const [tinh,setTinh]=useState<IDiaBan[]>([]);
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await requestPOST<IPaginationResponse<IDiaBan[]>>('api/v1/diabans/search', {
        orderBy: ['Ma'],
        Cap:'2',
        pageNumber: currentPage,
        pageSize,
        ...searchData,
      });

      if (response.data) {
        const { data: responseData, totalCount: total } = response.data;
        setData(responseData ?? []);
        setTotalCount(total);
      } else {
        setData([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error('Error fetching positions:', error);
      toast.error('Không thể tải dữ liệu. Vui lòng thử lại!');
      setData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchData]);

  const fetchDataTinh = useCallback(async () => {
    try {
      setLoading(true);
      const response = await requestPOST<IPaginationResponse<IDiaBan[]>>('api/v1/diabans/search', {
        orderBy: ['Ma'],
        Cap:'1',
        //pageNumber: currentPage,
        //pageSize,
        ...searchData,
      });

      if (response.data) {
        const { data: responseData, totalCount: total } = response.data;
        setTinh(responseData ?? []);
        setTotalCount(total);
      } else {
        setData([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error('Error fetching positions:', error);
      toast.error('Không thể tải dữ liệu. Vui lòng thử lại!');
      setData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    setCurrentPage(1);
  }, [searchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData, random]);

  useEffect(() => {
    fetchDataTinh();
  }, [fetchDataTinh, random]);

  return {
    tinh,
    data,
    loading,
    totalCount,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    refresh: fetchData,
  };
};
