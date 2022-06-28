import request from "configs/request";
import { useQuery } from "react-query";

export const useProductList = () =>
  useQuery("productlist", () =>
    request.get("v1/product/product/").then((res) => res.data)
  );
