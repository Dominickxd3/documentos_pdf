import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-10">
      <h1 className="text-2xl font-bold">Documentos PDF</h1>
      <p className="text-neutral-600">Grupo Pecuario S.A.C.</p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/documentos/cargo-laptop"
          className="rounded bg-black px-4 py-2 text-white"
        >
          Ver cargo laptop
        </Link>
        <a href="/api/pdf" className="rounded border border-black px-4 py-2">
          Descargar PDF
        </a>
      </div>
      <p className="max-w-md text-center text-sm text-neutral-500">
        Coloca el logo oficial en <code className="text-xs">public/logo.png</code>
      </p>
    </main>
  );
}
