'use client'
import { Isolicitud } from '@/modules/solicitudes/interfaces/solicitud.interface';
import SolicitudesService from '@/services/solicitudes.service';
import React from 'react'
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId, GridRowParams, GridToolbar, GridToolbarContainerProps, GridToolbarQuickFilter } from '@mui/x-data-grid';
import LanguageIcon from '@mui/icons-material/Language';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { formatDate } from '@/lib/utils';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Grid from '@mui/material/Grid2'
import NewButton from '@/components/NewButton';
import { Box, Portal } from '@mui/material';
import { IBaseData } from '@/modules/opciones/interfaces/types.interface';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useRouter } from 'next/navigation';
import { getIconByCode } from '@/lib/common';

function MyCustomToolbar(props: GridToolbarContainerProps){
    return(
        <React.Fragment>
            <Portal container={()=>document.getElementById('filter-panel')!}>
                <GridToolbarQuickFilter />
            </Portal>
            <GridToolbar {...props} />
        </React.Fragment>
    )
}


export function RequestState(props:{state:string, documents:IBaseData[]|undefined, subjects:IBaseData[]|undefined, handleDetails:(id:GridRowId) => void, handleDelete:(id:GridRowId) => void}) 
{
    const [data, setData] = React.useState<Isolicitud[]>([]);
    const router = useRouter();

    React.useEffect(()=>{
        SolicitudesService.fetchItemQuery(setData, props.state, 'CONSTANCIAS')
    },[]);


    const columns: GridColDef[] = [
        {
            field: 'manual',
            width: 80,
            type: 'boolean',
            headerName: 'ONLINE',
                renderCell(params) {
                    if(params.value){
                        return <KeyboardIcon color="secondary"/>
                    }else{
                        return <LanguageIcon color="primary"/>
                    }
                }
        },
        { field: 'periodo', type: 'string', headerName: 'PERIODO', width: 85 },
        { 
            field: 'solicitud', 
            type: 'singleSelect', 
            headerName: 'SOLICITUD',
            valueOptions: props.documents,
            editable: false,
            width: 210
        },
        {
            field: 'creado',
            type: 'string',
            width: 160,
            renderHeader:() => (
                <strong>
                    {'FECHA '}
                    <span role='img' aria-label='date'>
                        📆
                    </span>
                </strong>
            ),
            valueGetter: (_value, row) => { // Accede a la fila para obtener 'creado'
                const createdValue = row.creado;
                return formatDate(createdValue);
            },
        },
        { field: 'apellidos', type: 'string', headerName: 'APELLIDOS', width:160 },
        { field: 'nombres', type: 'string', headerName: 'NOMBRES', width:160 },
        {
            field: 'idioma',
            width: 80,
            type: 'string',
            headerName: 'IDIOMA',
                renderCell(params) {
                   return getIconByCode(params.value)
                }
        },
        { field: 'nivel', type: 'string', headerName: 'NIVEL', width: 100  },
        { 
            field: 'actions', 
            type: 'actions', 
            getActions: (params:GridRowParams) => [
                <GridActionsCellItem
                    key={1}
                    icon={<VisibilityIcon />}
                    label='Detalles'
                    onClick={()=>props.handleDetails(params.id)}
                />,
                <GridActionsCellItem 
                    key={2}
                    showInMenu
                    icon={<PlayArrowIcon />}
                    label='Detalles'
                    onClick={()=>router.push(`/solicitudes/constancias/${params.id}`)}
                />,
                <GridActionsCellItem 
                    key={3}
                    showInMenu
                    icon={<DeleteIcon />}
                    label='Borrar'
                    onClick={()=>props.handleDelete(params.id)}
                />
            ]
        }
    ]
    return(
        <Grid container spacing={2}>
            <Grid size={{xs: 12, sm: 6}} >
                <NewButton text='Nueva Solicitud' url='/solicitudes/nuevo'/>
            </Grid>
            <Grid size={{xs: 12, sm: 6}} sx={{display:'flex', justifyContent:'flex-end'}}>
                <Box id='filter-panel' />
            </Grid>
            <Grid size={{xs: 12 }} minHeight={300}>
                <DataGrid 
                    pageSizeOptions={[10,25,100]}
                    rows={data}
                    //sx={{width:'98%', margin:'0 auto'}}
                    columns={columns}
                    disableColumnMenu
                    slots={{toolbar: MyCustomToolbar}}
                    initialState={{
                        filter:{
                            filterModel:{
                                items: [],
                                quickFilterExcludeHiddenColumns:true
                            }
                        }
                    }}
                    slotProps={{
                        columnsManagement:{
                            disableResetButton:true,
                            disableShowHideToggle: true
                        }
                    }}
                />
            </Grid>
        </Grid>
    )
}
