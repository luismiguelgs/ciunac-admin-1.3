import { IcalificacionDetalle } from '../../../../modules/examen-ubicacion/interfaces/calificacion.interface'
import { IexamenNotas } from '../../../../modules/examen-ubicacion/interfaces/examen-ubicacion.interface'
import { CalificacionesService } from '@/modules/examen-ubicacion/services/calificaciones.service'
import { Collection, ExamenesService } from '@/services/examenes.service'
import SolicitudesService from '@/services/solicitudes.service'
import { Button, Checkbox } from '@mui/material'
import { GridColDef, GridRowId, GridRowModel, GridRowModesModel } from '@mui/x-data-grid'
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import EditableDataGrid, { GridAction } from '@/components/MUI/EditableDataGrid'
import { MyDialog } from '@/components/MUI'
import DialogFull from '@/components/MUI/Dialogs/DialogFull'
import ExamRequests from './ExamRequests'
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import { PDFViewer } from '@react-pdf/renderer'
import ConstanciaFormat from './ConstanciaFormat'

export default function ExamParticipants({id, idioma}:{id:string | undefined, idioma?:string|undefined}) 
{   
    const customActions:GridAction[] = [
        {
            icon: <HistoryEduIcon />,
            label: 'Ver Detalles',
            onClick: (id: GridRowId) => () => {
                const info = rows.find((row) => row.id === id)
                setSelectData(info)
                setOpenConstacia(true)
            },
            color: 'primary',
        },
    ]
    const loadData = async (id:string | undefined) =>{
        const data = await ExamenesService.fetchItemsDetail(id as string)
        setRows(data)
        //cargar la matriz de ubicación
        const ubicacionB = await CalificacionesService.fetchItemsDetail(`EXAMEN-UBICACION-${idioma}-BASICO`)
        setUbicationBasic(ubicacionB)
        const ubicationI = await CalificacionesService.fetchItemsDetail(`EXAMEN-UBICACION-${idioma}-INTERMEDIO`)
        setUbicationInter(ubicationI)
    }

    //hooks ******************
    const [rows, setRows] = React.useState<IexamenNotas[]>([])
    const [ reload, setReload ] = React.useState<boolean>(false)
    const [ openDialog, setOpenDialog ] = React.useState<boolean>(false)
    const [ openConstacia, setOpenConstacia ] = React.useState<boolean>(false)
    const [ selectData, setSelectData ] = React.useState<IexamenNotas | undefined>()
    const [ ubicationBasic, setUbicationBasic] = React.useState<IcalificacionDetalle[]>([])
    const [ ubicationInter, setUbicationInter] = React.useState<IcalificacionDetalle[]>([])
    const [ openDialogFull, setOpenDialogFull ] = React.useState<boolean>(false)
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
    const [idToDelete, setIdToDelete] = React.useState<GridRowId | null>(null);

    React.useEffect(()=>{
        loadData(id)
    },[reload])

    //dialog ***
    const handleConfirmDelete = async () => {
        if (idToDelete) {
            //actualizar el estatus de la solicitud
            const solicitudId:string = rows.filter((row) => row.id === idToDelete)[0].solicitud_id
            await SolicitudesService.updateStatus(solicitudId, 'NUEVO')
            //borrar el registro asignado
            await ExamenesService.deleteItem(Collection.Examenes_notas, idToDelete as string)
            
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

    const obtenerResultado = (nota: number, nivel: string): string => {
        let ubicacion:IcalificacionDetalle[] = []
        if (nivel === 'BASICO') {
            ubicacion = ubicationBasic
        } else if (nivel === 'INTERMEDIO') {
            ubicacion = ubicationInter
        }
        
        for (const calificacion of ubicacion) {
            const minimo = Number(calificacion.minimo)
            const maximo = Number(calificacion.maximo)
        
            if (nota >= minimo && nota <= maximo) {
                return calificacion.resultado as string;
            }
        }
        return "Nota fuera de rango";
    };

    const processRowUpdate = async(newRow: GridRowModel) => {
        //actualizar la ubicacion 
        newRow.ubicacion = obtenerResultado(newRow.nota, newRow.nivel)
        //actualizar la base de datos
        ExamenesService.updateItem(Collection.Examenes_notas, newRow as IexamenNotas)
        
        //actualizar la tabla
        const updatedRow:IexamenNotas = {
            id: newRow.id, 
            examen_id: newRow.examen_id,
            solicitud_id: newRow.solicitud_id,
            idioma:newRow.idioma, 
            nivel:newRow.nivel,
            dni: newRow.dni, 
            nombres : newRow.nombres,
            apellidos: newRow.apellidos,
            numero_voucher: newRow.numero_voucher,
            monto: newRow.monto,
            nota: newRow.nota,
            ubicacion: newRow.ubicacion,
            terminado: newRow.terminado
        };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleNewClick = () => {
        setOpenDialogFull(true)
    }
    const handleCheckboxChange = async (id:GridRowId, checked:boolean) => {
        setRows((prevRows) =>
            prevRows.map((row) =>
                row.id === id ? { ...row, impreso: checked } : row
            )
        );
        const info = rows.find((row) => row.id === id)
        await ExamenesService.updateItem(Collection.Examenes_notas, {...info, terminado: checked} as IexamenNotas)
        
        //alert(JSON.stringify(info))
        await SolicitudesService.updateStatus(info?.solicitud_id as string, 'ENTREGADO')
    }

    //Columns *********************************************************
    const cols:GridColDef[] = [
        {field: 'dni', headerName: 'DNI', editable:false, width: 100},
        {field: 'apellidos', headerName: 'APELLIDOS', editable: false, width:150},
        {field: 'nombres', headerName: 'NOMBRES', editable: false, width:150},
        {field: 'nivel', headerName: 'NIVEL', editable: false, type: 'singleSelect',  width:120},
        {field: 'nota', headerName: 'NOTA', editable: true, width:100},
        {field: 'ubicacion', headerName: 'UBICACIÓN', editable: false, width:200},
        {
            field: 'terminado',
            headerName: 'TERMINADO',
            width: 100,
            renderCell: (params) => {
                return <Checkbox 
                    checked={params.value as boolean}
                    onChange={(e)=>{handleCheckboxChange(params.id as GridRowId, e.target.checked)}} 
                    inputProps={{'aria-label': 'Checkbox Terminado'}}
                    />
            }
        },
        
    ]

    return (
        <React.Fragment>
            <Button 
                disabled={id==='nuevo'}
                variant="contained" 
                endIcon={<AddIcon /> } 
                sx={{mb:1}} 
                onClick={()=>handleNewClick()}>
                    Asignar Participantes
            </Button>
            <EditableDataGrid
                columns={cols}
                rows={rows}
                setRows={setRows}
                rowModesModel={rowModesModel}
                setRowModesModel={setRowModesModel}
                handleDeleteClick={handleDeleteClick}
                processRowUpdate={processRowUpdate}
                actions={customActions}
            />
            <MyDialog
                type='ALERT'
                title='Borrar Registro'
                content="Confirma borrar el registro?"
                open={openDialog}
                setOpen={setOpenDialog}
                actionFunc={handleConfirmDelete} 
            /> 
            <MyDialog
                type='SIMPLE'
                title='Constancia'
                setOpen={setOpenConstacia}
                open={openConstacia}
                content={
                    <>
                        <PDFViewer width={800} height={500}>
                            <ConstanciaFormat data={selectData} />
                        </PDFViewer>
                    </>
                }
            />
            <DialogFull
                title='Solicitudes' 
                open={openDialogFull}
                setOpen={setOpenDialogFull}
                content={
                    <ExamRequests 
                        examenId={id as string} 
                        idioma={idioma as string}
                        setReload={setReload}
                        setOpenDialogFull={setOpenDialogFull}
                    />
                }
            />
        </React.Fragment>
    )
}
