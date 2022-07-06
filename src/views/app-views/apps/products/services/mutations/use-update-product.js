import queryClient from "configs/react-query-config";
import request from "configs/request";
import { useMutation } from "react-query";

export const useUpdateProduct = (id) =>
  useMutation(
    "updateproduct",
    (data) =>
      request.put(`v1/product/product/${id}/`, data).then((res) => res.data),
    {
      onSettled: () => {
        queryClient.invalidateQueries("productdetail");
      },
    }
  );
