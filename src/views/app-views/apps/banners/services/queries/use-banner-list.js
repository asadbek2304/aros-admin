import request from "configs/request";
import { useQuery } from "react-query";

export const useBannerList = () =>
  useQuery("bannerlist", () =>
    request.get("v1/banner/").then((res) => res.data)
  );
