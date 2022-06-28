import request from "configs/request";
import { useQuery } from "react-query";

export const useCategoryList = () =>
  useQuery("categorylist", () =>
    request.get("v1/product/category_list/").then((res) => res.data)
  );
