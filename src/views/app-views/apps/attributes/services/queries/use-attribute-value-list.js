import request from "configs/request";
import { useQuery } from "react-query";

export const useAttributeValueList = (attributeId, mode) =>
  useQuery(
    ["attributevaluelist", attributeId],
    () =>
      request
        .get(`v1/product/attribute_value/?attribute=${attributeId}`)
        .then((res) => res.data),
    {
      enabled: !!attributeId,
    }
  );
