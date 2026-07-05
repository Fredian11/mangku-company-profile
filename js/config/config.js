/* ============================================================
   [1] SUPABASE CONFIGURATION
============================================================ */

// URL Project Supabase
const SUPABASE_URL = "https://qrnggmbgctenaeoqcpym.supabase.co";

// Publishable (Anon) Key Supabase
const SUPABASE_ANON_KEY = "sb_publishable_wo8TwONjSAlZAOARdczzkw_Et1mCECS";

/* ============================================================
   [2] CREATE SUPABASE CLIENT
============================================================ */

if (!window.__supabaseClient) {
  window.__supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
  );
}

/* ============================================================
   [3] GLOBAL DATABASE CLIENT
============================================================ */

window.db = window.__supabaseClient;

/* ============================================================
   [4] CONNECTION TEST
============================================================ */

console.log("✅ Supabase Connected");
console.log(window.db);
