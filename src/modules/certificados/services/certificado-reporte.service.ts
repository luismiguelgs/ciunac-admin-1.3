import { ICertificadoReporteResponse } from '@/modules/certificados/interfaces/certificado-reporte.interface'

const CERTIFICATE_REPORT_URL = 'https://api.ciunac.site/v1/certificadosr'
const apiKey = process.env.NEXT_PUBLIC_API_KEY

export default class CertificadoReporteService {
    static async fetchReport(): Promise<ICertificadoReporteResponse> {
        const response = await fetch(CERTIFICATE_REPORT_URL, {
            method: 'GET',
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

        return response.json() as Promise<ICertificadoReporteResponse>
    }
}
