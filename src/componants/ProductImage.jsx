
import React, { useState } from "react";

const FALLBACK_IMAGE =
  "https://placehold.co/600x600/e0f2fe/334155?text=NikaCart";

const ProductImage = ({
  src,
  alt = "NikaCart Product",
  className = "",
}) => {
  const [failedSrc, setFailedSrc] = useState(null);

  const imageSrc =
    !src || failedSrc === src ? FALLBACK_IMAGE : src;

  return (
    <img
      src={imageSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailedSrc(src)}
      className={`h-full w-full object-contain ${className}`}
    />
  );
};

export default ProductImage;