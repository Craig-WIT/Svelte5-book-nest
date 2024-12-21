import type { PageLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async ({ parent, params }) => {
  const { supabase } = await parent();
  const { bookId } = params;

  const { data } = await supabase
    .from("books")
    .select("*")
    .eq("id", bookId)
    .single();

  if (data) {
    return { book: data };
  }

  error(404, "Book not found");
};
