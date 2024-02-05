import { ApiService } from "@/src/api/ApiService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useManageService } from "./manageServices";
import { FormInstance } from "antd";

export const useAddService = (
  endpoint: string,
  queryKey: string,
  queryListKey: string,
  id: string = ""
) => {
  const dataApi = ApiService(endpoint);

  const router = useRouter();

  const queryClient = useQueryClient();

  const updateService = useManageService(endpoint, queryListKey, 1);

  const useDataDetailQuery = (isAdd: boolean) =>
    useQuery({
      queryKey: [queryKey, id],
      queryFn: () => dataApi.find(id as string),
      enabled: !isAdd,
      staleTime: 1000 * 30,
    });

  const useUpdateDataMutation = (
    form: FormInstance<any>,
    id: string,
    link: string
  ) =>
    useMutation({
      onSuccess: async () => {
        toast.success(`Updated successfully`);
        queryClient.invalidateQueries({ queryKey: [queryListKey] });
        await queryClient.prefetchQuery(updateService.queryData);
        router.push(link);
      },
      mutationFn: () => dataApi.update({ ...form.getFieldsValue(), id }),
      onError: (error) => {
        console.log(error);
      },
    });

  const useAddDataMutation = (form: FormInstance<any>) =>
    useMutation({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryListKey] });
        toast.success(`Added successfully`);
        form.resetFields();
      },
      mutationFn: () => dataApi.save(form.getFieldsValue()),
      onError: (error) => {
        console.log(error);
      },
    });

  return { useDataDetailQuery, useUpdateDataMutation, useAddDataMutation };
};
