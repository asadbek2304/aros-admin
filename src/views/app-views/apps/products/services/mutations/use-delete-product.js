import queryClient from "configs/react-query-config";
import request from "configs/request";
import { useMutation } from "react-query";

export const useDeleteProduct = (id) =>
  useMutation(
    "deleteproduct",
    () => request.delete(`v1/product/product/${id}/`).then((res) => res.data),
    {
      onMutate: () => {
        const productList = queryClient.getQueryData("productlist");

        queryClient.setQueryData("productlist", (oldValue) => {
          if (!oldValue) return productList;

          return {
            ...oldValue,
            results: oldValue.results.filter((val) => val.id !== id),
          };
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries("productlist");
      },
    }
  );
