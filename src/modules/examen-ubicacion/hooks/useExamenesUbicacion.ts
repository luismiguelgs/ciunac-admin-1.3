import {IExamenUbicacion} from "../interfaces/examen-ubicacion.interface";
import ExamenesUbicacionService from "../services/examenes-ubicacion.service";
import React from "react";

const useExamenesUbicacion = () => {
    const [data, setData] = React.useState<IExamenUbicacion[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await ExamenesUbicacionService.fetchItems();
            setData(res as IExamenUbicacion[]);
            setLoading(false);
        };
        fetchData();
    }, []);

    return { data, loading, setData };
};

export default useExamenesUbicacion;
