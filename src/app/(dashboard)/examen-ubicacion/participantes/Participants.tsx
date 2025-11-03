'use client'
import MyDataGrid from '@/components/MUI/MyDataGrid'
import { GridColDef } from '@mui/x-data-grid'
import React from 'react'
import Grid from '@mui/material/Grid2'
import { Box } from '@mui/material'
import { getIconByCode } from '@/lib/common'
import { IDetalleExamenUbicacion, IExamenUbicacion } from '@/modules/examen-ubicacion/interfaces/examen-ubicacion.interface'
import useCalificacionesExamenUbicacion from '@/modules/examen-ubicacion/hooks/useCalificaciones'
import ICalificacionUbicacion from '@/modules/examen-ubicacion/interfaces/calificacion.interface'


export default function Participants({data, exams}:{data:IDetalleExamenUbicacion[] | undefined, exams: IExamenUbicacion[] | undefined}) 
{
    const { data: calificaciones } = useCalificacionesExamenUbicacion()
    const columns: GridColDef[] = [
        {
            field: 'idioma',
            headerName: 'IDIOMA',
            width: 140,
            valueGetter: (_v, row) => row.idioma?.nombre ?? '',
        },
        {
            field: 'fecha',
            headerName: 'FECHA EXAMEN',
            width: 140,
            renderCell(params) {
                const examen = exams?.find((e) => e.id === params.row.examenId)
                const fecha = examen?.fecha ? new Date(examen.fecha as string) : null
                return <strong>{fecha ? fecha.toLocaleDateString('es-ES') : ''}</strong>
            },
        },
        {
            field: 'nivel',
            headerName: 'NIVEL',
            width: 120,
            valueGetter: (_v, row) => row.nivel?.nombre ?? '',
        },
        {
            field: 'apellidos',
            headerName: 'APELLIDOS',
            width: 180,
            valueGetter: (_v, row) => row.estudiante?.apellidos ?? '',
        },
        {
            field: 'nombres',
            headerName: 'NOMBRES',
            width: 180,
            valueGetter: (_v, row) => row.estudiante?.nombres ?? '',
        },
        {
            field: 'documento',
            headerName: 'DOCUMENTO',
            width: 140,
            valueGetter: (_v, row) => row.estudiante?.numeroDocumento ?? '',
        },
        {
            field: 'nota',
            headerName: 'NOTA',
            width: 100,
        },
        {
            field: 'ubicacion',
            headerName: 'UBICACIÓN',
            width: 200,
            renderCell(params) {
                const row = params.row as IDetalleExamenUbicacion;
                const calId = row.calificacionId as number | undefined;
                if (!calId) return '';
                const cal = (calificaciones || []).find((c: ICalificacionUbicacion) => c.id === calId) as ICalificacionUbicacion | undefined;
                const ciclo = cal?.ciclo?.nombre ?? cal?.cicloId;
                return ciclo ? ciclo : '';
            },
        },
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
