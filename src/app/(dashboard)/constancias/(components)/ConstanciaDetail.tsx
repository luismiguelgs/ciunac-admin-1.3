'use client'
import { Button } from '@mui/material'
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import { IconstanciaDetalle } from '../../../../interfaces/constancia.interface';
import { GridColDef, GridRowId, GridRowModel, GridRowModes, GridRowModesModel } from '@mui/x-data-grid';
import EditableDataGrid from '@/components/MUI/EditableDataGrid';
import { Collection, ConstanciasService } from '@/services/constancias.service';
import { MyDialog } from '@/components/MUI';
import useSubjects from '@/hooks/useSubjects';
import { MESES, NIVEL } from '@/lib/constants';

const modeOptions = [
    { value: 'REGULAR', label: 'REGULAR' },
    { value: 'INTENSIVO', label: 'INTENSIVO' }
];
const stateOptions = [
    { value: 'APROBADO', label: 'APROBADO' },
    { value: 'DESAPROBADO', label: 'DESAPROBADO' }
];

type Props = {
	id_constancia: string,
    idioma: string,
    nivel: string,
    setDetalle: React.Dispatch<React.SetStateAction<IconstanciaDetalle[]>>,
    detalle: IconstanciaDetalle[],
}

export default function ConstanciaDetail({id_constancia, idioma, nivel, setDetalle, detalle}:Props) 
{
	//hooks ****
    const { data } = useSubjects()
	const [ openDialog, setOpenDialog ] = React.useState<boolean>(false)
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
    const [idToDelete, setIdToDelete] = React.useState<GridRowId | null>(null);

    React.useEffect(() => {
        const getRows = async() => {
            const data = await ConstanciasService.fetchItemsDetalle(id_constancia)
            setDetalle(data as IconstanciaDetalle[])
            // Remove duplicate setDetalle call
        }
        getRows()
    }, [id_constancia])

	const handleNewClick = () => {
        const id = Math.floor(Math.random()*100).toString();
        setDetalle((oldRows) => [
            ...oldRows,
            { 
                id, 
                id_constancia: id_constancia, 
                idioma: idioma,
                nivel: nivel,
                ciclo: '',
                modalidad: 'REGULAR',
                mes: '',
                año: '2000',
                estado: 'APROBADO',
                nota: 0,
                isNew: true 
            }
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'value' },
        }));        
    }
    const handleDeleteClick = (id: GridRowId) => () => {    
        setIdToDelete(id)
        setOpenDialog(true)
    };

    const handleConfirmDelete = async () => {
        if (idToDelete) {
            await ConstanciasService.deleteItem(Collection.CONSTANCIAS_NOTAS, idToDelete as string);
            setDetalle(detalle.filter((row) => row.id !== idToDelete));
            setIdToDelete(null);
            setOpenDialog(false);
        }
    };

    const processRowUpdate = async(newRow: GridRowModel) => {
        //New or Update in DB
        let id:string | undefined
        if(newRow.isNew){
            id = await ConstanciasService.newItem(Collection.CONSTANCIAS_NOTAS, newRow as IconstanciaDetalle)
            const updatedRow: IconstanciaDetalle = {
                ...newRow,
                id: id,
                isNew: false
            } as IconstanciaDetalle;
            setDetalle(oldRows => oldRows.map((row) => (row.id === newRow.id ? updatedRow : row)));
            return updatedRow;
        } else {
            await ConstanciasService.updateItem(Collection.CONSTANCIAS_NOTAS, newRow as IconstanciaDetalle)
            return newRow;
        }
    };

    const cols:GridColDef[] = [
        {field: 'idioma', headerName: 'IDIOMA', editable: true, type:'singleSelect', valueOptions: data, width:140},
        {field: 'nivel', headerName: 'NIVEL', editable: true, width:110, type:'singleSelect', valueOptions: NIVEL},
        {field: 'ciclo', headerName: 'CICLO', editable:true, width:100},
        {field: 'modalidad', headerName: 'MODALIDAD', editable:true,  width:120, type:'singleSelect', valueOptions: modeOptions},
        {field:'mes', headerName: 'MES', editable:true, width:120,type:'singleSelect', valueOptions: MESES},
        {field:'año', headerName: 'AÑO', editable:true, width:110},
        {field:'estado', headerName: 'ESTADO', editable:true, type: 'singleSelect', valueOptions: stateOptions, width:140},
        {field:'nota', headerName: 'NOTA', editable:true, width:110},
    ]

    return (
        <React.Fragment>
			<Button 
                variant="contained" 
                endIcon={<AddIcon /> } 
                sx={{mb:1}} 
                onClick={handleNewClick}>
                    Asignar Nota(s)
            </Button>
            <EditableDataGrid
                columns={cols}
                rows={detalle}
                setRows={setDetalle} 
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
