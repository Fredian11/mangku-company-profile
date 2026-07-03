// // ==========================================
// // Konfigurasi Supabase
// // ==========================================

// const SUPABASE_URL = "https://qrnggmbgctenaeoqcpym.supabase.co";
// const SUPABASE_ANON_KEY = "sb_publishable_wo8TwONjSAlZAOARdczzkw_Et1mCECS";
// if (!window.__supabaseClient) {
//   window.__supabaseClient = window.supabase.createClient(
//     SUPABASE_URL,
//     SUPABASE_ANON_KEY,
//   );
// }

// var supabase = window.__supabaseClient;

// console.log("✅ Supabase Connected");

/* ============================================================
   SUPABASE CONFIGURATION
============================================================ */

// URL Project Supabase
const SUPABASE_URL = "https://qrnggmbgctenaeoqcpym.supabase.co";

// Publishable (Anon) Key Supabase
const SUPABASE_ANON_KEY = "sb_publishable_wo8TwONjSAlZAOARdczzkw_Et1mCECS";

/* ============================================================
   CREATE SUPABASE CLIENT
============================================================ */

if (!window.__supabaseClient) {
  window.__supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
  );
}

/* ============================================================
   GLOBAL DATABASE CLIENT
============================================================ */

window.db = window.__supabaseClient;

/* ============================================================
   CONNECTION TEST
============================================================ */

console.log("✅ Supabase Connected");
