import { Isolicitud } from '../interfaces/solicitud.interface';
import { apiFetch } from '@/lib/api.service';
import { obtenerPeriodo } from '@/lib/utils';
import { ISolicitudRes } from '../interfaces/solicitudres.interface';

export default class SolicitudesService {
    private static collection = 'solicitudes'

    //Solicitudes por DNI
    public static async searchItemByDni(dni: string): Promise<ISolicitudRes[]> {
        const response = await apiFetch<ISolicitudRes[]>(`${this.collection}/documento/${dni}`, 'GET')
        return response
    }

    //Solicitudes por Estado
    public static async fetchItemByState(solicitud: string, state: number): Promise<ISolicitudRes[]> {
        console.log(solicitud, state)
        const response = await apiFetch<ISolicitudRes[]>(`${this.collection}/${solicitud}?estado=${state}`, 'GET')
        return response
    }

    //Solicitudes por Fecha y Tipo
    public static async fetchItemQueryDate(tipo: '7' | 'n', fechaInicial: string, fechaFinal: string): Promise<ISolicitudRes[]> {
        // GET /solicitudes/reporte-fechas?inicio=2024-01-01&fin=2024-01-31&tipo=7
        const response = await apiFetch<ISolicitudRes[]>(`${this.collection}/reporte-fechas?inicio=${fechaInicial}&fin=${fechaFinal}&tipo=${tipo}`, 'GET')
        return response
    }

    public static async newItem(data: Isolicitud): Promise<string | null> {
        const solicitudData = {
            estudianteId: data.estudianteId,
            tipoSolicitudId: Number(data.solicitud),
            idiomaId: Number(data.idioma),
            nivelId: Number(data.nivel),
            estadoId: 1,
            periodo: obtenerPeriodo(),
            alumnoCiunac: data.alumnoCiunac,
            fechaPago: data.fecha_pago,
            pago: Number(data.pago),
            digital: Boolean(data.digital),
            numeroVoucher: data.numero_voucher,
            imgCertEstudio: data.img_cert_estudio,
            imgVoucher: data.img_voucher,
            manual: true
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await apiFetch<any>(`${this.collection}`, 'POST', solicitudData)
        return response.id
    }

    public static async getItemId(id: number): Promise<ISolicitudRes> {
        const response = await apiFetch<ISolicitudRes>(`${this.collection}/${id}`, 'GET')
        return response
    }

    public static async updateItem(id: number, data: Isolicitud): Promise<ISolicitudRes> {
        const response = await apiFetch<ISolicitudRes>(`${this.collection}/${id}`, 'PATCH', data)
        return response
    }

    public static async updateStatus(id: number, state: number): Promise<ISolicitudRes> {
        const response = await apiFetch<ISolicitudRes>(`${this.collection}/${id}`, 'PATCH', { estadoId: state })
        return response
    }

    public static async deleteItem(id: number): Promise<ISolicitudRes> {
        const response = await apiFetch<ISolicitudRes>(`${this.collection}/${id}`, 'DELETE')
        return response
    }
}