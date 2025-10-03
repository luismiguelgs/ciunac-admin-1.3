import React from 'react'
import Grid from '@mui/material/Grid2'
import { Box, Portal } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId, GridRowParams, GridToolbar, GridToolbarContainerProps, GridToolbarQuickFilter } from '@mui/x-data-grid'
import { Isolicitud } from '@/modules/solicitudes/interfaces/solicitud.interface'
import { useRouter } from 'next/navigation'
import SolicitudesService from '@/services/solicitudes.service'
import { formatDate } from '@/lib/utils'
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

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

export default function RequestStage(props:{state:string, handleDetails:(id:GridRowId) => void, handleDelete:(id:GridRowId) => void}) 
{
    const [data, setData] = React.useState<Isolicitud[]>([]);
    const router = useRouter();

    React.useEffect(()=>{
        SolicitudesService.fetchItemQuery(setData, props.state, 'BECA')
    },[]);

    const columns: GridColDef[] = [
        { field: 'periodo', type: 'string', headerName: 'PERIODO', width: 100 },
        {
            field: 'creado',
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
                const createdValue = row.creado;
                return formatDate(createdValue);
            },
        },
        { field: 'apellidos', type: 'string', headerName: 'APELLIDOS', width:200 },
        { field: 'nombres', type: 'string', headerName: 'NOMBRES', width:200 },
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
                    onClick={()=>router.push(`/solicitudes/becas/${params.id}`)}
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

    return (
        <Grid container spacing={2}>
            <Grid size={{xs: 12}} >
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
