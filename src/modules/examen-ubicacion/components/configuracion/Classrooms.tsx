'use client'
import { Button } from '@mui/material'
import { GridColDef, GridRowId, GridRowModel, GridRowModes, GridRowModesModel } from '@mui/x-data-grid'
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import EditableDataGrid from '@/components/MUI/EditableDataGrid'
import { MyDialog } from '@/components/MUI'
import OpcionesService, { Collection } from '@/modules/opciones/services/opciones.service'
import { ISalon } from '@/modules/opciones/interfaces/types.interface';

const cols:GridColDef[] = [
    {field: 'id',  headerName: 'ID', editable: true, width:220},
    {field: 'nombre',  type: 'string', headerName: 'ETIQUETA', editable: true, width:280},
    {field: 'capacidad', type: 'number', headerName: 'CAPACIDAD', editable: true},
    {field: 'tipo', headerName: 'TIPO', editable:true, width:160, type: 'singleSelect', valueOptions: ['VIRTUAL','FISICA']},
    {field: 'ubicacion', headerName: 'UBICACIÓN/LINK', editable:true, width:160},
]

export default function Classrooms() 
{
    const loadData = async () =>{
        const data = await OpcionesService.fetchItems<ISalon>(Collection.Salones)
        setRows(data)
    }
    //hooks ****
    const [rows, setRows] = React.useState<ISalon[]>([])
    const [ openDialog, setOpenDialog ] = React.useState<boolean>(false)
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
    const [idToDelete, setIdToDelete] = React.useState<GridRowId | null>(null);

    React.useEffect(()=>{
        loadData()
    },[])

    //dialog ***
    const handleConfirmDelete = async () => {
        if (idToDelete) {
            await OpcionesService.deleteItem(Collection.Salones, idToDelete as number)
            setRows(rows.filter((row) => row.id !== idToDelete));
            setIdToDelete(null);
            setOpenDialog(false);
        }
    }; 

    //datagrid ***
    const handleDeleteClick = (id: GridRowId) => () => {    
        setIdToDelete(id)
        setOpenDialog(true)
    };
    const processRowUpdate = async(newRow: GridRowModel) => {
        //New or Update in DB
        let id:number | undefined
        if(newRow.isNew){
            const res:ISalon = await OpcionesService.newItem<ISalon>(Collection.Salones,newRow as ISalon)
            id = res.id
        }else{
            OpcionesService.updateItem<ISalon>(Collection.Salones, newRow as ISalon)
        }
        const updatedRow:ISalon = {
            id:newRow.isNew ? id : newRow.id, 
            nombre:newRow.nombre, 
            capacidad:newRow.capacidad,
            tipo:newRow.tipo,
            ubicacion:newRow.ubicacion,
            isNew: false 
        };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };
    const handleProcessRowUpdateError = (error:any) => {
        // Loguea y deja visible el error; podrías mostrar un snackbar si prefieres
        console.error('Error al actualizar fila:', error);
    };
    const handleNewClick = () => {
        const id = 100 + Math.floor(Math.random()*900);
        setRows((oldRows) => [...oldRows, { id, nombre: '', tipo: 'FISICA', capacidad: 0, ubicacion: '', isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'nombre' },
        }));
    }

    return (
        <React.Fragment>
            <Button variant="contained" endIcon={<AddIcon /> } sx={{mb:1}} onClick={handleNewClick}>
                Nuevo Salón
            </Button>
            <EditableDataGrid 
                columns={cols}
                rows={rows}
                setRows={setRows}
                rowModesModel={rowModesModel}
                setRowModesModel={setRowModesModel}
                handleDeleteClick={handleDeleteClick}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={handleProcessRowUpdateError}
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
