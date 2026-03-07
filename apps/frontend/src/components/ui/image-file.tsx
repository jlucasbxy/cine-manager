import { useEffect, useState } from "react";

interface ImageFileProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  file: File;
}

export function ImageFile({ file, alt = "", ...props }: ImageFileProps) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!src) return null;
  return <img src={src} alt={alt} {...props} />;
}
