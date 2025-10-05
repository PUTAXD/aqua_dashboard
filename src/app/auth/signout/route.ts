import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options);
            } catch {
              // Ignore if set is called from non-mutable context
            }
          });
        },
      },
    }
  );

  await supabase.auth.signOut();

  // 🔥 Redirect + hapus cookie
  const response = NextResponse.redirect(new URL("/login", req.url!));
  response.cookies.set("sb-access-token", "", { path: "/", maxAge: 0 });
  response.cookies.set("sb-refresh-token", "", { path: "/", maxAge: 0 });
  return response;
}
