import axios from "axios";
import { useEffect, useState } from "react";
import { mostrarAlertaError } from "../helpers/alertasHelper";

export const useAxiosCondicionesPago = () => {

    // const [infoCondicionesPago, setInfoCondicionesPago] = useState([{
    //     Signo: "",
    //     DescripcionCondicion: "",
    //     Importe: "",
    //     TipoCondicion: "",
    //     Cliente: "",
    //     TipoImporte: ""
    // }])

    // useEffect(() => {
    //  iniciarConsultaProgramasInscritos();
    //  console.log("Condiciones");
    // }, [])
    
    // const iniciarConsultaProgramasInscritos = async () => {
    //     const data = await obtenerCondicionesPago();
    //     setInfoCondicionesPago([ ...data ]);
    // }


    const obtenerCondicionesPago = async (programa={},idEstudiante) => {
 //console.log(idEstudiante);
 //console.log(programa.Per);
 const periodo = programa.Per;
 //const periodo = '202293';
 //console.log(periodo);     

        //console.log("antes");
        const url = `https://uniminuto.test.digibee.io/pipeline/uniminuto/v1/servicios-banner/calificacionActual?id=${idEstudiante}&periodo=${periodo}`;
        console.log(url);
        const headers = {
            'apikey': '5H9CcvkLZJTgPDDCXTXTI7KC90k6prl0',
            'Content-Type': 'application/json'
           
        };

        try {
          //  console.log("entro");
            const { data } = await axios.get(url, { headers });
            console.log(data);
     //       const parsedResponse = JSON.parse(JSON.stringify(data));
    
    // Parsear el campo 'body'
   // const datos = JSON.parse(parsedResponse.body);
    
    //console.log(datos.informacion);
            //const { CondicionFacturacion } = datos.informacion;
            //return CondicionFacturacion;
            
                // Verificar si 'informacion' es un array
               /* const { calificacion } = datos.informacion
                if (Array.isArray(calificacion)) {
                    console.log("Hola");
                };*/
                
                if (Array.isArray(data.calificaciones)) {
                   //  Usar 'map' para extraer 'CondicionFacturacion' de cada objeto
                 /*   
                    const condiciones = datos.informacion.map(item => item.informacion);
                    console.log(condiciones);
                    return condiciones;*/
                    return data.calificaciones;
                } 
                else {
                    throw new Error("'calificaciones' no es un array");
                }
            



        } catch (error) {
            mostrarAlertaError("Error consultando Calificaciones");
        }
    }

    return {
        // ...infoCondicionesPago,
        // infoCondicionesPago,
        obtenerCondicionesPago
    }
}
