import request from "configs/request";
import { useMutation } from "react-query";

export const useCreateBanner = () =>
  useMutation("createbanner", (data) =>
    request.post("v1/banner/", data).then((res) => res.data)
  );
