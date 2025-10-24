'use client'

import useOpciones from "../hooks/use-opciones";
import OpcionesService, { Collection } from "../services/opciones.service";
import { IModulo } from "../interfaces/types.interface";
import React from "react";
import { GridColDef, GridRowId, GridRowModel, GridRowModes, GridRowModesModel } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditableDataGrid from '@/components/MUI/EditableDataGrid'
import { MyDialog } from '@/components/MUI'

export default function OpModulos() 
{
    //hooks ***************************************************************
    const {data, loading, setData} = useOpciones<IModulo>(Collection.Modulos);
    const [ openDialog, setOpenDialog ] = React.useState<boolean>(false)
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
    const [idToDelete, setIdToDelete] = React.useState<GridRowId | null>(null);

    //Dialog ***************************************************************
    const handleConfirmDelete = async () => {
        if (idToDelete) {
            await OpcionesService.deleteItem(Collection.Modulos, Number(idToDelete));
            setData(data.filter((row) => row.id !== idToDelete));
            setIdToDelete(null);
            setOpenDialog(false);
        }
    };

    //Datagrid *************************************************************
    const handleDeleteClick = (id: GridRowId) => () => {    
        setIdToDelete(id)
        setOpenDialog(true)
    };

    const handleProcessRowUpdateError = (error: unknown) => {
        console.error('processRowUpdate error (Modulos):', error);
    };

    const processRowUpdate = async(newRow: GridRowModel) => {
        //New or Update in DB
        let id:number | undefined
        if(newRow.isNew){
            const res = await OpcionesService.newItem(Collection.Modulos, newRow as unknown as IModulo)
            id = (res as IModulo).id
        }else{
            const data = {
                ...newRow,
                fechaInicio: (new Date(newRow.fechaInicio)).toISOString(),
                fechaFin: (new Date(newRow.fechaFin)).toISOString()
            }
            await OpcionesService.updateItem(Collection.Modulos, data as unknown as IModulo)
        }
        const updatedRow:IModulo = {
            id:newRow.isNew ? id : newRow.id, 
            nombre:newRow.nombre, 
            fechaInicio:newRow.fechaInicio,
            fechaFin:newRow.fechaFin,
            orden:newRow.orden,
            isNew: false 
        };
        setData(data.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleNewClick = () => {
        const id = Math.floor(Math.random()*90)+10;
        setData((oldRows) => [...oldRows, { 
            id, 
            nombre: '', 
            fechaInicio: new Date(), 
            fechaFin: new Date(), 
            orden: 0,
            isNew: true 
        }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'nombre' },
        }));
    }
    
    const cols:GridColDef[] = [
        {field: 'id', headerName: 'ID', editable: false, width:100},
        {field: 'nombre', headerName: 'NOMBRE', editable: true, width:140},
        {field: 'fechaInicio', headerName: 'FECHA INICIO', editable: true, width:160},
        {field: 'fechaFin', headerName: 'FECHA FIN', editable: true, width:160},
        {field: 'orden', headerName: 'ORDEN', editable: true, width:160},
    ]

    return (
        <React.Fragment>
            <Button variant="contained" endIcon={<AddIcon /> } sx={{mb:1}} onClick={handleNewClick}>
                Nuevo Módulo
            </Button>
            {loading ? (
                <p>Cargando módulos, por favor espere...</p>
            ) : (
                <EditableDataGrid
                    columns={cols}
                    rows={data}
                    setRows={setData} 
                    rowModesModel={rowModesModel}
                    setRowModesModel={setRowModesModel}
                    handleDeleteClick={handleDeleteClick}
                    processRowUpdate={processRowUpdate}
                    onProcessRowUpdateError={handleProcessRowUpdateError}
                />
            )}
            
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