import request from "configs/request";
import { useMutation } from "react-query";

export const useUpdateCategory = (id) =>
  useMutation("updatecategory", (data) =>
    request.put(`v1/product/category/${id}/`, data).then((res) => res.data)
  );
