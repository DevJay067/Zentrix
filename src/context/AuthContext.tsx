import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../lib/firebase";

export type UserRole = "client" | "freelancer";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  designation?: string;
  organization?: string;
  phone?: string;
  walletAddress?: string;
  industryTags?: string[];
  expertise?: string[];
  isOnboarded: boolean;
  isWalletBound: boolean;
}

export interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  currentRole: UserRole | null;
  loginWithGoogle: () => Promise<FirebaseUser | null>;
  loginWithEmail: (email: string, pass: string) => Promise<FirebaseUser | null>;
  registerWithEmail: (email: string, pass: string) => Promise<FirebaseUser | null>;
  logout: () => Promise<void>;
  updateRole: (role: UserRole) => void;
  saveOnboarding: (data: Partial<UserProfile>, role: UserRole, walletAddress: string) => Promise<void>;
  bindWallet: (walletAddress: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", fbUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data() as UserProfile;
            setProfile(data);
            setCurrentRole(data.role || "freelancer");
          } else {
            setProfile(null);
            setCurrentRole(null);
          }
        } catch (e) {
          console.error("Error fetching user profile:", e);
        }
      } else {
        setProfile(null);
        setCurrentRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      return res.user;
    } catch (e) {
      console.error("Google sign in failed:", e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      return res.user;
    } catch (e) {
      console.error("Email login failed:", e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      return res.user;
    } catch (e) {
      console.error("Registration failed:", e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setProfile(null);
    setCurrentRole(null);
  };

  const updateRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const saveOnboarding = async (data: Partial<UserProfile>, role: UserRole, walletAddress: string) => {
    if (!user) throw new Error("Must be logged in to onboard");

    const newProfile: UserProfile = {
      uid: user.uid,
      name: data.name || user.displayName || "Anonymous User",
      email: user.email || data.email || "",
      role: role,
      designation: data.designation || "",
      organization: data.organization || "",
      phone: data.phone || "",
      walletAddress: walletAddress.toLowerCase(),
      industryTags: data.industryTags || [],
      expertise: data.expertise || [],
      isOnboarded: true,
      isWalletBound: true,
    };

    // Save to users/{uid}
    await setDoc(doc(db, "users", user.uid), newProfile, { merge: true });

    // Save to role collection: clients/{uid} or freelancers/{uid}
    const roleCollection = role === "client" ? "clients" : "freelancers";
    await setDoc(
      doc(db, roleCollection, user.uid),
      {
        public: {
          uid: user.uid,
          name: newProfile.name,
          designation: newProfile.designation,
          organization: newProfile.organization,
          industryTags: newProfile.industryTags,
          expertise: newProfile.expertise,
          walletAddress: newProfile.walletAddress,
        },
        private: {
          email: newProfile.email,
          phone: newProfile.phone,
        },
      },
      { merge: true }
    );

    // Save wallet mapping: wallets/{address} -> uid
    await setDoc(
      doc(db, "wallets", walletAddress.toLowerCase()),
      { uid: user.uid, boundAt: Date.now() },
      { merge: true }
    );

    setProfile(newProfile);
    setCurrentRole(role);
  };

  const bindWallet = async (walletAddress: string) => {
    if (!user) throw new Error("User not logged in");
    await setDoc(
      doc(db, "users", user.uid),
      { walletAddress: walletAddress.toLowerCase(), isWalletBound: true },
      { merge: true }
    );
    if (profile) {
      setProfile({ ...profile, walletAddress: walletAddress.toLowerCase(), isWalletBound: true });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        currentRole,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        updateRole,
        saveOnboarding,
        bindWallet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
