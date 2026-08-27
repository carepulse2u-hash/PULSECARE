const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function signSession(password: string): Promise<string> {
  const expires = Date.now() + SESSION_DURATION;
  const payload = `admin:${expires}`;
  
  const encoder = new TextEncoder();
  const keyData = encoder.encode(password);
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );
  
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const signatureHex = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return `${payload}.${signatureHex}`;
}

export async function verifySession(token: string, password: string): Promise<boolean> {
  if (!token) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    
    const [payload, signatureHex] = parts;
    const [user, expiresStr] = payload.split(":");
    if (user !== "admin") return false;
    
    const expires = parseInt(expiresStr, 10);
    if (isNaN(expires) || Date.now() > expires) return false;
    
    const encoder = new TextEncoder();
    const keyData = encoder.encode(password);
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    
    const hexMatch = signatureHex.match(/.{1,2}/g);
    if (!hexMatch) return false;
    const sigBytes = new Uint8Array(hexMatch.map(byte => parseInt(byte, 16)));
    
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      encoder.encode(payload)
    );
    
    return isValid;
  } catch (error) {
    console.error("Session verification error:", error);
    return false;
  }
}
