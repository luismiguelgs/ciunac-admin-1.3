'use client'

import React from 'react'
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DownloadIcon from '@mui/icons-material/Download'
import PrintIcon from '@mui/icons-material/Print'
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import { ICertificadoReporteResponse } from '@/modules/certificados/interfaces/certificado-reporte.interface'
import CertificateReportDocument, { getCertificateReportYear } from './CertificateReportDocument'

type Props = {
    open: boolean
    data: ICertificadoReporteResponse | null
    reportNumber: string
    generatedAt: Date
    onClose: () => void
}

export default function CertificateReportDialog({ open, data, reportNumber, generatedAt, onClose }: Props) {
    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
    const document = React.useMemo(() => data ? (
        <CertificateReportDocument data={data} reportNumber={reportNumber} generatedAt={generatedAt} />
    ) : null, [data, generatedAt, reportNumber])
    const year = getCertificateReportYear(generatedAt)

    if (!document) return null

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={fullScreen}
            fullWidth
            maxWidth="xl"
            PaperProps={{ sx: fullScreen ? undefined : { height: '92vh' } }}
        >
            <DialogTitle component="div" sx={{ py: 1, pr: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="h6" noWrap>{`INFORME N° ${reportNumber}-${year}-CAGDLCP`}</Typography>
                        <Typography variant="caption" color="text.secondary">
                            Para imprimir, use el ícono de impresora de la barra del visor.
                        </Typography>
                    </Box>
                    <Tooltip title="Imprimir desde el visor">
                        <PrintIcon color="action" />
                    </Tooltip>
                    <PDFDownloadLink
                        document={document}
                        fileName={`Informe_${reportNumber}_${year}_CAGDLCP.pdf`}
                        style={{ textDecoration: 'none' }}
                    >
                        <Button variant="contained" startIcon={<DownloadIcon />}>
                            Descargar
                        </Button>
                    </PDFDownloadLink>
                    <IconButton onClick={onClose} aria-label="Cerrar visor">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 0, overflow: 'hidden', flex: 1 }}>
                <PDFViewer width="100%" height="100%" showToolbar>
                    {document}
                </PDFViewer>
            </DialogContent>
        </Dialog>
    )
}
