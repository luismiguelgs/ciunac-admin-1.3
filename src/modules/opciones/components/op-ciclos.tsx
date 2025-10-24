'use client'
import React from 'react'
import useOpciones from '../hooks/use-opciones';
import ICiclo from '../interfaces/ciclo.interface';
import { IIdioma } from '../interfaces/types.interface';
import { Collection } from '../services/opciones.service';
import { GridColDef, GridRowId, GridRowModel, GridRowModes, GridRowModesModel } from '@mui/x-data-grid';
import OpcionesService from '../services/opciones.service';
import { Button } from '@mui/material';
import { MyDialog } from '@/components/MUI';
import EditableDataGrid from '@/components/MUI/EditableDataGrid';
import AddIcon from '@mui/icons-material/Add';
import { NIVEL } from '@/lib/constants';

export default function OpCiclos() 
{
    //hooks ***************************************************************
    const {data, loading, setData} = useOpciones<ICiclo>(Collection.Ciclos);
    const { data: idiomas } = useOpciones<IIdioma>(Collection.Idiomas);
    const [ openDialog, setOpenDialog ] = React.useState<boolean>(false)
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
    const [idToDelete, setIdToDelete] = React.useState<GridRowId | null>(null);

    //Dialog ***************************************************************
    const handleConfirmDelete = async () => {
        if (idToDelete) {
            await OpcionesService.deleteItem(Collection.Ciclos, Number(idToDelete));
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
        console.error('processRowUpdate error (Ciclos):', error);
    };

    // Options **************************************************************
    const idiomaOptions = React.useMemo(() => (
        (idiomas ?? []).map(i => ({ value: i.id as number, label: i.nombre }))
    ), [idiomas]);

    const nivelOptions = React.useMemo(() => (
        NIVEL.map(n => ({ value: Number(n.value), label: n.label }))
    ), []);

    const processRowUpdate = async(newRow: GridRowModel) => {
        //New or Update in DB
        let id:number | undefined
        if(newRow.isNew){
            const res = await OpcionesService.newItem(Collection.Ciclos, newRow as unknown as ICiclo)
            id = (res as ICiclo).id
        }else{
            delete newRow.idioma
            delete newRow.nivel
            await OpcionesService.updateItem(Collection.Ciclos, newRow as unknown as ICiclo)
        }
        const updatedRow:ICiclo = {
            id:newRow.isNew ? id : newRow.id, 
            nombre:newRow.nombre, 
            numeroCiclo:newRow.numeroCiclo,
            idiomaId:newRow.idiomaId,
            nivelId:newRow.nivelId,
            isNew: false 
        };
        setData(data.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleNewClick = () => {
        const id = Math.floor(Math.random()*90)+100;
        setData((oldRows) => [...oldRows, { 
            id, 
            nombre: '', 
            numeroCiclo: 0,
            idiomaId: 1,
            nivelId: 1,
            isNew: true 
        }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'nombre' },
        }));
    }
    
    const cols:GridColDef[] = [
        {field: 'id', headerName: 'ID', editable: false, width:80},
        {field: 'nombre', headerName: 'NOMBRE', editable: true, width:200},
        {field: 'idiomaId', headerName: 'IDIOMA', type: 'singleSelect', valueOptions: idiomaOptions, editable: true, width:180},
        {field: 'nivelId', headerName: 'NIVEL', type: 'singleSelect', valueOptions: nivelOptions, editable: true, width:160},
        {field: 'numeroCiclo', headerName: 'NÚMERO CICLO', editable: true, width:140, type:'number'},
    ]

    return (
        <div>
            <Button variant="contained" endIcon={<AddIcon /> } sx={{mb:1}} onClick={handleNewClick}>
                Nuevo Ciclo
            </Button>
            {loading ? (
                <p>Cargando ciclos, por favor espere...</p>
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
        </div>
    )
}