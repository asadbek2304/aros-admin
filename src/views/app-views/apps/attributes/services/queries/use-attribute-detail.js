import request from "configs/request";
import { useQuery } from "react-query";

export const useAttributeDetail = (id, mode) =>
  useQuery(
    "attributedetail",
    (data) =>
      request.get(`v1/product/attribute/${id}/`, data).then((res) => res.data),
    {
      enabled: !!id && mode === "EDIT",
    }
  );
