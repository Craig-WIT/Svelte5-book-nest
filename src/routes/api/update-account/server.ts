import { SUPABASE_SERVICE_ROLE_KEY } from "$env/static/private";
import { PUBLIC_SUPABASE_URL } from "$env/static/public";
import { json, type RequestHandler } from "@sveltejs/kit";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "$lib/types/database.types";

export const PATCH: RequestHandler = async ({ request }) => {
  const supabaseAdmin = createClient<Database>(
    PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
  );

  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return json({ error: "No valid auth token" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
  } catch (error) {}
};
