import { Iconstancia } from "../interfaces/constancia.interface";
import { ConstanciasService } from "@/services/constancias.service";
import React from "react";

const useConstancias = (impreso:boolean) => {
    const [data, setData] = React.useState<Iconstancia[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await ConstanciasService.fetchItems(impreso);
            setData(res as Iconstancia[]);
            setLoading(false);
        };
        fetchData();
    }, []);

    return { data, loading, setData };
};

export default useConstancias;