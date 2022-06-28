import queryClient from "configs/react-query-config";
import request from "configs/request";
import { useMutation } from "react-query";

export const useDeleteBanner = (id) =>
  useMutation(
    "deletebanner",
    () => request.delete(`v1/banner/${id}/`).then((res) => res.data),
    {
      onMutate: () => {
        const cachedData = queryClient.getQueryData("bannerlist");

        queryClient.setQueryData("bannerlist", (oldValue) => {
          if (!oldValue) return cachedData;
          return {
            ...oldValue,
            results: oldValue.results.filter((res) => res.id !== id),
          };
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries("bannerlist");
      },
    }
  );
