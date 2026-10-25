import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hwdhbzazwxjjgnufgpab.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZGhiemF6d3hqamdudWZncGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MDAxOTEsImV4cCI6MjEwODQ3NjE5MX0._tZoGxdbR3D7scz2udSrqJLDIMAYoHOsp8MVwqB7x-g";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
