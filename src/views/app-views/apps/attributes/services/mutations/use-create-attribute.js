import request from "configs/request";
import { useMutation } from "react-query";

export const useCreateAttribute = () =>
  useMutation("createattribute", (data) =>
    request.post("v1/product/attribute/", data).then((res) => res.data)
  );
