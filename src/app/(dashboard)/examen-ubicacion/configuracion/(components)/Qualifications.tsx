'use client'
import useStore from '@/hooks/useStore'
import { Icalificacion } from '@/interfaces/calificacion.interface'
import { NIVEL } from '@/lib/constants'
import { CalificacionesService, Collection } from '@/services/calificaciones.service'
import { useSubjectsStore } from '@/modules/opciones/store/types.stores'
import { GridColDef, GridRowId } from '@mui/x-data-grid'
import React from 'react'
import Grid from '@mui/material/Grid2'
import { Box, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import MyDataGrid from '@/components/MUI/MyDataGrid'
import { MyDialog } from '@/components/MUI'
import DialogFull from '@/components/MUI/Dialogs/DialogFull'
import QualificationsDetail from './QualificationsDetail'

export default function Qualifications() 
{
    //Hooks ************
    const subjects = useStore(useSubjectsStore, (state) => state.subjects)
    const [ openDialog, setOpenDialog ] = React.useState<boolean>(false)
    const [ openDialogFull, setOpenDialogFull ] = React.useState<boolean>(false)
    const [rows, setRows] = React.useState<Icalificacion[]>([])
    const [ID, setID] = React.useState<GridRowId | null>(null);
    const [ reload, setReload ] = React.useState<boolean>(false)

    const loadData = async () =>{
        const data = await CalificacionesService.fetchItems()
        setRows(data)
    }

    React.useEffect(()=> {
        loadData()
    },[reload])

    //Funcions ***************
    const handleConfirmDelete = async () => {
        if (ID) {
            //borrar su detalle
            const data = await CalificacionesService.fetchItemsDetail(ID as string)
            for(const element of data){
                await CalificacionesService.deleteItem(Collection.Calificaciones_Detalle, element.id as string)
            }
            //borrar el item
            await CalificacionesService.deleteItem(Collection.Calificaciones,ID as string);
            setRows(rows.filter((row) => row.id !== ID));
            setID(null);
            setOpenDialog(false);
        }
    };
    const handleDetails = (id:GridRowId) => {
        setID(id)
        setOpenDialogFull(true)
    }
    const handleDelete = async (id:GridRowId) => {
        setID(id)
        setOpenDialog(true)
    }
    
    const handleNewClick = () => {
        setID(null)
        setOpenDialogFull(true)
    }

    //Columnas ***************
    const columns: GridColDef[] = [
        {
            field: 'codigo',
            type: 'string',
            headerName: 'CÓDIGO CALIFICACIÓN',
            width: 350
        },
        {
            field: 'idioma', 
            type: 'singleSelect', 
            headerName: 'IDIOMA',
            valueOptions: subjects,
            editable: false,
            width: 160
        },
        {
            field: 'nivel', 
            type: 'singleSelect', 
            headerName: 'NIVEL',
            valueOptions: NIVEL,
            editable: false,
            width: 160
        },
        {
            field: 'creado',
            type: 'string',
            headerName: 'FECHA CREADO',
            width: 180
        }
    ]

    return (
        <Grid container spacing={2} p={1}>
            <Grid size={{xs:12, md:6}}>
                <Button variant="contained" endIcon={<AddIcon /> } sx={{mb:1}} onClick={handleNewClick}>
                    Nueva Calificación
                </Button>
            </Grid>
            <Grid size={{xs:12, md:6}}>
                <Box id='filter-panel' />
            </Grid>
            <Grid minHeight={300} size={{xs:12}}>
                <MyDataGrid
                    data={rows} 
                    cols={columns}
                    handleDetails={handleDetails} 
                    handleDelete={handleDelete}/>
            </Grid>
            <MyDialog
                type='ALERT'
                title='Borrar Registro'
                content="Confirma borrar el registro?"
                open={openDialog}
                setOpen={setOpenDialog}
                actionFunc={handleConfirmDelete}
            /> 
            <DialogFull 
                open={openDialogFull} 
                setOpen={setOpenDialogFull}
                title={ ID == null ? "Nuevo Rango de Calificación" : "Detalle de Solicitud"}
                content={
                    <QualificationsDetail
                        id={ID as string}  
                        setReload={setReload}
                        setOpen={setOpenDialogFull}/>
                }
            />
        </Grid>
    )
}
