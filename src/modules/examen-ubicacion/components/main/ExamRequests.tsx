'use client'
import { IDetalleExamenUbicacion } from '@/modules/examen-ubicacion/interfaces/examen-ubicacion.interface'
import SolicitudesService from '@/modules/solicitudes/services/solicitud.service'
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'
import React from 'react'
import LanguageIcon from '@mui/icons-material/Language';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { Box, Button } from '@mui/material'
import { ISolicitudRes } from '@/modules/solicitudes/interfaces/solicitudres.interface'
import ExamenesUbicacionService from '@/modules/examen-ubicacion/services/examenes-ubicacion.service'
import { getIconByCode } from '@/lib/common'
import ICalificacionUbicacion from '../../interfaces/calificacion.interface'

type Props = {
    examenId: number,
    idiomaId: number,
    setReload: React.Dispatch<React.SetStateAction<boolean>>,
    setOpenDialogFull: React.Dispatch<React.SetStateAction<boolean>>
    calificaciones: ICalificacionUbicacion[],
    obtenerResultado: (nota: number, idiomaId: number, nivelId: number, ubicaciones: ICalificacionUbicacion[]) => number | null
}

export default function ExamRequests({ examenId, setReload, setOpenDialogFull, idiomaId, calificaciones, obtenerResultado }: Props) {
    const [data, setData] = React.useState<ISolicitudRes[]>([]);
    const [selectionModel, setSelectionModel] = React.useState<GridRowSelectionModel>([]);

    React.useEffect(() => {
        const getData = async () => {
            const res = await SolicitudesService.fetchItemByState('examenes-ubicacion', 1)
            setData(res as ISolicitudRes[])
        }
        getData()
    }, []);

    const handleSaveSelection = async () => {
        const selectedItems = data.filter(item => selectionModel.includes(item.id as number));
        console.log('Selected Items:', selectedItems);

        // crea un array de promesas para todas las operaciones
        await Promise.all(
            selectedItems.map(async (element) => {
                const item: IDetalleExamenUbicacion = {
                    examenId: examenId,
                    solicitudId: Number(element.id),
                    idiomaId: element.idiomaId,
                    nivelId: element.nivelId,
                    estudianteId: element.estudianteId,
                    nota: 0,
                    calificacionId: obtenerResultado(0, element.idiomaId, element.nivelId, calificaciones) ?? 1, //no puede ser 0 debe calcular la calificaion segun el idioma y nivel
                    terminado: false
                };
                //asigna participante
                await ExamenesUbicacionService.createDetail(item);
                //actuliza el estado de la solicitud
                await SolicitudesService.updateStatus(element.id as number, 2)
            })
        );

        // actualizar estado del examen
        await ExamenesUbicacionService.updateStatus(examenId, 7);

        // recargar tabla
        setReload((oldValue) => !oldValue);
        // cerrar dialogo
        setOpenDialogFull(false);
    };

    const columns: GridColDef[] = [
        {
            field: 'manual',
            type: 'boolean',
            headerName: '',
            renderCell(params) {
                if (params.value) {
                    return <KeyboardIcon color="secondary" />
                } else {
                    return <LanguageIcon color="primary" />
                }
            },
        },
        {
            field: 'creadoEn',
            type: 'string',
            width: 120,
            renderHeader: () => (
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
        { field: 'estudiante.apellidos', type: 'string', headerName: 'APELLIDOS', width: 200, valueGetter: (_v, row) => row.estudiante?.apellidos ?? '' },
        { field: 'estudiante.nombres', type: 'string', headerName: 'NOMBRES', width: 200, valueGetter: (_v, row) => row.estudiante?.nombres ?? '' },
        {
            field: 'idioma',
            headerName: 'IDIOMA',
            editable: false,
            width: 80,
            valueGetter: (_v, row) => row.idiomaId ?? '',
            renderCell(params) {
                return getIconByCode(Number(params.value))
            }
        },
        { field: 'nivel.nombre', type: 'string', headerName: 'NIVEL', width: 130, valueGetter: (_v, row) => row.nivel?.nombre ?? '' },
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
                        rows={data.filter((row) => row.idiomaId === idiomaId)}
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