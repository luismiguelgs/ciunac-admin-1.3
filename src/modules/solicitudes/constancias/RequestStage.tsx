'use client'
import SolicitudesService from '../services/solicitud.service';
import React from 'react'
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId, GridRowParams, GridToolbar, GridToolbarContainerProps, GridToolbarQuickFilter } from '@mui/x-data-grid';
import LanguageIcon from '@mui/icons-material/Language';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { formatDate } from '@/lib/utils';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Grid from '@mui/material/Grid2'
import NewButton from '@/components/NewButton';
import { Box, Portal } from '@mui/material';
import { IBaseData } from '@/modules/opciones/interfaces/types.interface';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useRouter } from 'next/navigation';
import { getIconByCode } from '@/lib/common';
import { ISolicitudRes } from '../interfaces/solicitudres.interface';

function MyCustomToolbar(props: GridToolbarContainerProps) {
    return (
        <React.Fragment>
            <Portal container={() => document.getElementById('filter-panel')!}>
                <GridToolbarQuickFilter />
            </Portal>
            <GridToolbar {...props} />
        </React.Fragment>
    )
}


export function RequestState(props: { state: number, documents: IBaseData[] | undefined, subjects: IBaseData[] | undefined, handleDetails: (id: GridRowId) => void, handleDelete: (id: GridRowId) => void }) {
    const [data, setData] = React.useState<ISolicitudRes[]>([]);
    const router = useRouter();

    React.useEffect(() => {
        const getData = async () => {
            const res = await SolicitudesService.fetchItemByState('constancias', Number(props.state))
            setData(res)
        }
        getData()
    }, [props.state]);


    const columns: GridColDef[] = [
        {
            field: 'manual',
            width: 80,
            type: 'boolean',
            headerName: 'ONLINE',
            renderCell(params) {
                if (params.value) {
                    return <KeyboardIcon color="secondary" />
                } else {
                    return <LanguageIcon color="primary" />
                }
            }
        },
        { field: 'periodo', type: 'string', headerName: 'PERIODO', width: 85 },
        {
            field: 'tiposSolicitud.solicitud',
            type: 'string',
            headerName: 'SOLICITUD',
            editable: false,
            width: 210,
            valueGetter: (_value, row) => row.tiposSolicitud?.solicitud ?? ''
        },
        {
            field: 'creadoEn',
            type: 'string',
            width: 160,
            renderHeader: () => (
                <strong>
                    {'FECHA '}
                    <span role='img' aria-label='date'>
                        📆
                    </span>
                </strong>
            ),
            valueGetter: (_value, row) => { // Accede a la fila para obtener 'creado'
                const createdValue = row.creadoEn;
                return formatDate(createdValue);
            },
        },
        { field: 'estudiante.apellidos', type: 'string', headerName: 'APELLIDOS', width: 160, valueGetter: (_v, row) => row.estudiante?.apellidos ?? '' },
        { field: 'estudiante.nombres', type: 'string', headerName: 'NOMBRES', width: 160, valueGetter: (_v, row) => row.estudiante?.nombres ?? '' },
        {
            field: 'idiomaId',
            width: 80,
            type: 'string',
            headerName: 'IDIOMA',
            valueGetter: (_v, row) => row.idiomaId ?? '',
            renderCell(params) {
                return getIconByCode(Number(params.value))
            }
        },
        { field: 'nivel.nombre', type: 'string', headerName: 'NIVEL', width: 100, valueGetter: (_v, row) => row.nivel?.nombre ?? '' },
        {
            field: 'actions',
            type: 'actions',
            getActions: (params: GridRowParams) => [
                <GridActionsCellItem
                    key={1}
                    icon={<VisibilityIcon />}
                    label='Detalles'
                    onClick={() => props.handleDetails(params.id)}
                />,
                <GridActionsCellItem
                    key={2}
                    showInMenu
                    icon={<PlayArrowIcon />}
                    label='Detalles'
                    onClick={() => router.push(`/solicitudes/constancias/${params.id}`)}
                />,
                <GridActionsCellItem
                    key={3}
                    showInMenu
                    icon={<ThumbDownIcon />}
                    label='Rechazar'
                    onClick={() => props.handleDelete(params.id)}
                />
            ]
        }
    ]
    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }} >
                <NewButton text='Nueva Solicitud' url='/solicitudes/nuevo' />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Box id='filter-panel' />
            </Grid>
            <Grid size={{ xs: 12 }} minHeight={300}>
                <DataGrid
                    pageSizeOptions={[10, 25, 100]}
                    rows={data}
                    //sx={{width:'98%', margin:'0 auto'}}
                    columns={columns}
                    disableColumnMenu
                    slots={{ toolbar: MyCustomToolbar }}
                    initialState={{
                        filter: {
                            filterModel: {
                                items: [],
                                quickFilterExcludeHiddenColumns: true
                            }
                        }
                    }}
                    slotProps={{
                        columnsManagement: {
                            disableResetButton: true,
                            disableShowHideToggle: true
                        }
                    }}
                />
            </Grid>
        </Grid>
    )
}
