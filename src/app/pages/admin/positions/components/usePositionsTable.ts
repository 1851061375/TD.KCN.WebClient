import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { TableProps } from 'antd/es/table';
import dayjs from 'dayjs';

import { requestPOST, requestDELETE } from '@/utils/baseAPI';
import * as actionsModal from '@/redux/modal/Actions';
import * as actionsGlobal from '@/redux/global/Actions';
import { IPosition, IPaginationResponse, IResult } from '@/models';
import { SearchData } from '@/types';
import { AppDispatch, RootState } from '@/redux/Store';
import { Popconfirm } from 'antd';

interface UsePositionsTableProps {
  searchData?: SearchData;
  initialPageSize?: number;
}

export const usePositionsTable = ({ searchData, initialPageSize = 50 }: UsePositionsTableProps) => {
  const dispatch: AppDispatch = useDispatch();
  const random = useSelector((state: RootState) => state.global.random);

  const [data, setData] = useState<IPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await requestPOST<IPaginationResponse<IPosition[]>>('api/v1/positions/search', {
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData, random]);

  return {
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
