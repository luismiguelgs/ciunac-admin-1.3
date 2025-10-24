'use client'
import OpcionesService, { Collection } from "@/modules/opciones/services/opciones.service";
import React from "react";

const useOpciones = <T,>(collection: Collection) => {
    // 1. Estados
    const [data, setData] = React.useState<T[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    
    // 2. Efecto para cargar datos
    React.useEffect(() => {
        const fetchData = async () => {
            // No es necesario verificar si 'collection' es undefined ya que es un argumento requerido
            setLoading(true);
            try {
                // El tipado genérico <T> en fetchItems asegura que el resultado es T[]
                const res = await OpcionesService.fetchItems<T>(collection);
                setData(res);
                //console.log(`Datos de colección ${collection} cargados:`, res);
            } catch (error) {
                console.error(`Error al cargar la colección ${collection}:`, error);
                // Opcional: manejar el error aquí (ej: mostrar un toast)
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        
        // El array de dependencias vacío asegura que se ejecuta solo una vez al montar
    }, [collection]); // ⚠️ Importante: Agrega 'collection' como dependencia para recargar si cambia.

    // 3. Retorno
    return { data, loading, setData };
};

export default useOpciones;