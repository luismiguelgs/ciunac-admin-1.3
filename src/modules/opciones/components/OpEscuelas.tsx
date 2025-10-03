'use client'
import { IEscuela, IFacultad } from '@/modules/opciones/interfaces/types.interface'
import { Button } from '@mui/material'
import { GridColDef, GridRenderCellParams, GridRowId, GridRowModel, GridRowModes, GridRowModesModel, GridRenderEditCellParams } from '@mui/x-data-grid'
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import EditableDataGrid from '@/components/MUI/EditableDataGrid'
import { MyDialog } from '@/components/MUI'
import OpcionesService, { Collection } from '../services/opciones.service'
import { MenuItem, Select } from "@mui/material";
import useStore from '@/hooks/useStore'
import { useFacultiesStore } from '@/modules/opciones/store/types.stores'

export default function OpEscuelas() 
{
	const loadData = async () => {
		const data = await OpcionesService.fetchItems<IEscuela>(Collection.Escuelas)
		setRows(data)
	}

	//Hooks *****************************************************************
	const facultades = useStore(useFacultiesStore, (state) => state.faculties)
	const [ openDialog, setOpenDialog ] = React.useState<boolean>(false)
    const [rows, setRows] = React.useState<IEscuela[]>([])
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({})
    const [idToDelete, setIdToDelete] = React.useState<GridRowId | null>(null)

	React.useEffect(()=>{
		loadData()
	},[])

	//Dialog ***************************************************************
	const handleConfirmDelete = async () => {
		if (idToDelete) {
			await OpcionesService.deleteItem(Collection.Escuelas, Number(idToDelete))
			setRows(rows.filter((row) => row.id !== idToDelete));
			setIdToDelete(null);
			setOpenDialog(false);
		}
	};

	//DataGrid **************************************************************
	const handleDeleteClick = (id: GridRowId) => () => {    
		setIdToDelete(id)
		setOpenDialog(true)
	};

	const processRowUpdate = async(newRow: GridRowModel) => {
		//New or Update in DB
		let id:number | undefined
		if(newRow.isNew){
			const res = await OpcionesService.newItem<IEscuela>(Collection.Escuelas,newRow as IEscuela)
			id = (res as IEscuela).id
		}else{
			delete newRow.facultad
			OpcionesService.updateItem<IEscuela>(Collection.Escuelas, newRow as IEscuela)
		}
		const updatedRow:IEscuela = {
			id:newRow.isNew ? id : newRow.id, 
			nombre:newRow.nombre, 
			facultadId: newRow.facultadId,
			isNew: false 
		};
		setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
		return updatedRow;
	}

	const handleNewClick = () => {
		const id = Math.floor(Math.random()*90)+10;
		setRows((oldRows) => [...oldRows, { id, nombre: '', facultadId: 0, isNew: true }]);
		setRowModesModel((oldModel) => ({
			...oldModel,
			[id]: { mode: GridRowModes.Edit, fieldToFocus: 'nombre' },
		}));
	}

	const cols:GridColDef[] = [
		{field: 'id', headerName: 'ID', editable: false, width:120},
		{field: 'nombre', headerName: 'NOMBRE', editable: true, width:340},
		{
			field: 'facultadId', 
			headerName: 'FACULTAD', 
			editable: true, 
			width:340,
			//Mostrar nombre en lectura
			renderCell: (params: GridRenderCellParams) => {
				return params.row.facultad?.nombre ?? "";
			},
			// Renderizar combo en edición
			renderEditCell: (params: GridRenderEditCellParams) => {
				return (
				  <Select
					value={params.value || ""}
					onChange={(e) => {
					  params.api.setEditCellValue({
						id: params.id,
						field: params.field,
						value: e.target.value,
					  });
					}}
					fullWidth
				  >
					{facultades && facultades?.map((f:IFacultad) => (
					  <MenuItem key={f.id} value={f.id}>
						{f.nombre}
					  </MenuItem>
					))}
				  </Select>
				);
			  },
		},
	]

	return (
		<React.Fragment>
            <Button variant="contained" endIcon={<AddIcon /> } sx={{mb:1}} onClick={handleNewClick}>
                Nuevo Documento
            </Button>
            <EditableDataGrid
                columns={cols}
                rows={rows}
                setRows={setRows} 
                rowModesModel={rowModesModel}
                setRowModesModel={setRowModesModel}
                handleDeleteClick={handleDeleteClick}
                processRowUpdate={processRowUpdate}
            />
            
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