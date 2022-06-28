import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useFileUpload } from "services/use-file-upload";

export const ImageUpload = ({ onChange, children, previous }) => {
  const inputRef = useRef(null);
  const { mutate, isLoading, progress } = useFileUpload();
  const [preview, setPreview] = useState(previous);

  useEffect(() => {
    setPreview(previous);
  }, [previous]);

  const handleClick = () => inputRef.current?.click();

  const handleUpload = (e) => {
    const { files } = e.target;

    if (files?.length) {
      const imagesForm = new FormData();

      [...files].forEach((file) => {
        if (file) {
          setPreview(URL.createObjectURL(file));
          imagesForm.append("file", file, file.name);
        }
      });

      mutate(imagesForm, {
        onSuccess: (res) => {
          onChange(res.id);
        },
      });
    }
  };

  const handleDelete = () => {
    onChange(undefined);
    setPreview(undefined);
  };

  return (
    <div>
      <input
        ref={inputRef}
        onChange={handleUpload}
        type="file"
        accept="image/png, image/jpg, image/jpeg"
        hidden
      />
      {children({ handleClick, isLoading, progress, preview, handleDelete })}
    </div>
  );
};

export default ImageUpload;
