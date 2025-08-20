import { getImageFromDb } from "@/actions/image";
import Image from "next/image";
import ImageEditButtons from "@/components/image/image-edit-buttons";

interface ImagePageProps {
  params: {
    _id: string;
  };
}

export default async function ImagePage({ params }: ImagePageProps) {
  const image = await getImageFromDb(params._id);

  return (
    <div className="flex flex-col max-w-4xl mx-auto justify-center items-center p-4">
      <div className="relative w-full h-[60vh] mb-8">
        <Image
          src={image.url}
          alt={image.name}
          layout="fill"
          className="rounded-lg object-contain"
        />
      </div>
      <div>
        <ImageEditButtons image={image} />
      </div>
    </div>
  );
}
