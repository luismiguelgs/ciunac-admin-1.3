
import { Button, Checkbox } from '@mui/material'
import { GridColDef, GridRowId, GridRowModel, GridRowModesModel } from '@mui/x-data-grid'
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import EditableDataGrid, { GridAction } from '@/components/MUI/EditableDataGrid'
import { MyDialog } from '@/components/MUI'
import DialogFull from '@/components/MUI/Dialogs/DialogFull'
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import { PDFViewer } from '@react-pdf/renderer'
import ExamRequests from './ExamRequests'
import ConstanciaFormat from './ConstanciaFormat'
import SolicitudesService from '@/modules/solicitudes/services/solicitud.service';
import ExamenesUbicacionService from '../../services/examenes-ubicacion.service';
import { IDetalleExamenUbicacion } from '../../interfaces/examen-ubicacion.interface';
import ICalificacionUbicacion from '../../interfaces/calificacion.interface';

export default function ExamParticipants({ id, idiomaId, calificaciones = undefined }: { id: number | string, idiomaId?: number | undefined, calificaciones?: ICalificacionUbicacion[] | null }) {
    const customActions: GridAction[] = [
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
    const loadData = async (id: number | undefined) => {
        const data = await ExamenesUbicacionService.fetchItemsDetail(Number(id))
        setRows(data as IDetalleExamenUbicacion[])
    }

    //hooks ******************
    const [rows, setRows] = React.useState<IDetalleExamenUbicacion[]>([])

    const [reload, setReload] = React.useState<boolean>(false)
    const [openDialog, setOpenDialog] = React.useState<boolean>(false)
    const [openConstacia, setOpenConstacia] = React.useState<boolean>(false)
    const [selectData, setSelectData] = React.useState<IDetalleExamenUbicacion | undefined>()
    const [openDialogFull, setOpenDialogFull] = React.useState<boolean>(false)
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
    const [idToDelete, setIdToDelete] = React.useState<GridRowId | null>(null);

    React.useEffect(() => {
        if (id && id !== 'nuevo') {
            loadData(Number(id))
        }
    }, [id, reload])

    //dialog ***
    const handleConfirmDelete = async () => {
        if (idToDelete) {
            //actualizar el estatus de la solicitud
            const solicitudId: number = rows.filter((row) => row.id === idToDelete)[0].solicitudId
            await SolicitudesService.updateStatus(solicitudId, 1)
            //borrar el registro asignado
            await ExamenesUbicacionService.deleteDetail(idToDelete as number)

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

    const obtenerResultado = (
        nota: number,
        idiomaId: number,
        nivelId: number,
        ubicaciones: ICalificacionUbicacion[]
    ): number | null =>
        ubicaciones.find(
            (u) =>
                u.idiomaId === idiomaId &&
                u.nivelId === nivelId &&
                nota >= u.notaMin &&
                nota <= u.notaMax
        )?.id ?? null;

    const processRowUpdate = async (newRow: GridRowModel) => {
        // calcular calificacion en base a la nota
        const nuevaCalificacionId = obtenerResultado(
            newRow.nota,
            newRow.idiomaId,
            newRow.nivelId,
            calificaciones || []
        );
        const calificacionIdFinal = (nuevaCalificacionId ?? newRow.calificacionId) as number;

        // actualizar en BD y esperar respuesta
        await ExamenesUbicacionService.updateDetail(
            newRow.id,
            {
                id: newRow.id,
                solicitudId: newRow.solicitudId,
                idiomaId: newRow.idiomaId,
                nivelId: newRow.nivelId,
                examenId: newRow.examenId,
                estudianteId: newRow.estudianteId,
                nota: newRow.nota,
                calificacionId: calificacionIdFinal,
                terminado: newRow.terminado,
            } as IDetalleExamenUbicacion
        );

        // fusionar cambios manteniendo los objetos anidados existentes
        let merged: IDetalleExamenUbicacion | GridRowModel | undefined;
        setRows((prev) =>
            prev.map((row) => {
                if (row.id === newRow.id) {
                    merged = {
                        ...row,
                        nota: newRow.nota,
                        calificacionId: calificacionIdFinal,
                        terminado: newRow.terminado,
                    } as IDetalleExamenUbicacion;
                    return merged as IDetalleExamenUbicacion;
                }
                return row;
            })
        );

        return (merged as IDetalleExamenUbicacion) ?? (newRow as IDetalleExamenUbicacion);
    };

    const handleNewClick = () => {
        setOpenDialogFull(true)
    }
    const handleCheckboxChange = async (id: GridRowId, checked: boolean) => {
        // actualizar inmediatamente el estado local del campo 'terminado'
        setRows((prevRows) =>
            prevRows.map((row) => (row.id === id ? { ...row, terminado: checked } : row))
        );

        // actualizar backend (estado del detalle y estado de solicitud)
        const info = rows.find((row) => row.id === id);
        await ExamenesUbicacionService.updateDetailStatus(id as number, checked);
        await SolicitudesService.updateStatus(Number(info?.solicitudId), 3);
    }

    //Columns *********************************************************
    const cols: GridColDef[] = [
        { field: 'estudiante.numeroDocumento', headerName: 'DNI', editable: false, width: 100, valueGetter: (_v, row) => row.estudiante?.numeroDocumento ?? '' },
        { field: 'estudiante.apellidos', headerName: 'APELLIDOS', editable: false, width: 160, valueGetter: (_v, row) => row.estudiante?.apellidos ?? '' },
        { field: 'estudiante.nombres', headerName: 'NOMBRES', editable: false, width: 160, valueGetter: (_v, row) => row.estudiante?.nombres ?? '' },
        { field: 'nivel', headerName: 'NIVEL', editable: false, valueGetter: (_v, row) => row.nivel?.nombre ?? '', width: 120 },
        { field: 'nota', headerName: 'NOTA', editable: true, width: 100 },
        {
            field: 'calificacionId',
            headerName: 'UBICACIÓN',
            editable: false,
            width: 200,
            type: 'singleSelect',
            valueGetter: (_v, row) => row.calificacionId ?? row.calificacion?.id ?? '',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            valueFormatter: (params: any) => {
                const id = params?.value as number | undefined;
                if (!id) return '';
                const opt = (calificaciones || []).find((o) => o.id === id);
                if (opt) return opt.ciclo?.nombre ?? '';
                const row = params?.api?.getRow?.(params.id);
                return row?.calificacion?.ciclo?.nombre ?? '';
            },
            renderCell: (params) => {
                const id = (params.row?.calificacionId ?? params.row?.calificacion?.id) as number | undefined;
                if (!id) return '';
                const opt = (calificaciones || []).find((o) => o.id === id);
                return opt?.ciclo?.nombre ?? params.row?.calificacion?.ciclo?.nombre ?? '';
            },
            valueOptions: (calificaciones || []).map((item) => ({ value: item.id, label: item.ciclo?.nombre ?? '' })),
        },
        {
            field: 'terminado',
            headerName: 'TERMINADO',
            width: 100,
            renderCell: (params) => {
                return <Checkbox
                    checked={params.value as boolean}
                    onChange={(e) => { handleCheckboxChange(params.id as GridRowId, e.target.checked) }}
                    inputProps={{ 'aria-label': 'Checkbox Terminado' }}
                />
            }
        },

    ]

    return (
        <React.Fragment>
            <Button
                disabled={id === 'nuevo'}
                variant="contained"
                endIcon={<AddIcon />}
                sx={{ mb: 1 }}
                onClick={() => handleNewClick()}>
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
                        examenId={id as number}
                        idiomaId={idiomaId as number}
                        setReload={setReload}
                        setOpenDialogFull={setOpenDialogFull}
                        calificaciones={calificaciones || []}
                        obtenerResultado={obtenerResultado}
                    />
                }
            />
        </React.Fragment>
    )
}
