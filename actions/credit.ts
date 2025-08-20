"use server";
import Credit from "@/models/credit";
import db from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";

export const saveCreditToDb = async (amount: number, credits: number) => {
  try {
    await db();
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    // check if the user already has a credit record
    const existingCredit = await Credit.findOne({ userEmail });

    if (existingCredit) {
      // add to the existing credit
      existingCredit.amount += amount;
      existingCredit.credits += credits;
      await existingCredit.save();

      return JSON.parse(JSON.stringify(existingCredit));
    } else {
      // create
      const newCredit = await new Credit({
        userEmail,
        amount,
        credits,
      });

      await newCredit.save();

      return JSON.parse(JSON.stringify(newCredit));
    }
  } catch (error) {
    console.log("🔴 SAVE CREDIT TO DB ERR => ", error);
  }
};

export const getUserCreditsFromDb = async () => {
  try {
    await db();
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    const credit = await Credit.findOne({ userEmail });

    return JSON.parse(JSON.stringify(credit));
  } catch (error) {
    console.log("🔴 GET USER CREDITS ERR => ", error);
  }
};

// New signup users will be created with 5 credits
// This function checks if a user has a credit record, if not, it creates one with 5 credits
export const checkCreditRecordDb = async () => {
  try {
    await db();
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    const credit = await Credit.findOne({ userEmail });
    if (!credit) {
      const newCredit = await new Credit({
        userEmail,
        amount: 0,
        credits: 5,
      });
      await newCredit.save();
    }
  } catch (err: any) {
    console.log("🔴 CHECK CREDIT RECORD ERR => ", err);
    throw new Error(err);
  }
};
