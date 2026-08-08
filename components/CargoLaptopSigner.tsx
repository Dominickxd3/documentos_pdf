"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CargoLaptop from "@/components/CargoLaptop";
import InlineSignature, {
  type InlineSignatureHandle,
} from "@/components/InlineSignature";
import FloatingToolbar, { Icons } from "@/components/FloatingToolbar";
import type { CargoLaptopData } from "@/lib/documentos/cargo-laptop";

type Props = {
  data: CargoLaptopData;
};

const ZOOM_MIN = 0.7;
const ZOOM_MAX = 1.4;
const ZOOM_STEP = 0.1;

export default function CargoLaptopSigner({ data }: Props) {
  const sigRef = useRef<InlineSignatureHandle>(null);

  const [firmaSrc, setFirmaSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const onHistoryChange = useCallback(
    (state: { canUndo: boolean; canRedo: boolean }) => {
      setCanUndo(state.canUndo);
      setCanRedo(state.canRedo);
    },
    [],
  );

  const undo = useCallback(() => {
    sigRef.current?.undo();
  }, []);

  const redo = useCallback(() => {
    sigRef.current?.redo();
  }, []);

  const clearSign = useCallback(() => {
    sigRef.current?.clear();
    setFirmaSrc(null);
    showToast("Firma borrada");
  }, [showToast]);

  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(ZOOM_MAX, Math.round((z + ZOOM_STEP) * 10) / 10));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((z) => Math.max(ZOOM_MIN, Math.round((z - ZOOM_STEP) * 10) / 10));
  }, []);

  const zoomReset = useCallback(() => setZoom(1), []);

  // Atajos Ctrl+Z / Ctrl+Y (como Word)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      const key = e.key.toLowerCase();
      if (key === "z" && !e.shiftKey) {
        e.preventDefault();
        sigRef.current?.undo();
      } else if (key === "y" || (key === "z" && e.shiftKey)) {
        e.preventDefault();
        sigRef.current?.redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const downloadPdf = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empresaNombre: data.empresa.nombre,
          empresaRuc: data.empresa.ruc,
          empresaDireccion: data.empresa.direccion,
          empresaTelefonos: data.empresa.telefonos,
          nombre: data.empleado.nombre,
          dni: data.empleado.dni,
          marca: data.equipo.marca,
          modelo: data.equipo.modelo,
          color: data.equipo.color,
          ram: data.equipo.ram,
          capacidad: data.equipo.capacidad,
          serie: data.equipo.serie,
          accesorios: data.equipo.accesorios,
          fecha: data.fecha,
          logoSrc: data.logoSrc,
          firma: firmaSrc ?? undefined,
        }),
      });

      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(j?.error ?? "No se pudo generar el PDF");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cargo-entrega-laptop.pdf";
      a.click();
      URL.revokeObjectURL(url);
      showToast("PDF descargado");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al descargar PDF");
    } finally {
      setLoading(false);
    }
  }, [data, firmaSrc, showToast]);

  const actions = useMemo(
    () => [
      {
        id: "undo",
        label: "Deshacer (Ctrl+Z)",
        icon: Icons.undo,
        onClick: undo,
        disabled: !canUndo,
      },
      {
        id: "redo",
        label: "Rehacer (Ctrl+Y)",
        icon: Icons.redo,
        onClick: redo,
        disabled: !canRedo,
      },
      {
        id: "clear",
        label: "Borrar firma",
        icon: Icons.eraser,
        onClick: clearSign,
        disabled: !firmaSrc && !canUndo,
        danger: true,
        dividerBefore: true,
      },
      {
        id: "zoom-out",
        label: "Alejar",
        icon: Icons.zoomOut,
        onClick: zoomOut,
        disabled: zoom <= ZOOM_MIN,
        dividerBefore: true,
      },
      {
        id: "zoom-reset",
        label: `Zoom ${Math.round(zoom * 100)}%`,
        icon: Icons.resetZoom,
        onClick: zoomReset,
        disabled: zoom === 1,
      },
      {
        id: "zoom-in",
        label: "Acercar",
        icon: Icons.zoomIn,
        onClick: zoomIn,
        disabled: zoom >= ZOOM_MAX,
      },
      {
        id: "download",
        label: loading ? "Generando…" : "Descargar PDF",
        icon: Icons.download,
        onClick: downloadPdf,
        loading,
        primary: true,
        dividerBefore: true,
      },
    ],
    [
      undo,
      redo,
      canUndo,
      canRedo,
      clearSign,
      firmaSrc,
      zoom,
      zoomIn,
      zoomOut,
      zoomReset,
      downloadPdf,
      loading,
    ],
  );

  return (
    <div className="relative min-h-screen pb-28 print:pb-0">
      <div
        data-no-print
        className="pointer-events-none fixed left-1/2 top-4 z-50 flex -translate-x-1/2 flex-col items-center gap-2 print:hidden"
      >
        {toast && (
          <p className="rounded-full bg-neutral-900/90 px-4 py-2 text-sm text-white shadow-lg">
            {toast}
          </p>
        )}
        {error && (
          <p className="rounded-full bg-red-600 px-4 py-2 text-sm text-white shadow-lg">
            {error}
          </p>
        )}
      </div>

      <div className="flex justify-center overflow-auto px-3 py-6 print:p-0">
        <div
          className="origin-top transition-transform duration-200 print:transform-none!"
          style={{
            transform: `scale(${zoom})`,
            marginBottom: zoom !== 1 ? `${(zoom - 1) * 297}mm` : undefined,
          }}
        >
          <CargoLaptop
            {...data}
            firmaSrc={firmaSrc ?? undefined}
            signatureSlot={
              <InlineSignature
                ref={sigRef}
                value={firmaSrc}
                onChange={setFirmaSrc}
                onHistoryChange={onHistoryChange}
              />
            }
          />
        </div>
      </div>

      <FloatingToolbar
        actions={actions}
        hint={
          canUndo
            ? undefined
            : "Firme sobre la línea · Deshacer / Rehacer por trazo"
        }
      />
    </div>
  );
}
