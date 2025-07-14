import Image from "next/image";

interface AlbumCoverProps {
  src: string;
  alt: string;
  isBlurred: boolean;
}

export default function AlbumCover({ src, alt, isBlurred }: AlbumCoverProps) {
  return (
    <div className="relative aspect-square m-4 rounded-xl overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover transition-all duration-700 ${
          isBlurred ? "filter blur-2xl" : "filter blur-none"
        }`}
      />
    </div>
  );
}
