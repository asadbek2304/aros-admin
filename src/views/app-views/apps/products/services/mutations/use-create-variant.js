import request from "configs/request";
import { useMutation } from "react-query";

export const useCreateVariant = () =>
  useMutation("createvariant", (data) =>
    request.post("v1/product/product_variant/", data).then((res) => res.data)
  );
