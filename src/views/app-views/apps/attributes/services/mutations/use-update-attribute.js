import request from "configs/request";
import { useMutation } from "react-query";

export const useUpdateAttribute = (id) =>
  useMutation("updateattribute", (data) =>
    request.put(`v1/product/attribute/${id}/`, data).then((res) => res.data)
  );
