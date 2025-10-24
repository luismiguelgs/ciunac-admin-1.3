import IcronogramaExam from "@/modules/examen-ubicacion/interfaces/cronogramaExam.interface";
import CronogramaExamService from "@/modules/examen-ubicacion/services/cronogramaExam.service";
import React from "react";

const useCronogramas = () => {
    const [data, setData] = React.useState<IcronogramaExam[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await CronogramaExamService.fetchItems();
            
            const normalized = (res ?? []).map((r) => ({
            ...r,
            fecha: r?.fecha
                ? (r.fecha instanceof Date ? r.fecha : new Date(r.fecha as unknown as string))
                : null,
            }));
            setData(normalized as IcronogramaExam[]);
            //console.log(normalized);
            
            //setData(res as IcronogramaExam[]);
            setLoading(false);
        };
        fetchData();
    }, []);

    return { data, loading, setData };
};

export default useCronogramas;