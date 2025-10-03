'use client'
import { IIdioma } from '@/modules/opciones/interfaces/types.interface'
import OpcionesService, { Collection } from '../services/opciones.service'
import { Button } from '@mui/material'
import { GridColDef, GridRowId, GridRowModel, GridRowModes, GridRowModesModel } from '@mui/x-data-grid'
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import EditableDataGrid from '@/components/MUI/EditableDataGrid'
import { MyDialog } from '@/components/MUI'

export default function OpIdiomas() 
{
    const loadData = async () => {
        const data = await OpcionesService.fetchItems<IIdioma>(Collection.Idiomas)
        setRows(data)
    }
    //Hooks *****************************************************************
    const [ openDialog, setOpenDialog ] = React.useState<boolean>(false)
    const [rows, setRows] = React.useState<IIdioma[]>([])
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
    const [idToDelete, setIdToDelete] = React.useState<GridRowId | null>(null);

    React.useEffect(()=>{
        loadData()
    },[])
    /*
    React.useEffect(()=>{
        loadData()
    },[rows])
    */
    //Dialog ***************************************************************
    const handleConfirmDelete = async () => {
        if (idToDelete) {
            await OpcionesService.deleteItem(Collection.Idiomas, Number(idToDelete));
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
            const res = await OpcionesService.newItem(Collection.Idiomas, newRow as IIdioma)
            id = (res as IIdioma).id
        }else{
            OpcionesService.updateItem(Collection.Idiomas, newRow as IIdioma)
        }
        const updatedRow:IIdioma = {
            id:newRow.isNew ? id : newRow.id, 
            nombre:newRow.nombre, 
            isNew: false 
        };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleNewClick = () => {
        const id = Math.floor(Math.random()*90)+10;
        setRows((oldRows) => [...oldRows, { id, nombre: '', isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'nombre' },
        }));
    }

    const cols:GridColDef[] = [
        {field: 'id', headerName: 'ID', editable: false, width:120},
        {field: 'nombre', headerName: 'NOMBRE', editable: true, width:340},
    ]

    return (
        <React.Fragment>
            <Button variant="contained" endIcon={<AddIcon /> } sx={{mb:1}} onClick={handleNewClick}>
                Nuevo Curso
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
