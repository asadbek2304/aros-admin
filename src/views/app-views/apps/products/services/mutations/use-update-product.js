import request from "configs/request";
import { useMutation } from "react-query";

export const useUpdateProduct = (id) =>
  useMutation("updateproduct", (data) =>
    request.put(`v1/product/product/${id}/`, data).then((res) => res.data)
  );
