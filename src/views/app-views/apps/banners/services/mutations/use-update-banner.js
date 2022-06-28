import request from "configs/request";
import { useMutation } from "react-query";

export const useUpdateBanner = (id) =>
  useMutation("updatebanner", (data) =>
    request.put(`v1/banner/${id}/`, data).then((res) => res.data)
  );
