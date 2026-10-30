import Image from "next/image";

export default function MDXImage({ alt, ...props }) {
  return <Image {...props} alt={alt} />;
}