'use client'
import { useRouter } from 'next/navigation'
import useStore from '@/hooks/useStore'
import { Box, Portal } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId, GridRowParams, GridToolbar, GridToolbarProps, GridToolbarQuickFilter } from '@mui/x-data-grid'
import React from 'react'
import { useFacultiesStore } from '@/modules/opciones/store/types.stores'
import IProspecto from '../../../../interfaces/prospecto.interface'
import ProspectosService from '@/services/prospectos.service'
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Grid from '@mui/material/Grid2'
import NewButton from '@/components/NewButton'
import { MyDialog } from '@/components/MUI'

function MyCustomToolbar(props:GridToolbarProps ){
    return(
        <React.Fragment>
            <Portal container={()=>document.getElementById('filter-panel')!}>
                <GridToolbarQuickFilter />
            </Portal>
            <GridToolbar {...props} />
        </React.Fragment>
    )
}
export default function LeadsPage() 
{
	//Hooks *****************************************************************
    const faculties = useStore(useFacultiesStore, (state) => state.faculties)
    const navigate = useRouter()

    const [ open, setOpen ] = React.useState<boolean>(false)
    const [data, setData] = React.useState<IProspecto[]>([])
    const [idToDelete, setIdToDelete] = React.useState<GridRowId | null>(null);

    React.useEffect(()=>{
        const fetchData = async () => {
            const res = await ProspectosService.fetchItems()
            setData(res)
        }
        fetchData()
    },[])

	//Functions**************************************************************
    //Dialog
    const handleConfirmDelete = async () => {
        if (idToDelete) {
            await ProspectosService.deleteItem(idToDelete as string);
            setData(data.filter((row) => row.id !== idToDelete));
            setIdToDelete(null);
            setOpen(false);
        }
    };
    const handleDetails = (id:GridRowId) => {  
        navigate.push(`./prospectos/${id}`)
    }
    const handleDelete = (id:GridRowId) => {
        setIdToDelete(id)
        setOpen(true)
    }

	//DataGrid **************************************************************
    
    const columns:GridColDef[] = [
        {field: 'apellidos', headerName: 'APELLIDOS', width: 180},
        {field: 'nombres', headerName: 'NOMBRES'},
        {field: 'dni', headerName: 'DNI',},
        {field: 'trabajador', headerName: 'TRABAJADOR', type:'boolean', editable:false},
        {field: 'alumno_ciunac', headerName: 'ALUMNO CIUNAC', type:'boolean', editable:false},
        {field: 'telefono', headerName: 'TELÉFONO', width:160},
        {
            field: 'facultad', 
            headerName: 'FACULTAD', 
            width:180, 
            type:'singleSelect',
            valueOptions : faculties,
            editable: false
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Acciones',
            cellClassName: 'actions',
            getActions: (params:GridRowParams) => [
                <GridActionsCellItem
                    key={1}
                    icon={<VisibilityIcon />}
                    label='Detalles'
                    onClick={()=>handleDetails(params.id)}
                />,
                <GridActionsCellItem 
                    key={2}
                    showInMenu
                    icon={<DeleteIcon />}
                    label='Borrar'
                    onClick={()=>handleDelete(params.id)}
                />
            ]
        }
    ]
	return (
		<Grid container spacing={2}>
			<Grid size={{xs: 12, md:6}}>
				<NewButton text="Nuevo Prospecto" url="./prospectos/nuevo" />
			</Grid>
			<Grid size={{xs: 12, md:6}}>
				<Box id='filter-panel'  />
			</Grid>
			<Grid minHeight={300} size={{xs: 12}}>
				<DataGrid
                    pageSizeOptions={[10,25,100]}
                    rows={data}
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
			<MyDialog
                type='ALERT'
                title='Borrar Registro'
                content="Confirma borrar el registro?"
                open={open}
                setOpen={setOpen}
                actionFunc={handleConfirmDelete}
            /> 
		</Grid>
	)
}
