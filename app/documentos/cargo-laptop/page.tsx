import CargoLaptop from "@/components/CargoLaptop";

const demoData = {
  empleado: {
    nombre: "JUAN PÉREZ GARCÍA",
    dni: "12345678",
  },
  equipo: {
    marca: "Lenovo",
    modelo: "ThinkPad E14",
    color: "Negro",
    ram: "16 GB",
    capacidad: "512 GB SSD",
    serie: "PF3ABCDE",
    accesorios: "Cargador, maletín",
  },
  fecha: "08 de agosto de 2026",
};

export default async function CargoLaptopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const str = (key: string, fallback: string) => {
    const v = params[key];
    return typeof v === "string" && v.length > 0 ? v : fallback;
  };

  const data = {
    empleado: {
      nombre: str("nombre", demoData.empleado.nombre),
      dni: str("dni", demoData.empleado.dni),
    },
    equipo: {
      marca: str("marca", demoData.equipo.marca),
      modelo: str("modelo", demoData.equipo.modelo),
      color: str("color", demoData.equipo.color),
      ram: str("ram", demoData.equipo.ram),
      capacidad: str("capacidad", demoData.equipo.capacidad),
      serie: str("serie", demoData.equipo.serie),
      accesorios: str("accesorios", demoData.equipo.accesorios),
    },
    fecha: str("fecha", demoData.fecha),
  };

  return (
    <main className="min-h-screen bg-neutral-200 py-8 print:bg-white print:py-0">
      <CargoLaptop {...data} />
    </main>
  );
}
