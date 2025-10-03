'use client'
import useStore from '@/hooks/useStore'
import { IexamenNotas } from '@/interfaces/examen.interface'
import { Isolicitud } from '@/modules/solicitudes/interfaces/solicitud.interface'
import { Collection, ExamenesService } from '@/services/examenes.service'
import SolicitudesService from '@/services/solicitudes.service'
import { useSubjectsStore } from '@/modules/opciones/store/types.stores'
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'
import React from 'react'
import LanguageIcon from '@mui/icons-material/Language';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { Box, Button } from '@mui/material'

type Props = {
    examenId : string,
    idioma : string,
    setReload: React.Dispatch<React.SetStateAction<boolean>>,
    setOpenDialogFull : React.Dispatch<React.SetStateAction<boolean>>
}

export default function ExamRequests({examenId, setReload, setOpenDialogFull, idioma}:Props) 
{
    const subjects = useStore(useSubjectsStore, (state) => state.subjects)
    const [data, setData] = React.useState<Isolicitud[]>([]);
    const [selectionModel, setSelectionModel] = React.useState<GridRowSelectionModel>([]);

    React.useEffect(() => {
        SolicitudesService.fetchItemQuery(setData, 'NUEVO', 'EXAMEN')
    }, []);

    const handleSaveSelection = async() => {
        const selectedItems = data.filter(item => selectionModel.includes(item.id as string));
        console.log('Selected Items:', selectedItems);
        selectedItems.forEach((element)=>{
            const item : IexamenNotas = {
                examen_id: examenId,
                solicitud_id: element.id as string,
                idioma: element.idioma as string,
                nivel: element.nivel as string,
                apellidos: element.apellidos as string,
                nombres: element.nombres as string,
                dni: element.dni as string,
                numero_voucher: element.numero_voucher as string,
                monto: Number(element.pago ?? 0),
                nota: 0,
                ubicacion: '',
                terminado: false
            }
            //asigna participante
            asignarExamen(item)
            //actuliza el estado de la solicitud
            SolicitudesService.updateStatus(element.id as string, 'ELABORADO')
        })
        //recarga tabla de notas
        setReload((oldValue)=> !oldValue)
        //actualizar el estado del examen
        ExamenesService.updateStatus(examenId, 'ASIGNADO')
        //cierra el dialogo
        setOpenDialogFull(false)
    };

    const asignarExamen = async(item:IexamenNotas) => {
        await ExamenesService.newItem(Collection.Examenes_notas, item)
    }

    const columns: GridColDef[] = [
        {
            field: 'manual',
            type: 'boolean',
            headerName: '',
            renderCell(params) {
                if(params.value){
                    return <KeyboardIcon color="secondary"/>
                }else{
                    return <LanguageIcon color="primary"/>
                }
            },
        },
        {
            field: 'creado',
            type: 'string',
            renderHeader:() => (
                <strong>
                    {'FECHA '}
                    <span role='img' aria-label='date'>
                        📆
                    </span>
                </strong>
            ), 
            renderCell: (params) => (
                <strong>{new Date(params.value).toLocaleDateString('es-ES')}</strong>
            )
        },
        { field: 'apellidos', type: 'string', headerName: 'APELLIDOS', width:200 },
        { field: 'nombres', type: 'string', headerName: 'NOMBRES', width:200 },
        { 
            field: 'idioma', 
            type: 'singleSelect', 
            headerName: 'IDIOMA',
            valueOptions: subjects,
            editable: false,
            width: 150
        },
        { field: 'nivel', type: 'string', headerName: 'NIVEL'  },
        { 
            field: 'pago', 
            headerName: 'MONTO(S/)', 
            align: 'right',
            renderCell(params) {
                return (<span>{`S/${Number(params.value).toFixed(2)}`}</span>)
            },
        }
    ];


    return (
        <React.Fragment>
            <Box p={2}>
                <Box p={2} style={{ minHeight: 400, width: '100%' }}>
                    <DataGrid
                        rows={data.filter((row) => row.idioma === idioma)}
                        columns={columns}
                        checkboxSelection
                        onRowSelectionModelChange={(newSelectionModel) => {
                            setSelectionModel(newSelectionModel);
                        }}
                        rowSelectionModel={selectionModel}
                    />
                </Box>
                <Button variant="contained" color="primary" onClick={handleSaveSelection}>
                    Asignar Participante (S)
                </Button>
            </Box>
        </React.Fragment>
    )
}
