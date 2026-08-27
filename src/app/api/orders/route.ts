import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { getProductConfig } from "@/lib/productDb";
import fs from "fs";
import path from "path";

const ORDERS_FILE = path.join(process.cwd(), "orders.json");

function getLocalOrders() {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, "utf-8");
      return JSON.parse(data) || [];
    }
  } catch (e) {
    console.error("Failed to read local orders.json:", e);
  }
  return [];
}

function saveLocalOrders(orders: any[]) {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
    return true;
  } catch (e) {
    console.error("Failed to write local orders.json:", e);
    return false;
  }
}

export async function GET() {
  if (!isSupabaseConfigured) {
    const orders = getLocalOrders();
    return NextResponse.json({ success: true, orders });
  }

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;

    // Map DB rows (snake_case) back to the same shape the dashboard already expects.
    const orders = (data || []).map((row: any) => ({
      orderId: row.order_id,
      name: row.name,
      phone: row.phone,
      address: row.address,
      pincode: row.pincode,
      city: row.city,
      state: row.state,
      qty: row.qty,
      totalPrice: row.total_price,
      paymentMethod: row.payment_method,
      paymentStatus: row.payment_status,
      status: row.status,
      createdAt: row.created_at,
    }));

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("Supabase GET orders error, falling back to local:", error);
    const orders = getLocalOrders();
    return NextResponse.json({ success: true, orders });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, address, pincode, city, state, qty, paymentMethod } = body;

    // Strict Input Validation & Sanitization
    const sanitizedName = typeof name === "string" ? name.trim().slice(0, 100) : "";
    const sanitizedPhone = typeof phone === "string" ? phone.trim().replace(/\D/g, "").slice(0, 15) : "";
    const sanitizedAddress = typeof address === "string" ? address.trim().slice(0, 300) : "";
    const sanitizedPincode = typeof pincode === "string" ? pincode.trim().replace(/\D/g, "").slice(0, 6) : "";
    const sanitizedCity = typeof city === "string" ? city.trim().slice(0, 100) : "";
    const sanitizedState = typeof state === "string" ? state.trim().slice(0, 100) : "";

    if (!sanitizedName || !sanitizedPhone || !sanitizedAddress || !sanitizedPincode || !qty) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (sanitizedPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: "Invalid 10-digit mobile number" },
        { status: 400 }
      );
    }

    if (sanitizedPincode.length !== 6) {
      return NextResponse.json(
        { success: false, error: "Invalid 6-digit pincode" },
        { status: 400 }
      );
    }

    const quantity = parseInt(qty, 10);
    if (isNaN(quantity) || quantity < 1 || quantity > 50) {
      return NextResponse.json(
        { success: false, error: "Invalid quantity (must be between 1 and 50)" },
        { status: 400 }
      );
    }

    const productConfig = await getProductConfig();
    const pricePerUnit = typeof productConfig.price === "number" ? productConfig.price : 1499;
    const totalPrice = pricePerUnit * quantity;
    const isOnline = paymentMethod?.toLowerCase().includes("online");

    if (!isSupabaseConfigured) {
      const localOrders = getLocalOrders();
      let maxNum = 1000;
      for (const ord of localOrders) {
        if (ord.orderId) {
          const num = parseInt(String(ord.orderId).split("-")[1], 10);
          if (!isNaN(num) && num > maxNum) {
            maxNum = num;
          }
        }
      }
      const orderId = `PC-${maxNum + 1}`;
      const newOrder = {
        orderId,
        name: sanitizedName,
        phone: sanitizedPhone,
        address: sanitizedAddress,
        pincode: sanitizedPincode,
        city: sanitizedCity,
        state: sanitizedState,
        qty: quantity,
        totalPrice,
        paymentMethod: paymentMethod || "Cash on Delivery (COD)",
        paymentStatus: isOnline ? "Paid" : "Pending COD",
        status: isOnline ? "Confirmed" : "Pending",
        createdAt: new Date().toISOString(),
      };
      localOrders.push(newOrder);
      saveLocalOrders(localOrders);

      return NextResponse.json(
        { success: true, order: newOrder },
        { status: 201 }
      );
    }

    // Generate order ID like PC-1001 based on the highest existing order number.
    const { data: lastOrders, error: lastOrderError } = await supabase
      .from("orders")
      .select("order_id")
      .order("id", { ascending: false })
      .limit(1);

    if (lastOrderError) throw lastOrderError;

    let nextId = 1001;
    const lastOrder = lastOrders && lastOrders[0];
    if (lastOrder && lastOrder.order_id) {
      const lastNum = parseInt(String(lastOrder.order_id).split("-")[1], 10);
      if (!isNaN(lastNum)) {
        nextId = lastNum + 1;
      }
    }

    const orderId = `PC-${nextId}`;

    const newOrder = {
      order_id: orderId,
      name: sanitizedName,
      phone: sanitizedPhone,
      address: sanitizedAddress,
      pincode: sanitizedPincode,
      city: sanitizedCity,
      state: sanitizedState,
      qty: quantity,
      total_price: totalPrice,
      payment_method: paymentMethod || "Cash on Delivery (COD)",
      payment_status: isOnline ? "Paid" : "Pending COD",
      status: isOnline ? "Confirmed" : "Pending",
      created_at: new Date().toISOString(),
    };

    const { error: insertError } = await supabase.from("orders").insert(newOrder);
    if (insertError) throw insertError;

    return NextResponse.json(
      {
        success: true,
        order: {
          orderId,
          name: sanitizedName,
          phone: sanitizedPhone,
          address: sanitizedAddress,
          pincode: sanitizedPincode,
          city: sanitizedCity,
          state: sanitizedState,
          qty: quantity,
          totalPrice,
          paymentMethod: newOrder.payment_method,
          paymentStatus: newOrder.payment_status,
          status: newOrder.status,
          createdAt: newOrder.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to place order" },
      { status: 500 }
    );
  }
}
