import { apiFetch } from '@/lib/api.service';
import { ICertificado } from '@/modules/certificados/interfaces/certificado.interface';
import { mapId, mapIds } from '@/lib/utils';

const collection = 'certificados'

export default class CertificadosService {
    static async fetchItems(impreso: boolean): Promise<ICertificado[]> {
        const data = await apiFetch<ICertificado[]>(`${collection}/impresos?impreso=${impreso}`, 'GET')
        console.log(data)
        return mapIds(data)
    }

    static async getItem(id: string): Promise<ICertificado | undefined> {
        const data = await apiFetch<ICertificado>(`${collection}/${id}`, 'GET')
        return mapId(data)
    }

    static async newItem(item: ICertificado): Promise<ICertificado> {
        const data = await apiFetch<ICertificado>(collection, 'POST', item)
        return mapId(data)
    }

    static async updateItem(item: ICertificado): Promise<ICertificado> {
        const { id, ...rest } = item
        const res = await apiFetch<ICertificado>(`${collection}/${id}`, 'PATCH', rest)
        return mapId(res)
    }

    static async updateStatus(id: string, impreso: boolean): Promise<void> {
        const data = await apiFetch<void>(`${collection}/${id}`, 'PATCH', { impreso: impreso })
        return data
    }

    static async updateAccept(id: string, aceptado: boolean): Promise<void> {
        const dataSend: Partial<ICertificado> = {
            aceptado: aceptado,
            fechaAceptacion: new Date()
        }
        const data = await apiFetch<void>(`${collection}/${id}`, 'PATCH', dataSend)
        return data
    }

    static async deleteItem(id: string): Promise<void> {
        const data = await apiFetch<void>(`${collection}/${id}`, 'DELETE')
        return data
    }
}