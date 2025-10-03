'use client'
import { Button } from '@mui/material'
import { GridColDef, GridRowId, GridRowModel, GridRowModes, GridRowModesModel } from '@mui/x-data-grid'
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import EditableDataGrid from '@/components/MUI/EditableDataGrid'
import { MyDialog } from '@/components/MUI'
import { Collection, OpcionesService } from '@/services/opciones.service'
import { Isalon } from '@/modules/opciones/interfaces/types.interface';

const cols:GridColDef[] = [
    {field: 'value',  headerName: 'VALOR', editable: true, width:220},
    {field: 'label',  type: 'string', headerName: 'ETIQUETA', editable: true, width:280},
    {field: 'capacidad', type: 'number', headerName: 'CAPACIDAD', editable: true},
    {field: 'creado', headerName: 'CREADO', editable:false, width:160},
    //{field: 'modificado', headerName: 'MODIFICADO', editable:false, width:160},
]

export default function Classrooms() 
{
    const loadData = async () =>{
        const data = await OpcionesService.fetchItems<Isalon>(Collection.Salones)
        setRows(data)
    }
    //hooks ****
    const [rows, setRows] = React.useState<Isalon[]>([])
    const [ openDialog, setOpenDialog ] = React.useState<boolean>(false)
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
    const [idToDelete, setIdToDelete] = React.useState<GridRowId | null>(null);

    React.useEffect(()=>{
        loadData()
    },[])

    //dialog ***
    const handleConfirmDelete = async () => {
        if (idToDelete) {
            await OpcionesService.deleteItem(Collection.Salones, idToDelete as string)
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
        let id:string | undefined
        if(newRow.isNew){
            id = await OpcionesService.newItem<Isalon>(Collection.Salones,newRow as Isalon)
        }else{
            OpcionesService.updateItem<Isalon>(Collection.Salones, newRow as Isalon)
        }
        const updatedRow:Isalon = {
            id:newRow.isNew ? id : newRow.id, 
            value:newRow.value, 
            label:newRow.label, 
            capacidad: newRow.capacidad,
            creado:newRow.creado,
            isNew: false 
        };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };
    const handleNewClick = () => {
        const id = Math.floor(Math.random()*100).toString();
        setRows((oldRows) => [...oldRows, { id, value: '', label: '', capacidad: 0, isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'value' },
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
