import queryClient from "configs/react-query-config";
import request from "configs/request";
import { useMutation } from "react-query";

export const useDeleteVariant = (id) =>
  useMutation(
    "deletevariant",
    () =>
      request
        .delete(`v1/product/product_variant/${id}/`)
        .then((res) => res.data),
    {
      onMutate: () => {
        const productList = queryClient.getQueryData("productvariantlist");

        queryClient.setQueryData("productvariantlist", (oldValue) => {
          if (!oldValue) return productList;

          return {
            ...oldValue,
            results: oldValue.results.filter((val) => val.id !== id),
          };
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries("productvariantlist");
      },
    }
  );
