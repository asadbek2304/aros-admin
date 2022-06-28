import request from "configs/request";
import { useQuery } from "react-query";

export const useAttributeList = () =>
  useQuery("attributelist", () =>
    request.get("v1/product/attribute/").then((res) => res.data)
  );
