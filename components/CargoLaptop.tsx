import React from "react";

export interface CargoLaptopProps {
  empleado: {
    nombre: string;
    dni: string;
  };
  equipo: {
    marca: string;
    modelo: string;
    color: string;
    ram: string;
    capacidad: string;
    serie: string;
    accesorios: string;
  };
  fecha: string;
}

export default function CargoLaptop({
  empleado,
  equipo,
  fecha,
}: CargoLaptopProps) {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-white p-10 text-black text-sm mx-auto shadow-sm print:shadow-none">
      <div className="flex items-center gap-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Logo Grupo Pecuario" className="w-24" />

        <div>
          <h2 className="font-bold text-lg">Grupo Pecuario S.A.C.</h2>
          <p>RUC: 20513967234</p>
          <p>Av. Canto Bello 200 Urb. Canto Bello Lima 36</p>
        </div>
      </div>

      <hr className="my-5 border-black" />

      <h1 className="text-center font-bold underline text-lg mb-8">
        CARGO DE ENTREGA DE EQUIPO LAPTOP
      </h1>

      <p className="leading-6">
        RECIBÍ DE <b>GRUPO PECUARIO S.A.C.</b> UN EQUIPO LAPTOP CON LAS
        SIGUIENTES CARACTERÍSTICAS:
      </p>

      <table className="w-full border border-black mt-6 border-collapse">
        <tbody>
          <tr>
            <td className="border border-black p-2 font-bold w-40">ASIGNADO</td>
            <td className="border border-black p-2">{empleado.nombre}</td>
          </tr>
          <tr>
            <td className="border border-black p-2">MARCA</td>
            <td className="border border-black p-2">{equipo.marca}</td>
          </tr>
          <tr>
            <td className="border border-black p-2">MODELO</td>
            <td className="border border-black p-2">{equipo.modelo}</td>
          </tr>
          <tr>
            <td className="border border-black p-2">COLOR</td>
            <td className="border border-black p-2">{equipo.color}</td>
          </tr>
          <tr>
            <td className="border border-black p-2">RAM</td>
            <td className="border border-black p-2">{equipo.ram}</td>
          </tr>
          <tr>
            <td className="border border-black p-2">CAPACIDAD</td>
            <td className="border border-black p-2">{equipo.capacidad}</td>
          </tr>
          <tr>
            <td className="border border-black p-2">S/N</td>
            <td className="border border-black p-2">{equipo.serie}</td>
          </tr>
          <tr>
            <td className="border border-black p-2">ACCESORIOS</td>
            <td className="border border-black p-2">{equipo.accesorios}</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-8 text-justify leading-6">
        <p>
          Considero que este equipo debe ser usado exclusivamente para trabajo,
          siendo mi obligación responder cada vez que me llamen por asuntos
          laborales.
        </p>

        <p className="mt-4">
          Asimismo, está prohibido compartir el equipo e instalar aplicaciones
          que no se usan dentro del trabajo, caso contrario se aplicará un
          memorándum por incumplimiento.
        </p>

        <p className="mt-4">
          Es mi responsabilidad ante cualquier siniestro (robo o hurto), la
          reposición del equipo en el menor tiempo posible y razonable. Además de
          comunicar de forma inmediata al área de sistemas.
        </p>
      </div>

      <div className="mt-10">San Juan de Lurigancho, {fecha}</div>

      <div className="grid grid-cols-2 mt-20 text-center">
        <div>
          <div className="border-t border-black w-52 mx-auto pt-3">
            {empleado.nombre}
          </div>
          DNI: {empleado.dni}
        </div>

        <div>
          <div className="border border-gray-500 p-5">
            <b>FIRMA ELECTRÓNICA</b>
            <br />
            <br />
            ☑ Documento aceptado digitalmente
            <br />
            Fecha: {fecha}
          </div>
        </div>
      </div>
    </div>
  );
}
