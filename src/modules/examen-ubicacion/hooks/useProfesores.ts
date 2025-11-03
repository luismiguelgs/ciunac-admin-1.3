import React from "react";
import ProfesoresService from "../services/profesores.service";
import { IProfesor } from "../interfaces/profesores.interface";

const useProfesores = () => {
    const [data, setData] = React.useState<IProfesor[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await ProfesoresService.fetchItems();
            setData(res as IProfesor[]);
            setLoading(false);
        };
        fetchData();
    }, []);

    return { data, loading, setData };
};

export default useProfesores;
