import Link from "next/link";

export default function Offline() {
  return (
    <div className="flex-1 grid place-items-center px-6 py-20 text-center">
      <div>
        <div className="text-6xl mb-4">📡</div>
        <h1 className="font-display text-4xl text-gold-gradient">SIN CONEXIÓN</h1>
        <p className="text-white/60 mt-2 max-w-sm mx-auto">
          Parece que no tienes internet. Tu cuadro está guardado en este
          dispositivo; cuando vuelvas a tener señal, todo sigue aquí.
        </p>
        <Link
          href="/jugar"
          className="inline-block mt-6 rounded-full bg-gold text-black font-bold px-6 py-3 hover:brightness-110 transition"
        >
          Reintentar
        </Link>
      </div>
    </div>
  );
}
