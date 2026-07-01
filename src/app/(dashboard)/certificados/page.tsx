'use client'
import React from 'react'
import { ICertificado } from '@/modules/certificados/interfaces/certificado.interface'
import CertificadosService from '@/modules/certificados/services/certificados.service'
import CertificateList from '@/modules/certificados/components/CertificateList'
import CertificateReportButton from '@/modules/certificados/components/report/CertificateReportButton'
import { Box } from '@mui/material'


export default function CertificatesPage() {
    const [rows, setRows] = React.useState<ICertificado[]>([])
    const loadData = async () => {
        const data = await CertificadosService.fetchItems(false)
        //console.log(data)
        setRows(data)
    }
    React.useEffect(() => {
        loadData()
    }, [])

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'stretch', sm: 'flex-end' }, mb: 2 }}>
                <CertificateReportButton />
            </Box>
            <CertificateList rows={rows} setRows={setRows} printed={false} />
        </>
    )
}
