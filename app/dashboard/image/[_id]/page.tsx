// app/dashboard/image/[_id]/page.tsx
import { getImageFromDb } from "@/actions/image";
import Image from "next/image";
import ImageEditButtons from "@/components/image/image-edit-buttons";

export default async function ImagePage({
  params,
}: {
  params: Promise<{ _id: string }>;
}) {
  const { _id } = await params; // <-- important
  const image = await getImageFromDb(_id);

  return (
    <div className="flex flex-col max-w-4xl mx-auto justify-center items-center p-4">
      <div className="relative w-full h-[60vh] mb-8">
        <Image
          src={image.url}
          alt={image.name}
          fill
          sizes="(max-width: 768px) 100vw, 1024px"
          className="rounded-lg object-contain"
        />
      </div>
      <ImageEditButtons image={image} />
    </div>
  );
}
