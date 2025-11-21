import { apiFetch } from "@/lib/api.service";
import { IConstancia } from "../interfaces/constancia.interface";
import { mapId, mapIds } from "@/lib/utils";


const collection = 'constancias'

export class ConstanciasService
{
    static async fetchItems(impreso:boolean): Promise<IConstancia[]> {
        const response = await apiFetch<IConstancia[]>(`${collection}/impresos?impreso=${impreso}`, 'GET')
        return mapIds(response)
    }

    static async getItem(id:string): Promise<IConstancia> {
        const response = await apiFetch<IConstancia>(`${collection}/${id}`, 'GET')
        return mapId(response)
    }

    static async newItem(item:IConstancia): Promise<IConstancia> {
        const response = await apiFetch<IConstancia>(collection, 'POST', item)
        return mapId(response)
    }

    static async updateItem(item:IConstancia): Promise<IConstancia> {
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