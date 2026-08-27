import { supabase, isSupabaseConfigured } from "./supabaseClient";
import fs from "fs";
import path from "path";

export interface VerificationCode {
  code: string;
  expiresAt: number;
}

export interface AuthStore {
  ownerEmail: string;
  adminPassword: string;
  verificationCode?: VerificationCode | null;
}

const DEFAULT_AUTH: AuthStore = {
  ownerEmail: "ijasiqbal02@gmail.com",
  adminPassword: process.env.ADMIN_PASSWORD || "ijas2311",
  verificationCode: null,
};

const ROW_ID = 1;
const AUTH_FILE = path.join(process.cwd(), "secure_auth.json");

export async function getAuthStore(): Promise<AuthStore> {
  if (!isSupabaseConfigured) {
    try {
      if (fs.existsSync(AUTH_FILE)) {
        const fileData = fs.readFileSync(AUTH_FILE, "utf-8");
        const parsed = JSON.parse(fileData);
        return {
          ownerEmail: parsed.ownerEmail || DEFAULT_AUTH.ownerEmail,
          adminPassword: parsed.adminPassword || DEFAULT_AUTH.adminPassword,
          verificationCode: parsed.verificationCode || null,
        };
      }
    } catch (e) {
      console.error("Failed to read secure_auth.json fallback:", e);
    }
    return DEFAULT_AUTH;
  }

  try {
    const { data, error } = await supabase
      .from("auth_store")
      .select("owner_email, admin_password, verification_code")
      .eq("id", ROW_ID)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      // First run: seed the row with defaults.
      await saveAuthStore(DEFAULT_AUTH);
      return DEFAULT_AUTH;
    }

    return {
      ownerEmail: data.owner_email || DEFAULT_AUTH.ownerEmail,
      adminPassword: data.admin_password || DEFAULT_AUTH.adminPassword,
      verificationCode: data.verification_code || null,
    };
  } catch (error) {
    console.error("Error reading auth_store from Supabase:", error);
    return DEFAULT_AUTH;
  }
}

export async function saveAuthStore(store: AuthStore): Promise<boolean> {
  if (!isSupabaseConfigured) {
    try {
      fs.writeFileSync(AUTH_FILE, JSON.stringify(store, null, 2), "utf-8");
      return true;
    } catch (e) {
      console.error("Failed to save to secure_auth.json fallback:", e);
      return false;
    }
  }

  try {
    const { error } = await supabase.from("auth_store").upsert({
      id: ROW_ID,
      owner_email: store.ownerEmail,
      admin_password: store.adminPassword,
      verification_code: store.verificationCode ?? null,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error saving auth_store to Supabase:", error);
    return false;
  }
}
