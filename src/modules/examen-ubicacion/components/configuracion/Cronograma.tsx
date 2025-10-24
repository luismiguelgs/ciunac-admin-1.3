'use client'
import { MyDialog } from '@/components/MUI'
import EditableDataGrid from '@/components/MUI/EditableDataGrid'
import NewButton from '@/components/NewButton'
import useCronogramas from '@/modules/examen-ubicacion/hooks/useCronogramas'
import IcronogramaExam from '@/modules/examen-ubicacion/interfaces/cronogramaExam.interface'
import CronogramaExamService from '@/modules/examen-ubicacion/services/cronogramaExam.service'
import { Box, Checkbox } from '@mui/material'
import { GridColDef, GridRowId, GridRowModel, GridRowModes, GridRowModesModel } from '@mui/x-data-grid'
import React from 'react'
import useModulos from '@/modules/opciones/hooks/use-opciones'
import {Collection} from '@/modules/opciones/services/opciones.service'
import { IModulo } from '@/modules/opciones/interfaces/types.interface'

export default function Cronograma() 
{
    const {data: modulos} = useModulos(Collection.Modulos)
    const [ openDialog, setOpenDialog ] = React.useState<boolean>(false)
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
    const [idToDelete, setIdToDelete] = React.useState<GridRowId | null>(null);

    const {data, loading, setData} = useCronogramas();


    //dialog ***
    const handleConfirmDelete = async () => {
        if (idToDelete) {
            await CronogramaExamService.delete(idToDelete as number)
            setData(data.filter((row) => row.id !== idToDelete));
            setIdToDelete(null);
            setOpenDialog(false);
        }
    }; 

    //datagrid ***
    const handleDeleteClick = (id: GridRowId) => () => {    
        setIdToDelete(id)
        setOpenDialog(true)
    };

    const handleNewClick = () => {
        const id = 100 + Math.floor(Math.random()*100);
        setData((oldRows) => [...oldRows, { 
            id, 
            moduloId: 1,
            fecha: new Date(), 
            creadoEn: new Date(),
            activo: false,
            modificadoEn: new Date(),
            isNew: true, 
        }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'moduloId' },
        }));
    }
    const processRowUpdate = async(newRow: GridRowModel) => {
            //New or Update in DB
            let id:number | undefined
            if(newRow.isNew){
                const res = await CronogramaExamService.create(newRow as IcronogramaExam)
                id = res?.id
            }else{
                CronogramaExamService.update(newRow.id as number, newRow as IcronogramaExam)
            }
            const updatedRow:IcronogramaExam = {
                id:newRow.isNew ? id : newRow.id, 
                moduloId:newRow.moduloId, 
                fecha: new Date(newRow.fecha),
                creadoEn:new Date(newRow.creadoEn),
                modificadoEn:new Date(newRow.modificadoEn),
                activo:newRow.activo,
                isNew: false 
            };
            setData(data.map((row) => (row.id === newRow.id ? updatedRow : row)));
            return updatedRow;
    };

    const handleCheckboxChange = async (id:GridRowId, checked:boolean) => {
            setData((prevRows) =>
                prevRows.map((row) =>
                    row.id === id ? { ...row, activo: checked } : row
                )
            );
            await CronogramaExamService.updateStatus(id as number, checked)
        }

    const cols:GridColDef[] = [
        {
            field: 'moduloId',  
            headerName: 'PERIODO', 
            editable: true, 
            width:150, 
            type: 'singleSelect',
            valueOptions: (modulos as IModulo[])?.map((item) => ({ value: item.id, label: item.nombre })),
            
        },
        {
            field: 'fecha',  
            type: 'date', 
            headerName: 'FECHA DEL EXAMEN', 
            editable: true, 
            width:170,
            renderCell: (params) => {
                const raw = params?.row?.fecha;
                if (!raw) return '';
                const d =
                raw instanceof Date ? raw :
                (typeof raw === 'string' ? new Date(raw) : new Date(String(raw)));
                return !isNaN(d.getTime())
                ? d.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    timeZone: 'UTC',
                    })
                : '';
            },
        },
        {
            field: 'activo',
            headerName: 'ACTIVO',
            editable: true,
            type: 'boolean',
            width: 100,
            renderCell: (params) => {
                return <Checkbox 
                    checked={params.value as boolean || false}
                    onChange={(e)=>{handleCheckboxChange(params.id as GridRowId, e.target.checked)}} 
                    inputProps={{'aria-label': 'Checkbox Activo'}}
                />
            }
        },
        {field: 'creadoEn', type:'string', headerName: 'CREADO', editable:false, width:160},
        {field: 'modificadoEn', type:'string', headerName: 'MODIFICADO', editable:false, width:160},
    ]

    return (
        <React.Fragment>
            <NewButton text='Nuevo Cronograma' onClick={handleNewClick} link={false}/>
            <Box sx={{ width: '100%' , mt:2}}>    
                {!loading && <EditableDataGrid 
                    columns={cols}
                    rows={data}
                    setRows={setData}
                    rowModesModel={rowModesModel}
                    setRowModesModel={setRowModesModel}
                    handleDeleteClick={handleDeleteClick}
                    processRowUpdate={processRowUpdate}
                    onProcessRowUpdateError={(err)=>{console.error('processRowUpdate error (Cronograma):', err)}}
                />}         
            </Box>
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
