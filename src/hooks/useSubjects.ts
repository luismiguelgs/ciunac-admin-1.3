import { IBaseData } from "@/modules/opciones/interfaces/types.interface";
import { Collection, OpcionesService } from "@/services/opciones.service";
import { useSubjectsStore } from "@/modules/opciones/store/types.stores";
import React from "react";
import useStore from "./useStore";

const useSubjects = () => {
    const [data, setData] = React.useState<IBaseData[] | undefined>(useStore(useSubjectsStore, (state) => state.subjects));
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await OpcionesService.fetchItems<IBaseData>(Collection.Cursos);
            useSubjectsStore.getState().setSubjects(res);
            setData(res as IBaseData[]);
            setLoading(false);
        };
        if (!data){
            fetchData();
        }
    }, []);

    return { data, loading, setData };
};

export default useSubjects;