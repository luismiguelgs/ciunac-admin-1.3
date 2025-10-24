import MyTabs, { PanelTab } from '@/components/MUI/MyTabs'
import { Box } from '@mui/material'
import React from 'react'
import Classrooms from '@/modules/examen-ubicacion/components/configuracion/Classrooms'
import Teachers from '@/modules/examen-ubicacion/components/configuracion/Teachers'
import Qualifications from '@/modules/examen-ubicacion/components/configuracion/Qualifications'
import Cronograma from '@/modules/examen-ubicacion/components/configuracion/Cronograma'

export default async function UbicationConfigPage() 
{
	//const data = await loadData()

    const panels:PanelTab[] = [
        {
          label: 'Salas de Examen',
          content: <Classrooms />
        },
        {
          label: 'Calificaciones',
          content: <Qualifications />
        },
        {
          label: 'Profesores',
          content: <Teachers />
        },
        {
          label: 'Cronograma',
          content: <Cronograma />
        }
    ]

    return (
        <Box sx={{ width: '100%' }}>
            <MyTabs panels={panels} />
        </Box>
    )
}
