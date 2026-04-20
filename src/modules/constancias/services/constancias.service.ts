import { apiFetch } from "@/lib/api.service";
import { IConstancia } from "../interfaces/constancia.interface";
import { formatDate, mapId } from "@/lib/utils";


const collection = 'constancias'

interface IRawConstancia extends Omit<IConstancia, 'creado_en' | 'modificado_en'> {
    creado_en?: string;
    creadoAt?: string;
    createAt?: string;
    id_solicitud?: number;
}

export class ConstanciasService
{
    static async fetchItems(impreso: boolean): Promise<IConstancia[]> {
        const response = await apiFetch<IRawConstancia[]>(`${collection}/impresos?impreso=${impreso}`, 'GET')
        return response.map(item => {
            const mapped = mapId(item)
            const solicitudId = item.solicitud_id || item.id_solicitud;
            return {
                ...mapped,
                id: mapped.id || solicitudId?.toString(),
                solicitud_id: solicitudId,
                createAt: formatDate(item.createAt || item.creado_en || item.creadoAt)
            }
        }) as IConstancia[]
    }

    static async getItem(id:string): Promise<IConstancia> {
        const response = await apiFetch<IConstancia>(`${collection}/${id}`, 'GET')
        return mapId(response)
    }

    static async newItem(item:IConstancia): Promise<IConstancia> {
        const response = await apiFetch<IConstancia>(collection, 'POST', item)
        return mapId(response)
    }

    static async updateItem(item: IConstancia): Promise<IConstancia> {
        const {id, ...rest} = item
        const response = await apiFetch<IConstancia>(`${collection}/${id}`, 'PATCH', rest)
        return mapId(response)
    }

    static async updateStatus(id:string, impreso:boolean): Promise<void> {
        const response = await apiFetch<void>(`${collection}/${id}`, 'PATCH', {impreso: impreso})
        return response
    }
    static async deleteItem(id:string): Promise<void> {
        const response = await apiFetch<void>(`${collection}/${id}`, 'DELETE')
        return response
    }
}