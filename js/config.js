// ==========================================
// Konfigurasi Supabase
// ==========================================

// Ganti dengan Project URL dari Supabase
const SUPABASE_URL = "https://qrnggmbgctenaeoqcpym.supabase.co";

// Ganti dengan Publishable Key dari Supabase
const SUPABASE_ANON_KEY = "sb_publishable_wo8TwONjSAlZAOARdczzkw_Et1mCECS";

// Membuat koneksi ke Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("✅ Supabase Connected");
