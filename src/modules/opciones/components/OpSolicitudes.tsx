'use client'
import { ITipoSolicitud } from '@/modules/opciones/interfaces/types.interface'
import { Button } from '@mui/material'
import { GridColDef, GridRowId, GridRowModel, GridRowModes, GridRowModesModel } from '@mui/x-data-grid'
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import EditableDataGrid from '@/components/MUI/EditableDataGrid'
import { MyDialog } from '@/components/MUI'
import OpcionesService, { Collection } from '../services/opciones.service'
//import useStore from '@/hooks/useStore'
//import { useDocumentsStore } from '@/store/types.stores'

const cols:GridColDef[] = [
    {field: 'id', headerName: 'VALOR', editable: false, width:120},
    {field: 'solicitud', headerName: 'ETIQUETA', editable: true, width:280},
    {field: 'precio', headerName: 'PRECIO S/', editable: true, width:120},
]
export default function OpSolicitudes() 
{
    const loadData = async () => {
        const data = await OpcionesService.fetchItems<ITipoSolicitud>(Collection.Tiposolicitud)
        setRows(data)
    }
    //Hooks *****************************************************************
    //const documents = useStore(useDocumentsStore, (state) => state.documents)
    const [ openDialog, setOpenDialog ] = React.useState<boolean>(false)
    const [rows, setRows] = React.useState<ITipoSolicitud[]>([])
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
    const [idToDelete, setIdToDelete] = React.useState<GridRowId | null>(null);

    React.useEffect(()=>{
        loadData()
    },[])

    //Dialog ***************************************************************
    const handleConfirmDelete = async () => {
        if (idToDelete) {
            await OpcionesService.deleteItem(Collection.Tiposolicitud, Number(idToDelete))
            setRows(rows.filter((row) => row.id !== idToDelete));
            setIdToDelete(null);
            setOpenDialog(false);
        }
    };

    //DataGrid **************************************************************
    const handleDeleteClick = (id: GridRowId) => () => {    
        setIdToDelete(id)
        setOpenDialog(true)
    };

    const processRowUpdate = async(newRow: GridRowModel) => {
        //New or Update in DB
        let id:number | undefined
        if(newRow.isNew){
            const res = await OpcionesService.newItem<ITipoSolicitud>(Collection.Tiposolicitud,newRow as ITipoSolicitud)
            id = (res as ITipoSolicitud).id
        }else{
            OpcionesService.updateItem<ITipoSolicitud>(Collection.Tiposolicitud, newRow as ITipoSolicitud)
        }
        const updatedRow:ITipoSolicitud = {
            id:newRow.isNew ? id : newRow.id, 
            solicitud:newRow.solicitud, 
            precio: newRow.precio,
            isNew: false 
        };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleNewClick = () => {
        const id = Math.floor(Math.random()*90)+10;
        setRows((oldRows) => [...oldRows, { id, solicitud: '', precio: 0, isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'solicitud' },
        }));
    }

    return (
        <React.Fragment>
            <Button variant="contained" endIcon={<AddIcon /> } sx={{mb:1}} onClick={handleNewClick}>
                Nuevo Documento
            </Button>
            <EditableDataGrid
                columns={cols}
                rows={rows}
                setRows={setRows} 
                rowModesModel={rowModesModel}
                setRowModesModel={setRowModesModel}
                handleDeleteClick={handleDeleteClick}
                processRowUpdate={processRowUpdate}
            />
            
            <MyDialog
                type='ALERT'
                title='Borrar Registro'
                content="Confirma borrar el registro?"
                open={openDialog}
                setOpen={setOpenDialog}
                actionFunc={handleConfirmDelete} 
            /> 
        </React.Fragment>
    )
}
