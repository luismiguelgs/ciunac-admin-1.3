'use client'
import MyDataGrid from '@/components/MUI/MyDataGrid'
import { Iexamen, IexamenNotas } from '../../../../modules/examen-ubicacion/interfaces/examen-ubicacion.interface'
import { GridColDef } from '@mui/x-data-grid'
import React from 'react'
import Grid from '@mui/material/Grid2'
import { Box } from '@mui/material'
import { getIconByCode } from '@/lib/common'


export default function Participants({data, exams}:{data:IexamenNotas[] | undefined, exams: Iexamen[] | undefined}) 
{
    const columns: GridColDef[] = [
        {
            field: 'idioma',
            headerName: 'IDIOMA',
            width: 90,
            renderCell(params) {
                return <span style={{alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
                    {getIconByCode(params.value)}
                </span>
            }
        },
        {
            field: 'examen_id',
            width: 130,
            renderHeader:() => (
                <strong>
                    {'FECHA EXAMEN '}
                    <span role='img' aria-label='date'>
                        📆
                    </span>
                </strong>
            ),
            renderCell(params) {
                const examen = exams?.find(examen => examen.id === params.value)
                return <strong>{new Date(examen?.fecha_examen).toLocaleDateString('es-ES')}</strong>
            } 
        },
        {
            field: 'nivel',
            headerName: 'NIVEL',
            width: 100
        },
        {
            field: 'apellidos',
            headerName: 'APELLIDOS',
            width: 180
        },
        {
            field: 'nombres',
            headerName: 'NOMBRES',
            width: 180
        },
        {
            field: 'dni',
            headerName: 'DNI',
            width: 100
        },
        {
            field: 'nota',
            headerName: 'NOTA',
            width: 80
        },
        {
            field: 'ubicacion',
            headerName: 'UBICACIÓN',
            width: 200
        }
    ]

    return (
        <Grid container spacing={2}>
            <Grid size={{xs:12}} display={'flex'} justifyContent={'flex-end'}>
				<Box id='filter-panel' />
			</Grid>
            <Grid minHeight={300} size={{xs:12}}>
				<MyDataGrid 
					data={data || []}
					cols={columns}
					handleDelete={()=>{}}
					handleDetails={()=>{}}
                    actions={false}
				/>
			</Grid>
        </Grid>
    )
}
