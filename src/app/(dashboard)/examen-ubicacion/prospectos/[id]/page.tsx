'use client'
import IProspecto from '../../../../../interfaces/prospecto.interface'
import ProspectosService from '@/services/prospectos.service'
import { Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import React from 'react'
import LeadsForm from '../(components)/LeadsForm'


export default function LeadsDetailPage(params:{params:{id:string}}) 
{
    //Hooks *********************************************************************
    const id = params.params.id
    const navitage = useRouter()
    const [data, setData] = React.useState<IProspecto>()

    React.useEffect(()=>{
        const getItem = async(id:string | undefined) => {
            const res = await ProspectosService.getItem(id as string)
            setData(res)
        }
        getItem(id)
    },[])

    //Functions ***************************************************************
    const onSubmit = async(values:IProspecto) =>{
        await ProspectosService.updateItem({id: id, ...values})
        navitage.back()
    }   

    return (
        <React.Fragment>
            <Typography variant="h5" gutterBottom>Examen de Ubicación - Prospecto Detalles</Typography>
            {
                data && <LeadsForm data={data} onSubmit={onSubmit}/>
            }
        </React.Fragment>
    )
}
