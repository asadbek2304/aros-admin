import request from "configs/request";
import { useState } from "react";
import { useMutation } from "react-query";

export const useFileUpload = () => {
  const [progress, setProgress] = useState(0);

  const uploadObj = useMutation((data) =>
    request
      .post("v1/file/", data, {
        onUploadProgress: (event) =>
          setProgress(Math.floor((event.loaded * 100) / event.total)),
      })
      .then((res) => res.data)
  );

  return { ...uploadObj, progress };
};
