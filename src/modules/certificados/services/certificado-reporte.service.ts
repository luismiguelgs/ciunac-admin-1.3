import {
    ICertificadoReporteGrupo,
    ICertificadoReporteItem,
    ICertificadoReporteResponse,
} from '@/modules/certificados/interfaces/certificado-reporte.interface'

const CERTIFICATE_REPORT_URL = 'https://api.ciunac.site/v1/certificadosr'
const apiKey = process.env.NEXT_PUBLIC_API_KEY

const normalizeItem = (item: ICertificadoReporteItem): ICertificadoReporteItem => ({
    ...item,
    periodo: String(item.periodo ?? '').trim(),
})

const normalizeGroup = (group: ICertificadoReporteGrupo): ICertificadoReporteGrupo => ({
    digitales: (group?.digitales ?? []).map(normalizeItem),
    fisicos: (group?.fisicos ?? []).map(normalizeItem),
})

export default class CertificadoReporteService {
    static async fetchReport(): Promise<ICertificadoReporteResponse> {
        const response = await fetch(CERTIFICATE_REPORT_URL, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
                ...(apiKey ? { 'x-api-key': apiKey } : {}),
            },
            credentials: 'include',
        })

        if (!response.ok) {
            const message = await response.text()
            throw new Error(`HTTP error! status: ${response.status}: ${message}`)
        }

        const data = await response.json() as ICertificadoReporteResponse

        return {
            basico: normalizeGroup(data.basico),
            intermedioAvanzado: normalizeGroup(data.intermedioAvanzado),
        }
    }
}
