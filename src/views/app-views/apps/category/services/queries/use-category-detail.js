import request from "configs/request";
import { useQuery } from "react-query";

export const useCategoryDetail = (id, mode) =>
  useQuery(
    "categorydetail",
    (data) =>
      request.get(`v1/product/category/${id}/`, data).then((res) => res.data),
    {
      enabled: !!id && mode === "EDIT",
    }
  );
