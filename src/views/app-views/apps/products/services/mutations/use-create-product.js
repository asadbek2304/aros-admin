import request from "configs/request";
import { useMutation } from "react-query";

export const useCreateProduct = () =>
  useMutation("createproduct", (data) =>
    request.post("v1/product/product/", data).then((res) => res.data)
  );
