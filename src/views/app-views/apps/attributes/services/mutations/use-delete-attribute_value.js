import queryClient from "configs/react-query-config";
import request from "configs/request";
import { useMutation } from "react-query";

export const useDeleteAttributeValue = (id) =>
  useMutation(
    "deleteattributevalue",
    () =>
      request
        .delete(`v1/product/attribute_value/${id}/`)
        .then((res) => res.data),
    {
      onMutate: () => {
        const cachedValue = queryClient.getQueryData("attributevaluelist");

        queryClient.setQueryData("attributevaluelist", (oldValues) => {
          if (!oldValues) return cachedValue;

          return {
            ...oldValues,
            results: oldValues.results.filter((val) => val.id !== id),
          };
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries("attributevaluelist");
      },
    }
  );
