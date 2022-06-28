import queryClient from "configs/react-query-config";
import request from "configs/request";
import { useMutation } from "react-query";

export const useUpdateAttributeValue = (id) =>
  useMutation(
    "updateattributevalue",
    (data) =>
      request
        .put(`v1/product/attribute_value/${id}/`, data)
        .then((res) => res.data),
    {
      onMutate: (variables) => {
        const cachedData = queryClient.getQueryData("attributevaluelist");

        queryClient.setQueryData("attributevaluelist", (oldValue) => {
          if (!oldValue) return cachedData;
          const changedItemIndex = oldValue.results.findIndex(
            (val) => val.id === id
          );
          oldValue.results.splice(changedItemIndex, 1, variables);
          console.log(oldValue.results)
          return {
            ...oldValue,
            results: oldValue.results,
          };
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries("attributevaluelist")
      }
    }
  );
