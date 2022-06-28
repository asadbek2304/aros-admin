import queryClient from "configs/react-query-config";
import request from "configs/request";
import { useMutation } from "react-query";

export const useDeleteAttribute = (id) =>
  useMutation(
    "deleteattribute",
    () => request.delete(`v1/product/attribute/${id}/`).then((res) => res.data),
    {
      onMutate: () => {
        const cacheData = queryClient.getQueryData("attributelist");

        queryClient.setQueryData("attributelist", (oldValue) => {
          if (!oldValue) return cacheData;
          return {
            ...oldValue,
            results: oldValue.results.filter((res) => res.id !== id),
          };
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries("attributelist");
      },
    }
  );
