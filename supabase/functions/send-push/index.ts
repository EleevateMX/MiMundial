// Edge Function: send-push
// Envía notificaciones Web Push a los miembros de una liga.
//
// Despliegue:
//   supabase functions deploy send-push
// Secrets (genera las llaves con: npx web-push generate-vapid-keys):
//   supabase secrets set VAPID_PUBLIC_KEY=... VAPID_PRIVATE_KEY=... \
//     VAPID_SUBJECT=mailto:tu@correo.com
// (SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY ya existen en el entorno de la función.)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const VAPID_PUBLIC = Deno.env.get("VAPID_PUBLIC_KEY") ?? "";
const VAPID_PRIVATE = Deno.env.get("VAPID_PRIVATE_KEY") ?? "";
const SUBJECT = Deno.env.get("VAPID_SUBJECT") ?? "mailto:admin@mimundial.app";

if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webpush.setVapidDetails(SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const { leagueId, title, body, url, excludeUser } = await req.json();

    const { data: members } = await supabase
      .from("league_members")
      .select("user_id")
      .eq("league_id", leagueId);

    const ids = (members ?? [])
      .map((m: { user_id: string }) => m.user_id)
      .filter((id: string) => id !== excludeUser);

    if (ids.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), { headers: cors });
    }

    const { data: subs } = await supabase
      .from("push_subscriptions")
      .select("data")
      .in("user_id", ids);

    const payload = JSON.stringify({
      title: title ?? "Mi Mundial",
      body: body ?? "",
      url: url ?? "/jugar",
    });

    const results = await Promise.allSettled(
      (subs ?? []).map((s: { data: unknown }) =>
        webpush.sendNotification(s.data, payload)
      )
    );

    return new Response(
      JSON.stringify({ sent: results.filter((r) => r.status === "fulfilled").length }),
      { headers: { ...cors, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: cors,
    });
  }
});
