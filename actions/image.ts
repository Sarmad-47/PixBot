"use server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Replicate from "replicate";
import { v2 as cloudinary } from "cloudinary";
import { nanoid } from "nanoid";
import { currentUser } from "@clerk/nextjs/server";
import db from "@/utils/db";
import Image from "@/models/image";
import Credit from "@/models/credit";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function generateImageAi(imagePrompt: string) {
  // to redirect user to login page if not authenticated
  auth.protect();

  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;
  const userName = user?.fullName;

  try {
    // connect to db
    await db();

    // 1. check if user has enough credits
    const userCredit = await Credit.findOne({ userEmail });
    if (!userCredit || userCredit.credits < 1) {
      return { success: false, _id: null, credits: userCredit?.credits };
    }

    // 2. reduce the credit by 1, if user has enough credits
    userCredit.credits -= 1;
    await userCredit.save();

    // generate image with ai
    const input = {
      prompt: imagePrompt,
      output_format: "png",
      output_quality: 80,
      aspect_ratio: "16:9",
    };

    // The model name from replicate that we are using
    const output: any = await replicate.run("black-forest-labs/flux-schnell", {
      input,
    });

    // convert the stream to a buffer

    const response = await fetch(output[0]);
    const buffer = await response.arrayBuffer();
    const nodeBuffer = Buffer.from(buffer);

    // upload the buffer to cloudinary

    const uploadResponse: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "ai_images",
          public_id: nanoid(), // generate a unique id for the image
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(nodeBuffer);
    });

    const cloudinaryUrl = uploadResponse.secure_url;

    console.log("Image uploaded to Cloudinary:", cloudinaryUrl);

    console.log(buffer);

    // save the image to db
    const image = await new Image({
      userEmail,
      userName,
      name: imagePrompt,
      url: cloudinaryUrl,
    }).save();

    return {
      success: true,
      _id: image._id,
      credits: userCredit.credits,
    };
  } catch (err: any) {
    throw new Error(err);
    redirect("/");
  }
}

// Function to get user images from the database with pagination
export const getUserImagesFromDb = async (page: number, limit: number) => {
  try {
    await db();
    // to fetch images of currently logged in user.
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    const [images, totalCount] = await Promise.all([
      Image.find({ userEmail }) // find images by user email
        .sort({ createdAt: -1 }) // sort by createdAt in descending order
        .skip((page - 1) * limit) // skip the number of images based on page and limit
        .limit(limit), // limit the number of images per page
      Image.countDocuments({ userEmail }),
    ]);

    return {
      images: JSON.parse(JSON.stringify(images)),
      totalCount,
    };
  } catch (err: any) {
    throw new Error(err);
  }
};

// Function to get a single image from the database by ID
export const getImageFromDb = async (_id: string) => {
  try {
    await db();

    const image = await Image.findById(_id);
    return JSON.parse(JSON.stringify(image));
  } catch (err: any) {
    throw new Error(err);
  }
};

// Function to get latest images from the database
export const getLatestImages = async (limit: number = 12) => {
  try {
    await db();

    const images = await Image.find({})
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .limit(limit); // Limit the number of results

    return JSON.parse(JSON.stringify(images));
  } catch (err: any) {
    console.error("Error fetching latest images:", err);
    throw new Error(err);
  }
};
