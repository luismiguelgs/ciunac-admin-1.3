'use client'
import React from 'react'
import Grid from '@mui/material/Grid2'
import NewButton from '@/components/NewButton'
import { Box, Portal } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId, GridRowParams, GridToolbar, GridToolbarProps, GridToolbarQuickFilter } from '@mui/x-data-grid'
import { IUsuario } from '../../../interfaces/usuario.interface'
import AuthService from '@/services/auth.service'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { MyDialog } from '@/components/MUI'
import FormUser from './(components)/FormUser'
import { validateUser } from '@/lib/utils'

const USER:IUsuario = {email:'',nombre:'', password:'', role:'USER'}

const roles = [
    {value: 'USER', label:'USUARIO'},
    {value: 'ADMIN', label: 'ADMINISTRADOR'}
]

function MyCustomToolbar(props: GridToolbarProps){
    return(
        <React.Fragment>
            <Portal container={()=>document.getElementById('filter-panel')!}>
                <GridToolbarQuickFilter />
            </Portal>
            <GridToolbar {...props} />
        </React.Fragment>
    )
}

export default function UsersPage() 
{
	//HOOKS ************
    const [item, setItem] = React.useState<IUsuario>(USER);
    const [data, setData] = React.useState<IUsuario[]>([])
    const [userVal, setUserVal] = React.useState({email:false, nombre:false, password:false})
    //dialog
    const [ID, setID] = React.useState<string| undefined>('');
    const [openDialog, setOpenDialog] = React.useState<boolean>(false);
    //dialog form
    const [openDialogForm, setOpenDialogForm] = React.useState<boolean>(false);

	React.useEffect(()=>{
        const loadData = async () => {
            const data = await AuthService.fetchItems()
            setData(data)
        }
        loadData()
    },[data])

	//FUNCTIONS *************************
    const handleNew = () =>{
        setID('')
        setOpenDialogForm(true)
        setItem(USER)
    }
    const handleDelete = (id:GridRowId) =>{
        setID(id as string)
        setOpenDialog(true)
    }
    const handleEdit = (id:GridRowId) =>{
        setItem(data.filter(d=>id===d.id)[0])
        setUserVal((prevBasicVal)=>({...prevBasicVal, email:false, nombre:false, password:false}))
        setID(id as string)
        setOpenDialogForm(true)
    }
    const handleSave = () =>{
        if(ID===''){
            if(validateUser(item, setUserVal)){
                AuthService.createUser(item.email, item.password, item)
                setOpenDialogForm(false)
            }
        }else{
            AuthService.updateItem(ID as string, item)
            setOpenDialogForm(false)
        }
    }
    const deleteFunc = () => {
        AuthService.deleteItem(ID)
        setOpenDialog(false)
    }

    //DATA GRID *************
    const columns:GridColDef[]=[
        {field: 'nombre', headerName: 'NOMBRE Y APELLIDO', width:200},
        {field: 'email', headerName: 'EMAIL', width:280},
        {
            field: 'role', 
            headerName: 'ROLES', 
            width:180, 
            type:'singleSelect',
            valueOptions : roles,
            editable: false
        },
        {field: 'uid', headerName: 'UID', width:200},
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Acciones',
            cellClassName: 'actions',
            getActions: (params:GridRowParams) => [
                <GridActionsCellItem 
                    key={1}
                    icon={<EditIcon />}
                    label='Detalles'
                    onClick={()=>handleEdit(params.id)}
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
			<Grid size={{xs: 12, sm: 6}}>
				<NewButton text='Nuevo Usuario' onClick={handleNew} link={false}/>
			</Grid>
			<Grid size={{xs: 12, sm: 6}}>
				<Box id='filter-panel' />
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
                content="Confirma borrar el registro? / Eliminar el usuario de la consola de forma manual"
                open={openDialog}
                setOpen={setOpenDialog}
                actionFunc={deleteFunc} /> 
            <MyDialog
                type='FORM'
                title={ID === '' ? 'Nuevo Item' : 'Editar Item'}
                open={openDialogForm}
                setOpen={setOpenDialogForm}
                content={<FormUser item={item} setItem={setItem} opt={ID === '' ? 'NUEVO' : 'EDITAR'} validation={userVal}/>}
                actionFunc={handleSave} />	
		</Grid>
    )
}
