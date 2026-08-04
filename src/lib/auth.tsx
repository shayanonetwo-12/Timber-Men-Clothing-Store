import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { toast } from "sonner";
import { getFirebaseAuth } from "./firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  displayName: string | null;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (email: string, password: string, name?: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function friendly(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/invalid-email":
      return "That email doesn't look right.";
    case "auth/missing-password":
      return "Please enter a password.";
    case "auth/weak-password":
      return "Choose a password of at least 6 characters.";
    case "auth/email-already-in-use":
      return "An account already exists for that email — sign in instead.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Those credentials don't match our records.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "Sign-in was cancelled.";
    case "auth/operation-not-allowed":
      return "That sign-in method isn't enabled for this project yet.";
    case "auth/unauthorized-domain":
      return "This domain isn't authorised in Firebase Auth settings.";
    default:
      return (err as Error)?.message ?? "Something went wrong. Please try again.";
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(getFirebaseAuth(), (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const signInEmail = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
      toast.success("Welcome back to the atelier.");
    } catch (err) {
      toast.error(friendly(err));
      throw err;
    }
  }, []);

  const signUpEmail = useCallback(async (email: string, password: string, name?: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
      if (name?.trim()) await updateProfile(cred.user, { displayName: name.trim() });
      setUser(getFirebaseAuth().currentUser);
      toast.success("Your wardrobe is open. Welcome to TIMBER.");
    } catch (err) {
      toast.error(friendly(err));
      throw err;
    }
  }, []);

  const signInGoogle = useCallback(async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(getFirebaseAuth(), provider);
      toast.success("Welcome back to the atelier.");
    } catch (err) {
      toast.error(friendly(err));
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    await fbSignOut(getFirebaseAuth());
    toast("Signed out — your wardrobe is saved.");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      displayName: user?.displayName || user?.email?.split("@")[0] || null,
      signInEmail,
      signUpEmail,
      signInGoogle,
      signOut,
    }),
    [user, loading, signInEmail, signUpEmail, signInGoogle, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
