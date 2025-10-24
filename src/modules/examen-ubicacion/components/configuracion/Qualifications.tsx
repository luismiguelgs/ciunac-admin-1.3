'use client'
import ICalificacionUbicacion from "../../interfaces/calificacion.interface";
import  CalificacionesService from '../../services/calificaciones.service';
import { GridColDef, GridRowId, GridRowModel, GridRowModes, GridRowModesModel } from '@mui/x-data-grid'
import React from 'react'
import { Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import { MyDialog } from '@/components/MUI'
import useOpciones from '@/modules/opciones/hooks/use-opciones';
import { Collection } from '@/modules/opciones/services/opciones.service';
import useCalificacionesExamenUbicacion from '@/modules/examen-ubicacion/hooks/useCalificaciones';
import ICiclo from '@/modules/opciones/interfaces/ciclo.interface';
import EditableDataGrid from "@/components/MUI/EditableDataGrid";

export default function Qualifications() 
{
    //Hooks ************
    const {data: ciclos} = useOpciones<ICiclo>(Collection.Ciclos)
    const {data, setData, loading }  = useCalificacionesExamenUbicacion()
    const [ openDialog, setOpenDialog ] = React.useState<boolean>(false)
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
    const [idToDelete, setIdToDelete] = React.useState<GridRowId | null>(null);

    //dialog ************
    const handleConfirmDelete = async () => {
        if (idToDelete) {
            await CalificacionesService.delete(idToDelete as number)
            setData(data.filter((row) => row.id !== idToDelete));
            setIdToDelete(null);
            setOpenDialog(false);
        }
    }; 
    //datagrid ************
    const cicloOptions = React.useMemo(() => (
            (ciclos ?? []).map(i => ({ value: i.id as number, label: i.nombre }))
    ), [ciclos]);

    const handleProcessRowUpdateError = (error: unknown) => {
        console.error('processRowUpdate error (Calificaciones):', error);
    };

    const handleDeleteClick = (id: GridRowId) => () => {    
            setIdToDelete(id)
            setOpenDialog(true)
    };
    
    const handleNewClick = () => {
        const id = 100 + Math.floor(Math.random()*100);
        const usedCicloIds = new Set((data ?? []).map(r => r.cicloId));
        const firstAvailableCicloId = (ciclos ?? [])
            .map(c => c.id as number)
            .find(cid => !usedCicloIds.has(cid)) ?? 0;
        setData((oldRows) => [...oldRows, { 
            id, 
            cicloId: firstAvailableCicloId,
            notaMin: 0,
            notaMax: 0,
            isNew: true, 
        }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'cicloId' },
        }));
    }
    const processRowUpdate = async(newRow: GridRowModel) => {
        //New or Update in DB
        const ciclo = ciclos?.find(c => c.id === newRow.cicloId)
        let id:number | undefined
        if(newRow.isNew){
            const res = await CalificacionesService.create({...newRow,...ciclo} as ICalificacionUbicacion)
            id = res?.id
        }else{
            await CalificacionesService.update(newRow.id as number, {...newRow,...ciclo} as ICalificacionUbicacion)
        }
        const updatedRow:ICalificacionUbicacion = {
            id:newRow.isNew ? id : newRow.id, 
            cicloId:newRow.cicloId, 
            notaMin: newRow.notaMin,
            notaMax: newRow.notaMax,
            isNew: false 
        };
        setData(data.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    //Columnas ***************
    const columns: GridColDef[] = [
        {
            field: 'cicloId', 
            type: 'singleSelect', 
            headerName: 'CICLO',
            valueOptions: (params) => {
                const used = new Set((data ?? [])
                    .filter(r => r.id !== params.id)
                    .map(r => r.cicloId)
                );
                return cicloOptions.filter(opt => opt.value === params.row.cicloId || !used.has(opt.value));
            },
            editable: true,
            width: 250
        },
        {
            field: 'notaMin', 
            type: 'number', 
            headerName: 'NOTA MIN.',
            editable: true,
            width: 160
        },
        {
            field: 'notaMax',
            type: 'number',
            headerName: 'NOTA MAX.',
            editable: true,
            width: 160
        }
    ]

    return (
        <div>
            <Button variant="contained" endIcon={<AddIcon /> } sx={{mb:1}} onClick={handleNewClick}>
                Nueva Calificación
            </Button>
            {loading ? (
                <p>Cargando Calificaciones, por favor espere...</p>
            ) : (
                <EditableDataGrid
                    columns={columns}
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
