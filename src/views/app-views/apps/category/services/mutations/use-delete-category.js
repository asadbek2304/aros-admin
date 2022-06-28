import queryClient from "configs/react-query-config";
import request from "configs/request";
import { useMutation } from "react-query";

export const useDeleteCategory = (id) =>
  useMutation(
    "deletecategory",
    () => request.delete(`v1/product/category/${id}/`).then((res) => res.data),
    {
      onMutate: () => {
        const cacheData = queryClient.getQueryData("categorylist");

        queryClient.setQueryData("categorylist", (oldValue) => {
          if (!oldValue) return cacheData;
          return {
            ...oldValue,
            results: oldValue.results.filter((res) => res.id !== id),
          };
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries("categorylist");
      },
    }
  );
