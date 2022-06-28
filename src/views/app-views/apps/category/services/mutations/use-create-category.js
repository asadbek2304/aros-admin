import request from "configs/request";
import { useMutation } from "react-query";

export const useCreateCategory = () =>
  useMutation("cratecategory", (data) =>
    request.post("v1/product/category/", data).then((res) => res.data)
  );
