import ICalificacionUbicacion from "../interfaces/calificacion.interface";
import CalificacionesService from "../services/calificaciones.service";
import React from "react";

const useCalificacionesExamenUbicacion = () => {
    const [data, setData] = React.useState<ICalificacionUbicacion[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await CalificacionesService.fetchItems();
            setData(res as ICalificacionUbicacion[]);
            setLoading(false);
        };
        fetchData();
    }, []);

    return { data, loading, setData };
};

export default useCalificacionesExamenUbicacion;
