import request from "configs/request";
import { useMutation } from "react-query";

export const useUpdateVariant = (id) =>
  useMutation("updatevariant", (data) =>
    request
      .put(`v1/product/product_variant/${id}/`, data)
      .then((res) => res.data)
  );
