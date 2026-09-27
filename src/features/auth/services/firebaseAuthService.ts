import {
  GoogleAuthProvider,
  OAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut,
  type ConfirmationResult,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export interface FirebaseSocialIdentity {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoUrl: string | null;
}

function mapFirebaseUser(user: { uid: string; email: string | null; displayName: string | null; photoURL: string | null }): FirebaseSocialIdentity {
  return { uid: user.uid, email: user.email, displayName: user.displayName, photoUrl: user.photoURL };
}

export async function signInWithGooglePopup(): Promise<FirebaseSocialIdentity> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const result = await signInWithPopup(auth, provider);
  return mapFirebaseUser(result.user);
}

export async function signInWithApplePopup(): Promise<FirebaseSocialIdentity> {
  const provider = new OAuthProvider("apple.com");
  provider.addScope("email");
  provider.addScope("name");
  const result = await signInWithPopup(auth, provider);
  return mapFirebaseUser(result.user);
}

let recaptchaVerifier: RecaptchaVerifier | null = null;

function getRecaptchaVerifier(containerId: string): RecaptchaVerifier {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, { size: "invisible" });
  }
  return recaptchaVerifier;
}

export async function sendPhoneVerificationCode(fullPhoneNumber: string, recaptchaContainerId: string): Promise<ConfirmationResult> {
  const verifier = getRecaptchaVerifier(recaptchaContainerId);
  return signInWithPhoneNumber(auth, fullPhoneNumber, verifier);
}

export function resetRecaptcha(): void {
  recaptchaVerifier?.clear();
  recaptchaVerifier = null;
}

export async function confirmPhoneCode(confirmationResult: ConfirmationResult, code: string): Promise<string> {
  const credential = await confirmationResult.confirm(code);
  return credential.user.uid;
}

/** Never throws — sign-out failure shouldn't block app logout. */
export async function signOutFromFirebase(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("[Firebase Auth] signOut failed:", error);
  }
}
