import React, { useEffect, useState } from "react";
import {
  Container,
  VBox,
  BannerHeader,
  BasicSegment
} from "@ombiel/aek-lib";
import "../../client/Calendarios.css";
import { mostrarAlertaError } from "../../helpers/alertasHelper";
import { useFetchSedes } from "../../hooks/useAxiosSedes";

const Screen = () => {
  const [idUser, setidUser] = useState("000861114");
const [calendarioData, setCalendarioData] = useState(null);
const [expandedActivities, setExpandedActivities] = useState([]);
  const [rectorias, setRectorias] = useState([]);
  const [sedes, setSedes] = useState([]);

  const [rectoriaSeleccionada, setRectoriaSeleccionada] = useState("");
  const [sedeSeleccionada, setSedeSeleccionada] = useState("");
  const [tipoCalendarioSeleccionado, setTipoCalendarioSeleccionado] = useState("");
  const [modalidadSeleccionada, setModalidadSeleccionada] = useState("");
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("");

  const [tiposCalendario, setTiposCalendario] = useState([]);
  const [modalidades, setModalidades] = useState([]);
  const [periodos, setPeriodos] = useState([]);

  const { infoItems } = useFetchSedes(idUser);

  const stverde = {
    backgroundColor: "#779b00",
    fontFamily: "Helvetica",
    fontSize: "12px",
    color: "#ffffff"
  };

  const stgris = {
    backgroundColor: "#F2F2F2",
    fontFamily: "Helvetica",
    fontSize: "12px"
  };

  useEffect(() => {
    if (!infoItems) return;

    const {
      sede = [],
      tipoCalendario = [],
      modalidades = [],
      periodos = []
    } = infoItems;

    const rectoriasUnicas = Array.from(new Set(sede.map(s => s.rectoria)))
  .map(nombre => {
    const match = sede.find(s => s.rectoria === nombre);
    return { nombre, idRectoria: match.idRectoria };
  });

    setRectorias(rectoriasUnicas);
    setSedes(sede);
    setTiposCalendario(tipoCalendario);
    setModalidades(modalidades);
    setPeriodos(periodos);
  }, [infoItems]);

  const handleChangeRectoria = (e) => {
    setRectoriaSeleccionada(e.target.value);
    setSedeSeleccionada("");
  };

  const handleChangeSede = (e) => setSedeSeleccionada(e.target.value);
  const handleChangeTipoCalendario = (e) => setTipoCalendarioSeleccionado(e.target.value);
  const handleChangeModalidad = (e) => setModalidadSeleccionada(e.target.value);
  const handleChangePeriodo = (e) => setPeriodoSeleccionado(e.target.value);

const handleConsultar = async () => {
  try {
    const periodoObj = periodos.find(p => p.idPeriodo === parseInt(periodoSeleccionado));
    const anio = periodoObj ? new Date(periodoObj.anio).getUTCFullYear().toString() : null;

    if (!anio) {
      mostrarAlertaError("No se pudo extraer el año del periodo.");
      return;
    }

    //variables que va como query params
    const queryParams = new URLSearchParams({
      idRectoria: rectoriaSeleccionada,
      idSede: sedeSeleccionada,
      idTipoCalendario: tipoCalendarioSeleccionado,
      anio: anio,
      idPeriodo: periodoSeleccionado,
      idModalidad: modalidadSeleccionada,
      apikey: "aZnFPndaOb0yD6nk878gP94Vp0u15C2f"
    });

    const url = `https://uniminuto.test.digibee.io/pipeline/uniminuto/v1/calendarios/filtroCalendario?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      redirect: "follow"
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("Respuesta:", data);
setCalendarioData(data);
 //   alert(`✅ Consulta realizada con éxito.\n\n📤 Parámetros enviados:\n${queryParams.toString()}`);
    
  } catch (error) {
    console.error(error);

    alert(`Error al consultar el calendario.\n\n📤 Parámetros enviados:\n${JSON.stringify({
      idRectoria: rectoriaSeleccionada,
      idSede: sedeSeleccionada,
      idTipoCalendario: tipoCalendarioSeleccionado,
      anio: periodos.find(p => p.idPeriodo === parseInt(periodoSeleccionado))?.anio?.toString().substring(0, 4),
      idPeriodo: periodoSeleccionado,
      idModalidad: modalidadSeleccionada
    }, null, 2)}\n\n Detalle del error:\n${error.message}`);
  }
};



  return (
    <>
      <link
        href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css"
        rel="stylesheet"
      />
      <div className="container mx-auto px-4 py-10" style={stgris}>
        <form className="flex flex-col space-y-6 bg-white rounded-md shadow-md p-4">

          {/* Combo Rectoría */}
          <div className="flex items-center">
            <label className="w-1/3 font-medium">
              <span style={stverde} className="flex items-center justify-center rounded-md p-2 text-center">Rectoría:</span>
            </label>
            <select className="flex-1 px-3 py-2 rounded-md border border-gray-300"
              value={rectoriaSeleccionada}
              onChange={handleChangeRectoria}>
              <option value="">--Selecciona una rectoría--</option>
              {rectorias.map(rect => (
                 <option key={rect.idRectoria} value={rect.idRectoria}>{rect.nombre}</option>
              ))}
            </select>
          </div>

          {/* Combo Sede */}
          <div className="flex items-center">
            <label className="w-1/3 font-medium">
              <span style={stverde} className="flex items-center justify-center rounded-md p-2 text-center">Sede:</span>
            </label>
            <select className="flex-1 px-3 py-2 rounded-md border border-gray-300"
              value={sedeSeleccionada}
              onChange={handleChangeSede}
              disabled={!rectoriaSeleccionada}>
              <option value="">--Selecciona una sede--</option>
              {sedes
  .filter(s => String(s.idRectoria) === rectoriaSeleccionada)
  .map(s => (
    <option key={s.idSede} value={s.idSede}>{s.sede}</option>
))}
            </select>
          </div>

          {/* Combo Tipo de Calendario */}
          <div className="flex items-center">
            <label className="w-1/3 font-medium">
              <span style={stverde} className="flex items-center justify-center rounded-md p-2 text-center">Tipo de calendario:</span>
            </label>
            <select className="flex-1 px-3 py-2 rounded-md border border-gray-300"
              value={tipoCalendarioSeleccionado}
              onChange={handleChangeTipoCalendario}>
              <option value="">--Selecciona tipo--</option>
              {tiposCalendario.map(tipo => (
                <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
              ))}
            </select>
          </div>

          {/* Combo Modalidad */}
          <div className="flex items-center">
            <label className="w-1/3 font-medium">
              <span style={stverde} className="flex items-center justify-center rounded-md p-2 text-center">Modalidad:</span>
            </label>
            <select className="flex-1 px-3 py-2 rounded-md border border-gray-300"
              value={modalidadSeleccionada}
              onChange={handleChangeModalidad}>
              <option value="">--Selecciona modalidad--</option>
              {modalidades.map(mod => (
                <option key={mod.idModalidad} value={mod.idModalidad}>{mod.modalidad}</option>
              ))}
            </select>
          </div>

          {/* Combo Periodo */}
          <div className="flex items-center">
            <label className="w-1/3 font-medium">
              <span style={stverde} className="flex items-center justify-center rounded-md p-2 text-center">Periodo:</span>
            </label>
            <select className="flex-1 px-3 py-2 rounded-md border border-gray-300"
              value={periodoSeleccionado}
              onChange={handleChangePeriodo}>
              <option value="">--Selecciona periodo--</option>
              {periodos.map(p => {
            const anioUTC = new Date(p.anio).getUTCFullYear();
            return (
             <option key={p.idPeriodo} value={p.idPeriodo}>
             {anioUTC} - {p.idPeriodo}
            </option>
           );
            })}
            </select>
          </div>

          {/* Botón Consultar */}
          {rectoriaSeleccionada && sedeSeleccionada && tipoCalendarioSeleccionado &&
            modalidadSeleccionada && periodoSeleccionado && (
              <button
                type="button"
                className="bg-indigo-900 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded"
                onClick={handleConsultar}
              >
                Consultar Calendario
              </button>
          )}

        </form>
{calendarioData && (
  <div className="mt-10 bg-white p-4 rounded shadow">
    <h2 className="text-lg font-bold mb-4">Actividades</h2>

    {calendarioData.actividades && calendarioData.actividades.length > 0 ? (
      Array.from(
        new Map(calendarioData.actividades.map(act => [act.id_actividad, act])).values()
      ).map((actividad) => {
        const isOpen = expandedActivities.includes(actividad.id_actividad);
        return (
          <div key={actividad.id_actividad} className="mb-4 border rounded overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-4 py-2 font-semibold text-white focus:outline-none"
              style={{
                background: "linear-gradient(90deg, #00b0cf 0%, #005293 100%)"
              }}
              onClick={() =>
                setExpandedActivities((prev) =>
                  prev.includes(actividad.id_actividad)
                    ? prev.filter((id) => id !== actividad.id_actividad)
                    : [...prev, actividad.id_actividad]
                )
              }
            >
              <span>{actividad.nombre_actividad}</span>
              <span className="text-xl">{isOpen ? "−" : "+"}</span>
            </button>

            {isOpen && (
              <div className="p-4 border-t bg-gray-50">
                {calendarioData.actividades
                  .filter((a) => a.id_actividad === actividad.id_actividad)
                  .map((a) => (
                    <div
                      key={a.subActividad.id_subactividad}
                      className="mb-2 p-3 border rounded bg-white"
                    >
                      <p className="font-medium">
                        {a.subActividad.nombre_subactividad}
                      </p>
                      <p>
                        Descripción:{" "}
                        {a.subActividad.descripcion || "Sin descripción"}
                      </p>
                      <p>
                        Fecha inicio:{" "}
                        {a.subActividad.fecha_inicio
                          ? new Date(a.subActividad.fecha_inicio).toLocaleDateString()
                          : "No aplica"}
                      </p>
                      <p>
                        Fecha fin:{" "}
                        {a.subActividad.fecha_fin
                          ? new Date(a.subActividad.fecha_fin).toLocaleDateString()
                          : "No aplica"}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        );
      })
    ) : (
      <div
        className="w-full text-center px-4 py-2 font-semibold text-white rounded"
        style={{
          background: "linear-gradient(90deg, #00b0cf 0%, #005293 100%)"
        }}
      >
        No hay actividades registradas.
      </div>
    )}
  </div>
)}


      </div>
    </>
  );
};

export default Screen;
