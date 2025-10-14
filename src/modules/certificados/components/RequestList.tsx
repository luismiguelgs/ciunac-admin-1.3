'use client'
import { ISolicitudRes } from '@/modules/solicitudes/interfaces/solicitudres.interface';
import SolicitudesService from '@/modules/solicitudes/services/solicitud.service';
import { Box, Button } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel, GridToolbar } from '@mui/x-data-grid';
import React from 'react'
import LanguageIcon from '@mui/icons-material/Language';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import PrintIcon from '@mui/icons-material/Print';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { formatDate } from '@/lib/utils';

enum FiltrosSolicitud {
    EXAMEN = 'examenes-ubiaccion',
    CONSTANCIAS = 'constancias',
    CERTIFICADO = 'certificados'
}

type Props = {
    setRequest: React.Dispatch<React.SetStateAction<ISolicitudRes | undefined>>,
    setReload: React.Dispatch<React.SetStateAction<boolean>>,
    setOpenDialogFull : React.Dispatch<React.SetStateAction<boolean>>,
    filtro?: 'EXAMEN' | 'CONSTANCIAS' | 'CERTIFICADO'
}

export default function RequestList({setOpenDialogFull, setRequest, setReload, filtro='CERTIFICADO'}:Props) 
{
    const [data, setData] = React.useState<ISolicitudRes[]>([]);
    const [selectionModel, setSelectionModel] = React.useState<GridRowSelectionModel>([]);

    React.useEffect(() => {
        const getData = async() => {
            switch (filtro) {
                case 'EXAMEN':
                    const res = await SolicitudesService.fetchItemByState(FiltrosSolicitud.EXAMEN,1)
                    setData(res)
                    break;
                case 'CONSTANCIAS':
                    const res2 = await SolicitudesService.fetchItemByState(FiltrosSolicitud.CONSTANCIAS,1)
                    setData(res2)
                    break;
                case 'CERTIFICADO':
                    const res3 = await SolicitudesService.fetchItemByState(FiltrosSolicitud.CERTIFICADO,1)
                    setData(res3)
                    break;
            }
        }
        getData()
    }, []);

    const handleSaveSelection = async() => {
        const selectedItems = data.filter(item => selectionModel.includes(item.id as number));
        console.log('Selected Items:', selectedItems);
        setRequest(selectedItems[0])
        setReload((oldValue)=> !oldValue)
        //SolicitudesService.updateStatus(selectedItems[0].id as string, 'ASIGNADO')
        setOpenDialogFull(false)
    }

    const columns: GridColDef[] = [
        {
            field: 'manual',
            type: 'boolean',
            headerName: 'ONLINE',
            renderCell(params) {
                if(params.value){
                    return <KeyboardIcon color="secondary"/>
                }else{
                    return <LanguageIcon color="primary"/>
                }
            },
        },{
            field: 'digital',
            type: 'boolean',
            headerName: 'DIGITAL',
            renderCell(params) {
                if(params.value){
                    return <PictureAsPdfIcon color="secondary"/>
                }else{
                    return <PrintIcon color="primary"/>
                }
            },
        },
        {
            field: 'periodo',
            headerName: 'PERIODO',
            type: 'string',
            width: 100
        },
        {
            field: 'creadoEn',
            type: 'string',
            width: 200,
            renderHeader:() => (
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
        { field: 'estudiante.apellidos', type: 'string', headerName: 'APELLIDOS', width:200, valueGetter: (_v, row) => row.estudiante?.apellidos ?? '' },
        { field: 'estudiante.nombres', type: 'string', headerName: 'NOMBRES', width:200, valueGetter: (_v, row) => row.estudiante?.nombres ?? '' },
        { field: 'idioma.nombre', type: 'string', headerName: 'IDIOMA', width: 120, valueGetter: (_v, row) => row.idioma?.nombre ?? '' },
        { field: 'nivel.nombre', type: 'string', headerName: 'NIVEL', width: 120, valueGetter: (_v, row) => row.nivel?.nombre ?? '' },
    ];
    
    return (
        <React.Fragment>
            <Box p={2}>
                <Box p={2} style={{ minHeight: 400, width: '100%' }}>
                        <DataGrid
                            rowHeight={25}
                            rows={data}
                            slots={{
                                toolbar: GridToolbar,}}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 25,
                                    },
                                }
                            }}
                            pageSizeOptions={[10, 25, 50,100]}
                            rowSelection={true}
                            onRowSelectionModelChange={(newSelectionModel) => {
                                setSelectionModel(newSelectionModel);
                            }}
                            rowSelectionModel={selectionModel}
                            slotProps={{
                                columnsManagement: {
                                    disableResetButton: true,
                                    disableShowHideToggle: true,
                                }
                            }}
                        />
                </Box>
                <Button variant="contained" color="primary" onClick={handleSaveSelection}>
                    Asignar Solicitud
                </Button>
            </Box>
        </React.Fragment>
    )
}
