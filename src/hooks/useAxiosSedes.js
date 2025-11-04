import { useEffect, useState } from "react";
import { mostrarAlertaError } from "../helpers/alertasHelper";

export const useFetchSedes = (idUsuario = "") => {
  const [infoItems, setInfoItems] = useState(null);

  useEffect(() => {
    if (idUsuario) {
      obtenerInfoSedes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idUsuario]);

  const obtenerInfoSedes = async () => {
    const url = `https://uniminuto.test.digibee.io/pipeline/uniminuto/v1/calendarios/items?apikey=aZnFPndaOb0yD6nk878gP94Vp0u15C2f`;

    try {
      const response = await fetch(url, {
        method: "GET",
        redirect: "follow",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      

      const { items } = result;

      if (
        items &&
        Array.isArray(items.sede) &&
        Array.isArray(items.tipoCalendario) &&
        Array.isArray(items.modalidades) &&
        Array.isArray(items.periodos)
      ) {
        setInfoItems(items);
      } else {
        mostrarAlertaError(
          "Datos incompletos en la respuesta del servidor."
        );
      }
    } catch (error) {
      console.error("Error detallado:", error);
      mostrarAlertaError(
        `Error al obtener la información de sedes. Detalle: ${error.message}`
      );
    }
  };

  return {
    infoItems,
  };
};
