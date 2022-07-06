import request from "configs/request";
import { useQuery } from "react-query";

export const useProductVariantDetail = (id) =>
  useQuery(
    "variantDetail",
    () =>
      request.get(`v1/product/product_variant/${id}/`).then((res) => res.data),
    {
      enabled: !!id,
    }
  );
