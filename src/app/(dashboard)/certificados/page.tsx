'use client'
import React from 'react'
import { Icertificado } from '@/modules/certificados/interfaces/certificado.interface'
import CertificadosService from '@/modules/certificados/services/certificados.service'
import CertificateList from '@/modules/certificados/components/CertificateList'


export default function CertificatesPage() 
{
	const [rows, setRows] = React.useState<Icertificado[]>([])
    const loadData = async () => {
        const data = await CertificadosService.fetchItems(false)
        setRows(data)
    }
    React.useEffect(()=> {
            loadData()
    },[])
    
    return (
        <CertificateList rows={rows} setRows={setRows} printed={false}/>
    )
}
