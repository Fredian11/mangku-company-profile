// ==========================================
// Konfigurasi Supabase
// ==========================================

// Ganti dengan Project URL dari Supabase
const SUPABASE_URL = "https://qrnggmbgctenaeoqcpym.supabase.co";

// Ganti dengan Publishable Key dari Supabase
const SUPABASE_ANON_KEY = "sb_publishable_wo8TwONjSAlZAOARdczzkw_Et1mCECS";

// Membuat koneksi ke Supabase
// FIX: Gunakan window.__supabaseClient sebagai guard agar aman
// dieksekusi berkali-kali (Live Server hot-reload / module re-inject)
// tanpa melempar "Identifier 'supabase' has already been declared".
window.__supabaseClient =
  window.__supabaseClient ||
  window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const supabase = window.__supabaseClient;

console.log("✅ Supabase Connected");
