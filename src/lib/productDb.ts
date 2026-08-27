import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { productData, ProductConfig, OfferCountdownDuration } from "../config/product";
import fs from "fs";
import path from "path";

const PRODUCT_FILE = path.join(process.cwd(), "product.json");

export interface FullProductConfig extends ProductConfig {
  offerCountdownDuration: OfferCountdownDuration;
  offerCountdownDays: number;
  offerCountdownHours: number;
  offerCountdownMinutes: number;
  offerCountdownStartedAt: number;
  offerCountdownDurationSeconds: number;
  contact: {
    email: string;
    phone: string;
    hours: string;
    address: string;
    location: string;
  };
}

const defaultFullConfig: FullProductConfig = {
  ...productData,
  offerCountdownDuration: productData.offerCountdownDuration ?? { days: 2, hours: 5, minutes: 45 },
  offerCountdownDays: productData.offerCountdownDays ?? 2,
  offerCountdownHours: productData.offerCountdownHours ?? 5,
  offerCountdownMinutes: productData.offerCountdownMinutes ?? 45,
  offerCountdownStartedAt: productData.offerCountdownStartedAt ?? Date.now(),
  offerCountdownDurationSeconds: productData.offerCountdownDurationSeconds ?? ((2 * 24 * 3600) + (5 * 3600) + (45 * 60)),
  contact: {
    email: "carepulse2u@gmail.com",
    phone: "+91 98464 21122",
    hours: "Mon - Sat, 10 AM - 6 PM",
    address: "101 PulseCare Towers, Health Tech Park, Mumbai, Maharashtra 400001",
    location: "Mumbai, India"
  }
};

const ROW_ID = 1;

export async function getProductConfig(): Promise<FullProductConfig> {
  if (!isSupabaseConfigured) {
    try {
      if (fs.existsSync(PRODUCT_FILE)) {
        const fileContent = fs.readFileSync(PRODUCT_FILE, "utf-8");
        const parsed = JSON.parse(fileContent);
        return {
          ...defaultFullConfig,
          ...parsed,
          offerCountdownDuration: {
            ...defaultFullConfig.offerCountdownDuration,
            ...(parsed.offerCountdownDuration || {})
          },
          images: {
            ...defaultFullConfig.images,
            ...(parsed.images || {})
          },
          contact: {
            ...defaultFullConfig.contact,
            ...(parsed.contact || {})
          }
        };
      }
    } catch (e) {
      console.error("Failed to read product.json fallback:", e);
    }
    return defaultFullConfig;
  }

  try {
    const { data, error } = await supabase
      .from("product_config")
      .select("data")
      .eq("id", ROW_ID)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      await saveProductConfig(defaultFullConfig);
      return defaultFullConfig;
    }

    const parsed = data.data || {};

    return {
      ...defaultFullConfig,
      ...parsed,
      offerCountdownDuration: {
        ...defaultFullConfig.offerCountdownDuration,
        ...(parsed.offerCountdownDuration || {})
      },
      images: {
        ...defaultFullConfig.images,
        ...(parsed.images || {})
      },
      contact: {
        ...defaultFullConfig.contact,
        ...(parsed.contact || {})
      }
    };
  } catch (error) {
    console.error("Failed to read product_config from Supabase, returning defaults:", error);
    return defaultFullConfig;
  }
}

export async function saveProductConfig(data: FullProductConfig): Promise<boolean> {
  if (!isSupabaseConfigured) {
    try {
      fs.writeFileSync(PRODUCT_FILE, JSON.stringify(data, null, 2), "utf-8");
      return true;
    } catch (e) {
      console.error("Failed to save product.json fallback:", e);
      return false;
    }
  }

  try {
    const { error } = await supabase.from("product_config").upsert({
      id: ROW_ID,
      data,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Failed to write product_config to Supabase:", error);
    return false;
  }
}
