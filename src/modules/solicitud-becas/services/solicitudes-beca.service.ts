import { apiFetch } from "@/lib/api.service";
import ISolicitudBeca from "../interfaces/solicitud-beca.interfaces";
import { mapId, mapIds } from "@/lib/utils";


const collection = 'solicitudbecas'

export class SolicitudBecasService
{
    static async fetchItems(): Promise<ISolicitudBeca[]> {
        const response = await apiFetch<ISolicitudBeca[]>(`${collection}`, 'GET')
        return mapIds(response)
    }

    static async fetchItemsByState(estado:string): Promise<ISolicitudBeca[]>{
        const response = await apiFetch<ISolicitudBeca[]>(`${collection}/estado/${estado}`, 'GET')
        return mapIds(response)
    }

    static async getItem(id:string): Promise<ISolicitudBeca> {
        const response = await apiFetch<ISolicitudBeca>(`${collection}/${id}`, 'GET')
        return mapId(response)
    }

    static async newItem(item:ISolicitudBeca): Promise<ISolicitudBeca> {
        const response = await apiFetch<ISolicitudBeca>(collection, 'POST', item)
        return mapId(response)
    }

    static async updateOpbservaciones(id:string, observaciones:string): Promise<ISolicitudBeca> {
        const response = await apiFetch<ISolicitudBeca>(`${collection}/${id}`, 'PATCH', {observaciones:observaciones})
        return mapId(response)
    }

    static async updateStatus(id:string, estado:string): Promise<void> {
        const response = await apiFetch<void>(`${collection}/${id}`, 'PATCH', {estado: estado})
        return response
    }
    static async deleteItem(id:string): Promise<void> {
        const response = await apiFetch<void>(`${collection}/${id}`, 'DELETE')
        return response
    }
}