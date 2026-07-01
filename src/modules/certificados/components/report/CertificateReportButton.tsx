'use client'

import React from 'react'
import { Button } from '@mui/material'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import CertificadoReporteService from '@/modules/certificados/services/certificado-reporte.service'
import { ICertificadoReporteResponse } from '@/modules/certificados/interfaces/certificado-reporte.interface'
import CertificateReportDialog from './CertificateReportDialog'
import ReportNumberDialog from './ReportNumberDialog'
import { getCertificateReportYear } from './CertificateReportDocument'

const countCertificates = (data: ICertificadoReporteResponse) => (
    (data.basico?.digitales?.length ?? 0)
    + (data.basico?.fisicos?.length ?? 0)
    + (data.intermedioAvanzado?.digitales?.length ?? 0)
    + (data.intermedioAvanzado?.fisicos?.length ?? 0)
)

export default function CertificateReportButton() {
    const [numberDialogOpen, setNumberDialogOpen] = React.useState(false)
    const [viewerOpen, setViewerOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [reportNumber, setReportNumber] = React.useState('')
    const [generatedAt, setGeneratedAt] = React.useState(() => new Date())
    const [reportData, setReportData] = React.useState<ICertificadoReporteResponse | null>(null)

    const handleOpen = () => {
        setError(null)
        setNumberDialogOpen(true)
    }

    const handleGenerate = async (number: string) => {
        setLoading(true)
        setError(null)

        try {
            const data = await CertificadoReporteService.fetchReport()

            if (countCertificates(data) === 0) {
                setError('No existen certificados disponibles para generar el informe.')
                return
            }

            setReportData(data)
            setReportNumber(number)
            setGeneratedAt(new Date())
            setNumberDialogOpen(false)
            setViewerOpen(true)
        } catch (caughtError) {
            console.error('Error al consultar el reporte de certificados:', caughtError)
            setError('No se pudo consultar el reporte. Verifique la conexión e inténtelo nuevamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Button variant="contained" color="error" startIcon={<PictureAsPdfIcon />} onClick={handleOpen}>
                Informe de certificados
            </Button>
            <ReportNumberDialog
                open={numberDialogOpen}
                loading={loading}
                error={error}
                year={getCertificateReportYear()}
                onClose={() => setNumberDialogOpen(false)}
                onSubmit={handleGenerate}
            />
            <CertificateReportDialog
                open={viewerOpen}
                data={reportData}
                reportNumber={reportNumber}
                generatedAt={generatedAt}
                onClose={() => setViewerOpen(false)}
            />
        </>
    )
}
