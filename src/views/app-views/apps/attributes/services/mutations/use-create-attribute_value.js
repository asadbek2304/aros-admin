import queryClient from "configs/react-query-config";
import request from "configs/request";
import { useMutation } from "react-query";

export const useCreateAttributeValue = () =>
  useMutation(
    "createattributevalue",
    (data) =>
      request.post("v1/product/attribute_value/", data).then((res) => res.data),
    {
      onSettled: () => {
        queryClient.invalidateQueries("attributevaluelist");
      },
    }
  );
