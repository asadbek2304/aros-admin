import request from "configs/request";
import { useQuery } from "react-query";

export const useProductVariantList = (productId) =>
  useQuery("productvariantlist", () =>
    request
      .get(`v1/product/product_variant/?product=${productId}`)
      .then((res) => res.data)
  );
