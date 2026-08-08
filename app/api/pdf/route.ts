import { NextRequest } from "next/server";
import puppeteer from "puppeteer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type PdfBody = {
  nombre?: string;
  dni?: string;
  marca?: string;
  modelo?: string;
  color?: string;
  ram?: string;
  capacidad?: string;
  serie?: string;
  accesorios?: string;
  fecha?: string;
};

function buildQuery(body: PdfBody): string {
  const params = new URLSearchParams();
  const keys: (keyof PdfBody)[] = [
    "nombre",
    "dni",
    "marca",
    "modelo",
    "color",
    "ram",
    "capacidad",
    "serie",
    "accesorios",
    "fecha",
  ];
  for (const key of keys) {
    const value = body[key];
    if (typeof value === "string" && value.length > 0) {
      params.set(key, value);
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function POST(request: NextRequest) {
  let body: PdfBody = {};
  try {
    body = (await request.json()) as PdfBody;
  } catch {
    body = {};
  }

  const origin = request.nextUrl.origin;
  const url = `${origin}/documentos/cargo-laptop${buildQuery(body)}`;

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    return new Response(Buffer.from(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="cargo-entrega-laptop.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error generando PDF";
    return Response.json({ error: message }, { status: 500 });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const body: PdfBody = {
    nombre: searchParams.get("nombre") ?? undefined,
    dni: searchParams.get("dni") ?? undefined,
    marca: searchParams.get("marca") ?? undefined,
    modelo: searchParams.get("modelo") ?? undefined,
    color: searchParams.get("color") ?? undefined,
    ram: searchParams.get("ram") ?? undefined,
    capacidad: searchParams.get("capacidad") ?? undefined,
    serie: searchParams.get("serie") ?? undefined,
    accesorios: searchParams.get("accesorios") ?? undefined,
    fecha: searchParams.get("fecha") ?? undefined,
  };

  const origin = request.nextUrl.origin;
  const url = `${origin}/documentos/cargo-laptop${buildQuery(body)}`;

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    return new Response(Buffer.from(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'inline; filename="cargo-entrega-laptop.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error generando PDF";
    return Response.json({ error: message }, { status: 500 });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
