import request from "configs/request";
import { useQuery } from "react-query";

export const useProductDetail = (id) =>
  useQuery(
    "productdetail",
    () => request.get(`v1/product/product/${id}/`).then((res) => res.data),
    {
      enabled: !!id,
    }
  );
