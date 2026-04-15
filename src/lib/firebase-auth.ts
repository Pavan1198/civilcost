import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import type { User } from "@/context/AuthContext";
import { firebaseAuth } from "@/lib/firebase";

export async function signInWithGoogle(): Promise<User | null> {
  if (!firebaseAuth) {
    return null;
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  const result = await signInWithPopup(firebaseAuth, provider);
  const googleUser = result.user;

  return {
    name:
      googleUser.displayName ||
      googleUser.email?.split("@")[0] ||
      "CivilCost User",
    email: googleUser.email || undefined,
    phone: googleUser.phoneNumber || undefined,
    location: "India",
    userType: "household",
  };
}
