'use client'
import { GridColDef, GridRowId, GridRowModel, GridRowModes, GridRowModesModel } from '@mui/x-data-grid'
import { IProfesor } from '@/modules/examen-ubicacion/interfaces/profesores.interface'
import React from 'react'
import Face2Icon from '@mui/icons-material/Face2';
import Face6Icon from '@mui/icons-material/Face6';
import ProfesoresService from '@/modules/examen-ubicacion/services/profesores.service'
import NewButton from '@/components/NewButton'
import { MyDialog } from '@/components/MUI';
import EditableDataGrid from '@/components/MUI/EditableDataGrid';

const cols:GridColDef[] = [
    {field: 'nombres', headerName: 'NOMBRES', editable:true, width: 150},
    {field: 'apellidos', headerName: 'APELLIDOS', editable: true, width:200},
    {
        field: 'genero', 
        headerName: 'GENERO', 
        editable: true, width:100,
        renderCell: (params) => {
            return params.value === 'F' ? (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop:10 }}><Face2Icon style={{ color: 'pink' }} /></div>
              ) : params.value === 'M' ? (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop:10 }}><Face6Icon style={{ color: 'blue' }} /></div>
              ) : null;
        }
    },
    {field: 'celular', headerName: 'TELEFONO', editable: true, width:120},
    {
        field: 'fechaNacimiento', 
        editable: true,
        headerName: 'FECHA NACIMIENTO',
        width: 150,
        renderCell: (params) => {
            return new Date(params.value).toLocaleDateString('es-ES',{
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            })
        }
    },
    {field: 'activo', headerName: 'ACTIVO', editable: true, width:100}
]

export default function Teachers() 
{
    const [rows, setRows] = React.useState<IProfesor[]>([])
    const [ openDialog, setOpenDialog ] = React.useState<boolean>(false)
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
    const [idToDelete, setIdToDelete] = React.useState<GridRowId | null>(null);

    React.useEffect(()=>{
        const fetchData = async () => {
            const data = await ProfesoresService.fetchItems()
            setRows(data as IProfesor[])
        }
        fetchData()
    },[])

    //dialog ***
    const handleConfirmDelete = async () => {
        if (idToDelete) {
            await ProfesoresService.deleteItem(idToDelete as string)
            setRows(rows.filter((row) => row.id !== idToDelete));
            setIdToDelete(null);
            setOpenDialog(false);
        }
    }; 
    //datagrid ***
    const handleDeleteClick = (id: GridRowId) => () => {    
        setIdToDelete(id)
        setOpenDialog(true)
    };
    const handleProcessRowUpdateError = (error: unknown) => {
        console.error('processRowUpdate error:', error);
    };
    const processRowUpdate = async(newRow: GridRowModel) => {
        //New or Update in DB
        let id:string | undefined | void
        if(newRow.isNew){
            const res = await ProfesoresService.newItem(newRow as IProfesor)
            id = res.id
        }else{
            delete newRow.creadoEn
            delete newRow.modificadoEn
            delete newRow.usuario
            await ProfesoresService.updateItem(newRow as IProfesor)
        }
        
        const updatedRow:IProfesor = {
            id:newRow.isNew ? id : newRow.id, 
            nombres: newRow.nombres,
            apellidos: newRow.apellidos,
            genero: newRow.genero,
            celular: newRow.celular,
            fechaNacimiento: new Date(newRow.fechaNacimiento),
            activo: newRow.activo,
            isNew: false 
        };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };
    const handleNewClick = () => {
        const id = Math.floor(Math.random()*100).toString();
        setRows((oldRows) => [...oldRows, {
            id, 
            nombres: '', 
            apellidos: '', 
            genero: 'M', 
            celular: '',
            fechaNacimiento: new Date(),
            activo: true,
            isNew: true 
        }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'nombres' },
        }));
    }

    return (
        <React.Fragment>
            <NewButton text='Nuevo Profesor' link={false} onClick={handleNewClick} />
            <EditableDataGrid 
                columns={cols}
                rows={rows}
                setRows={setRows}
                rowModesModel={rowModesModel}
                setRowModesModel={setRowModesModel}
                handleDeleteClick={handleDeleteClick}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={handleProcessRowUpdateError}
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
