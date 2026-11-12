
/* RDCA - CONEXIÓN A SUPABASE */

const SUPABASE_URL = "https://eixmhivpooqudwpfikdr.supabase.co";

const SUPABASE_PUBLIC_KEY = "sb_publishable_9_X4OpEi082dQyaUB_FC1w_qhbDBBDJ";

if (!window.supabase) {
    console.error("ERROR: La librería Supabase no cargó.");
} else {
    window.rdcaSupabase = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLIC_KEY
    );

    console.log("Cliente Supabase inicializado");
}
