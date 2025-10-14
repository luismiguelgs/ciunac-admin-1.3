import { IIdioma } from "@/modules/opciones/interfaces/types.interface";
import OpcionesService, { Collection } from "@/modules/opciones/services/opciones.service";
import { useSubjectsStore } from "@/modules/opciones/store/types.stores";
import React from "react";
import useStore from "./useStore";

const useSubjects = () => {
    const [data, setData] = React.useState<IIdioma[] | undefined>(useStore(useSubjectsStore, (state) => state.subjects));
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await OpcionesService.fetchItems<IIdioma>(Collection.Idiomas);
            console.log(res)
            useSubjectsStore.getState().setSubjects(res as IIdioma[]);
            setData(res as IIdioma[]);
            setLoading(false);
        };
        if (!data){
            fetchData();
        }
    }, []);

    return { data, loading, setData };
};

export default useSubjects;