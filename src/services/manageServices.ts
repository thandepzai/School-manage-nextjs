import { ApiService } from "@/src/api/ApiService";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { SetStateAction } from "react";
import { toast } from "react-toastify";

export const useManageService = (
  endpoint: string,
  queryKey: string,
  page: number,
  pageSize: number = 10,
  keySearch: string = "",
  valueSearch: string = "",
  keySearchSecond: string = "",
  valueSearchSecond: string = ""
) => {
  const dataApi = ApiService(endpoint);

  const queryClient = useQueryClient();

  const keyObject = valueSearch.length ? { [keySearch]: valueSearch } : {};
  const keyObjectSecond = valueSearchSecond.length
    ? { [keySearchSecond]: valueSearchSecond }
    : {};

  const queryData = {
    queryKey: [queryKey, page, valueSearch, valueSearchSecond],
    queryFn: () =>
      dataApi.search({
        params: { page, pageSize, ...keyObject, ...keyObjectSecond },
      }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 40,
    gcTime: Infinity,
  };

  const useDataQuery = () => useQuery(queryData);

  const useDeleteDataMutation = (
    id: string,
    setIsModalOpen: (value: SetStateAction<boolean>) => void
  ) =>
    useMutation({
      mutationFn: () => dataApi.remove(id),
      onSuccess: async () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        await queryClient.prefetchQuery(queryData);
        toast.success(`Delete success`);
        setIsModalOpen(false);
      },
    });

  return { useDataQuery, useDeleteDataMutation, queryData };
};
