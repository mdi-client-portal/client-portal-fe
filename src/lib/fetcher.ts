export const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json() as Promise<T>;
};

export const fetcherWithAuth = async <T>(
  url: string,
  token?: string
): Promise<T> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    headers,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
};

// Fetcher yang menggunakan NextAuth JWT token
export const fetcherWithNextAuthToken = async <T>(
  url: string,
  session: any
): Promise<T> => {
  const { getToken } = await import("next-auth/jwt");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Gunakan JWT token dari NextAuth sebagai Bearer token
  if (session?.user?.id) {
    // Buat JWT payload berdasarkan data user
    const jwtPayload = {
      sub: session.user.id,
      email: session.user.email,
      name: session.user.name,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 jam
    };

    // Encode JWT token (simplified, untuk production gunakan library proper)
    const token = Buffer.from(JSON.stringify(jwtPayload)).toString("base64");
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    headers,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
};
