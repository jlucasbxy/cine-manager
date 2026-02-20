import { useEffect, useState } from "react";

interface ImageFileProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  file: File;
}

export function ImageFile({ file, ...props }: ImageFileProps) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!src) return null;
  return <img src={src} {...props} />;
}
