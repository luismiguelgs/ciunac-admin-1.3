'use client'
import React from 'react'
import Grid from '@mui/material/Grid2'
import NewButton from '@/components/NewButton'
import { Box, Chip } from '@mui/material'
import MyDataGrid from '@/components/MUI/MyDataGrid'
import { MyDialog } from '@/components/MUI'
import { useRouter } from 'next/navigation'
import { GridColDef, GridRowId, GridValueFormatter } from '@mui/x-data-grid'
import { getIconByCode } from '@/lib/common'
import ExamenesUbicacionService from '@/modules/examen-ubicacion/services/examenes-ubicacion.service'
import useExamenesUbicacion from '@/modules/examen-ubicacion/hooks/useExamenesUbicacion'

export default function UbicationExamsPage() 
{
	//Hooks ************
    const navigate = useRouter()
    const { data, loading, setData } = useExamenesUbicacion()
    const [ openDialog, setOpenDialog ] = React.useState<boolean>(false)
    const [ID, setID] = React.useState<GridRowId | null>(null);

    const formatFecha: GridValueFormatter = (value: string | Date | null| undefined) => {
            if (!value) return '';
            return new Date(value).toLocaleDateString('es-PE', {year: 'numeric', month: '2-digit', day: '2-digit'})
    }

	const handleConfirmDelete = async () => {
        if (ID) {
            //borrar su detalle
            const res = await ExamenesUbicacionService.fetchItemsDetail(ID as number)
            for(const element of (res ?? [])){
                await ExamenesUbicacionService.deleteDetail(element.id as number)
            }
            //borrar el item
            await ExamenesUbicacionService.delete(ID as number);
            setData(data.filter((row) => row.id !== ID) ?? []);
            setID(null);
            setOpenDialog(false);
        }
    };
    const handleDetails = (id:GridRowId) => {
        setID(id)
        navigate.push(`./examen-ubicacion/${id}`)
    }
    const handleDelete = async (id:GridRowId) => {
        setID(id)
        setOpenDialog(true)
    }

	//Columnas ***************
    const columns: GridColDef[] = [
        {
            field: 'codigo',
            headerName: 'CÓDIGO',
            width: 150
        },
        {
            field: 'estadoId',
            headerName: 'ESTADO',
            width: 130,
            renderCell: (params) =>{
                switch(params.value){
                    case 6:
                        return <Chip label='NUEVO' color="error" />
                    case 7:
                        return <Chip label='ASIGNADO' color="primary" />
                    default:
                        return <Chip label='TERMINADO' />
                }
                
            }
        },
        { 
            field: 'fecha', 
            type: 'date', 
            width: 150,
            align: 'center',
            editable: false,
            renderHeader:() => (
                <strong>
                    {'Fecha Examen '}
                    <span role='img' aria-label='date'>
                        📆
                    </span>
                </strong>
            ),
            valueFormatter: formatFecha
        },
        {
            field: 'idiomaId',
            width: 80,
            type: 'string',
            headerName: 'IDIOMA',
            valueGetter: (_v, row) => row.idiomaId ?? '',
            renderCell(params) {
                return getIconByCode(Number(params.value))
            }
        },
        { field: 'docente.apellidos', type: 'string', headerName: 'DOCENTE APELLIDOS', width:180, valueGetter: (_v, row) => row.docente?.apellidos ?? '' },
        { field: 'docente.nombres', type: 'string', headerName: 'DOCENTE NOMBRES', width:180, valueGetter: (_v, row) => row.docente?.nombres ?? '' },
        { field: 'aula.nombre', type: 'string', headerName: 'SALA', width: 80, valueGetter: (_v, row) => row.aula?.nombre ?? '' },
    ];

    if (loading) return (<h1>Cargando...</h1>)

    return (
		<Grid container spacing={2} p={1}>
			<Grid size={{xs:12, md:6}}>
				<NewButton text='Nuevo Examen' url='./examen-ubicacion/nuevo' />
			</Grid>
			<Grid size={{xs:12, md:6}} display={'flex'} justifyContent={'flex-end'}>
				<Box id='filter-panel' />
			</Grid>
			<Grid minHeight={300} size={{xs:12}}>
				<MyDataGrid 
					data={data}
					cols={columns}
					handleDelete={handleDelete}
					handleDetails={handleDetails}
				/>
			</Grid>
			<MyDialog 
				type='ALERT'
                title='Borrar Registro'
                content="Confirma borrar el registro?"
                open={openDialog}
                setOpen={setOpenDialog}
                actionFunc={handleConfirmDelete}
			/>
		</Grid>
    )
}
