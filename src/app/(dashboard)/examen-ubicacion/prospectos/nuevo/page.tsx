'use client'
import IProspecto from '../../../../../interfaces/prospecto.interface'
import ProspectosService from '@/services/prospectos.service'
import { Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import React from 'react'
import LeadsForm from '../(components)/LeadsForm'

export default function NewLeadPage() {
    //Hooks ******************************************************
    const navigation = useRouter()
    //Functions **************************************************
    const onSubmit = async(values:IProspecto) =>{
        await ProspectosService.newItem(values)
        navigation.back()
    }   

    return (
        <React.Fragment>
            <Typography variant="h5" gutterBottom>Examen de Ubicación - Nuevo Prospecto</Typography>
            <LeadsForm onSubmit={onSubmit} />
        </React.Fragment>
    )
}
