# Next.js Authentication Setup

## Overview

Aplikasi ini menggunakan NextAuth.js v5 dengan Credentials provider untuk mengautentikasi pengguna melalui API eksternal di localhost:5000.

## Setup

### 1. Environment Variables

Buat file `.env.local` di root project:

```bash
# NextAuth configuration
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# API configuration
API_BASE_URL=http://localhost:5000
API_LOGIN_ENDPOINT=/auth/login
```

### 2. API Requirements

API di localhost:5000 harus mengembalikan response dalam format:

```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name"
    // additional user properties...
  },
  "token": "jwt_token_or_access_token" // optional
}
```

### 3. Authentication Flow

1. User mengisi form login di `/login`
2. Form submit ke server action `authenticate`
3. NextAuth memanggil Credentials provider
4. Provider melakukan POST request ke `${API_BASE_URL}${API_LOGIN_ENDPOINT}`
5. Jika berhasil, user data disimpan dalam JWT session
6. User di-redirect ke halaman utama `/`

### 4. Session Management

- Session menggunakan JWT strategy
- User data disimpan dalam token dan tersedia di session
- Session dapat diakses dengan `auth()` pada server components
- Untuk sign out, gunakan `signOut()` dari NextAuth

### 5. Protected Routes

- Semua route kecuali `/login` memerlukan authentication
- Unauthenticated users akan di-redirect ke `/login`
- Authentication check dilakukan di middleware

### 6. Error Handling

API errors yang ditangani:

- 401: Invalid credentials
- 404: Authentication service not available
- ECONNREFUSED: Cannot connect to authentication service
- Timeout errors (10 detik)

## Files Structure

```
/auth.config.ts         # NextAuth configuration
/auth.ts               # NextAuth providers dan callbacks
/middleware.ts         # Route protection
/types/next-auth.d.ts  # TypeScript type extensions
/src/lib/actions.ts    # Server actions
/src/components/common/forms/loginForm.tsx # Login form component
```

## Usage

### Login Form

```tsx
import LoginForm from "@/components/common/forms/loginForm";

export default function LoginPage() {
  return <LoginForm />;
}
```

### Getting Session Data

```tsx
import { auth } from "../../../auth";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    return <div>Not authenticated</div>;
  }

  return <div>Welcome {session.user.email}!</div>;
}
```

### Sign Out

```tsx
import { signOut } from "../../../auth";

export default function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button type="submit">Sign Out</button>
    </form>
  );
}
```
