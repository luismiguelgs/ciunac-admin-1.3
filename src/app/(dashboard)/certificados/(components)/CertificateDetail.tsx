'use client'
import { IcertificadoDetalle } from '@/modules/certificados/interfaces/certificado.interface'
import { Button } from '@mui/material'
import { GridColDef, GridRowId, GridRowModel, GridRowModes, GridRowModesModel } from '@mui/x-data-grid'
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import CertificadosService, { Collection } from '@/modules/certificados/services/certificados.service'
import EditableDataGrid from '@/components/MUI/EditableDataGrid'
import { MyDialog } from '@/components/MUI'
import { PROGRAMAS } from '@/lib/constants'

const modeOptions = [
    { value: 'EX.U', label: 'EXAMEN DE UBICACIÓN' },
    { value: 'C.I.', label: 'CICLO INTENSIVO' },
    { value: 'C.R.', label: 'CICLO REGULAR' }
];

type Props = {
    id_certificado: string,
    setData?: React.Dispatch<React.SetStateAction<IcertificadoDetalle[]>>
    idioma?: string | null
    nivel?: string | null
}

export default function CertificateDetail({id_certificado, setData, idioma=null, nivel=null}:Props) 
{
    const cursos:{value:string, label:string}[] = []
    if(idioma && nivel){
        const {niveles, label} = PROGRAMAS.filter(item=>item.id === `${idioma}-${nivel}`)[0]
        for(let i=1; i<= niveles;i++){
            cursos.push({value:`${label} ${i}`, label:`${label} ${i}`})
        }
    }
    
    const loadData = async (id:string | undefined) =>{
        const data = await CertificadosService.fetchItemsDetail(id as string)
        setRows(data)
        if(setData) setData(data)
    }

    //hooks ****
    const [rows, setRows] = React.useState<IcertificadoDetalle[]>([])
    //const [ reload, setReload ] = React.useState<boolean>(false)
    const [ openDialog, setOpenDialog ] = React.useState<boolean>(false)
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
    const [idToDelete, setIdToDelete] = React.useState<GridRowId | null>(null);

    React.useEffect(()=>{
        if(id_certificado !== 'nuevo') loadData(id_certificado)
    },[id_certificado])

     //dialog ***
    const handleConfirmDelete = async () => {
        if (idToDelete) {
            await CertificadosService.deleteItem(Collection.CertificadosDetalle, idToDelete as string)
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

    const processRowUpdate = async(newRow: GridRowModel) => {
        //New or Update in DB
        let id:string | undefined
        if(newRow.isNew){
            id = await CertificadosService.newItem(Collection.CertificadosDetalle,newRow as IcertificadoDetalle)
        }else{
            CertificadosService.updateItem(Collection.CertificadosDetalle, newRow as IcertificadoDetalle)
        }
        const updatedRow:IcertificadoDetalle = {
            id:newRow.isNew ? id : newRow.id, 
            id_certificado: id_certificado, 
            curso:newRow.curso, 
            ciclo: newRow.ciclo,
            modalidad:newRow.modalidad,
            nota: newRow.nota,
            isNew: false 
        };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };


    const handleNewClick = () => {
        if(cursos.length>0){
            const newRows = cursos.map((curso) => ({
                id: Math.floor(Math.random() * 10000).toString(), // Generamos un id único para cada fila
                id_certificado: id_certificado,
                curso: curso.value,
                ciclo: '2000-0',
                modalidad: modeOptions[2].value, // Asignamos un valor por defecto a modalidad
                nota: 0, // Nota inicial en 0
                isNew: true
            }));
            setRows((oldRows) => [...oldRows, ...newRows]);
            newRows.forEach(newRow => {
                setRowModesModel((oldModel) => ({
                    ...oldModel,
                    [newRow.id]: { mode: GridRowModes.Edit, fieldToFocus: 'nota' }, // Focalizar la nota por defecto
                }));
            });
        }
        /*
        const id = Math.floor(Math.random()*100).toString();
        console.log(id);
        
        setRows((oldRows) => [...oldRows, { id,id_certificado:id_certificado, curso: '', ciclo: '', modalidad: '',nota: 0, isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'curso' },
        }));
        */
    }

    const cols:GridColDef[] = [
        {field: 'curso', headerName: 'CURSO', editable: true, type:'singleSelect', valueOptions:cursos, width:240},
        {field: 'ciclo', headerName: 'CICLO', editable: true, width:200},
        {field: 'modalidad', headerName: 'MODALIDAD', type:'singleSelect', valueOptions: modeOptions, width:240, editable:true },
        {field: 'nota', headerName: 'NOTA', editable: true, type:'number'}
    ]

    return (
        <React.Fragment>
            <Button 
                disabled={id_certificado==='nuevo'}
                variant="contained" 
                endIcon={<AddIcon /> } 
                sx={{mb:1}} 
                onClick={handleNewClick}>
                    Asignar Nota(s)
            </Button>
            { cursos.length > 0 && <EditableDataGrid
                columns={cols}
                rows={rows}
                setRows={setRows}
                rowModesModel={rowModesModel}
                setRowModesModel={setRowModesModel}
                handleDeleteClick={handleDeleteClick}
                processRowUpdate={processRowUpdate}
            />}
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
