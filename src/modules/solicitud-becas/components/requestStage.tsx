import React from 'react'
import Grid from '@mui/material/Grid2'
import { Box, Portal } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId, GridRowParams, GridToolbar, GridToolbarContainerProps, GridToolbarQuickFilter } from '@mui/x-data-grid'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ISolicitudBeca from '../interfaces/solicitud-beca.interfaces'
import { SolicitudBecasService } from '../services/solicitudes-beca.service'

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

export default function RequestStage(props:{state:string, handleDetails:(id:GridRowId) => void, handleDelete:(id:GridRowId) => void, deletedId?: string | null}) 
{
    const [data, setData] = React.useState<ISolicitudBeca[]>([]);
    const router = useRouter();

    React.useEffect(()=>{
        const getData = async(state:string) =>{
            const res = await SolicitudBecasService.fetchItemsByState(state)
            console.log(res)
            setData(res)
        }
        getData(props.state)
    },[]);

    React.useEffect(()=>{
        if(!props.deletedId) return;
        setData(prev => prev.filter(item => item.id !== props.deletedId));
    }, [props.deletedId]);

    const columns: GridColDef[] = [
        { field: 'periodo', type: 'string', headerName: 'PERIODO', width: 100 },
        {
            field: 'creado_en',
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
                const createdValue = row.creado_en;
                return formatDate(createdValue);
            },
        },
        { field: 'apellidos', type: 'string', headerName: 'APELLIDOS', width:180 },
        { field: 'nombres', type: 'string', headerName: 'NOMBRES', width:180 },
        { field: 'facultad', type: 'string', headerName: 'FACULTAD', width:200 },
        { field: 'escuela', type: 'string', headerName: 'ESCUELA', width:200 },
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
