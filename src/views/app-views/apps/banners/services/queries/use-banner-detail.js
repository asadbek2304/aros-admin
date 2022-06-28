import request from "configs/request";
import { useQuery } from "react-query";

export const useBannerDetail = (id) =>
  useQuery(
    "bannerdetail",
    () => request.get(`v1/banner/${id}/`).then((res) => res.data),
    {
      enabled: !!id,
    }
  );
