'use client'
import React from 'react'
import CertificateList from '../(components)/CertificateList'
import CertificadosService from '@/modules/certificados/services/certificados.service'
import { Icertificado } from '@/modules/certificados/interfaces/certificado.interface'

export default function CertifictesPrintedPage() 
{
    const [rows, setRows] = React.useState<Icertificado[]>([])
    const loadData = async () => {
            const data = await CertificadosService.fetchItems(true)
            setRows(data)
        }
        React.useEffect(()=> {
            loadData()
    },[])

    return (
        <CertificateList rows={rows} setRows={setRows} printed={true}/>
    )
}
