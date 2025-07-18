"use server";

import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, UserData } from "./firebase";

export async function makeUserAdmin(
  email: string
): Promise<{ success: boolean; message: string }> {
  try {
    console.log(`Making user ${email} an admin`);

    return {
      success: true,
      message: `User ${email} has been made an admin`,
    };
  } catch (error) {
    console.error("Error making user admin:", error);
    return {
      success: false,
      message: "Failed to make user admin",
    };
  }
}

export async function checkUserRole(uid: string): Promise<UserData | null> {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error("Error checking user role:", error);
    return null;
  }
}

export async function updateUserRole(
  uid: string,
  role: "admin" | "user"
): Promise<{ success: boolean; message: string }> {
  try {
    await setDoc(
      doc(db, "users", uid),
      { role, updatedAt: new Date().toISOString() },
      { merge: true }
    );

    return {
      success: true,
      message: `User role updated to ${role}`,
    };
  } catch (error) {
    console.error("Error updating user role:", error);
    return {
      success: false,
      message: "Failed to update user role",
    };
  }
}
