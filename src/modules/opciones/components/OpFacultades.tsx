'use client'
import { IFacultad } from '@/modules/opciones/interfaces/types.interface'
import OpcionesService, { Collection } from '@/modules/opciones/services/opciones.service'
import { GridColDef, GridRowId, GridRowModel, GridRowModes, GridRowModesModel } from '@mui/x-data-grid'
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import EditableDataGrid from '@/components/MUI/EditableDataGrid';
import { MyDialog } from '@/components/MUI';

export default function OpFacultades() 
{
    const loadData = async () => {
        const data = await OpcionesService.fetchItems<IFacultad>(Collection.Facultades)
        setRows(data)
    }
    //Hooks *****************************************************************
    const [ openDialog, setOpenDialog ] = React.useState<boolean>(false)
    const [rows, setRows] = React.useState<IFacultad[]>([])
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
            await OpcionesService.deleteItem(Collection.Facultades, idToDelete as number);
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
            const res = await OpcionesService.newItem(Collection.Facultades, newRow as IFacultad)
            id = (res as IFacultad).id
        }else{
            OpcionesService.updateItem(Collection.Facultades, newRow as IFacultad)
        }
        const updatedRow:IFacultad = {
            id:newRow.isNew ? id : newRow.id, 
            codigo:newRow.codigo, 
            nombre:newRow.nombre, 
            isNew: false 
        };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleNewClick = () => {
        const id = Math.floor(Math.random()*99)+10;
        setRows((oldRows) => [...oldRows, { id, codigo: '', nombre: '', isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'codigo' },
        }));
    }

    const cols:GridColDef[] = [
        {field: 'id', headerName: 'ID', editable: false, width:120},
        {field: 'codigo', headerName: 'CODIGO', editable: true, width:120},
        {field: 'nombre', headerName: 'NOMBRE', editable: true, width:340},
    ]
    return (
        <React.Fragment>
            <Button variant="contained" endIcon={<AddIcon /> } sx={{mb:1}} onClick={handleNewClick}>
                Nueva Facultad
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
