'use client'
import { Button } from '@mui/material'
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import { IConstanciaDetalle } from '@/modules/constancias/interfaces/constancia.interface';
import { GridColDef, GridRowId, GridRowModel, GridRowModes, GridRowModesModel } from '@mui/x-data-grid';
import EditableDataGrid from '@/components/MUI/EditableDataGrid';
import { MyDialog } from '@/components/MUI';
import { MESES, NIVEL } from '@/lib/constants';

type Props = {
    data: IConstanciaDetalle[],
    setData?: React.Dispatch<React.SetStateAction<IConstanciaDetalle[]>>,
    idioma?: string | null,
    nivel?: string | null,
    nuevo?: boolean,
}

export default function ConstanciaDetail({ data, setData, idioma = null, nivel = null, nuevo = false }: Props) {
    //hooks ****
    const [rows, setRows] = React.useState<IConstanciaDetalle[]>(() => (
        (data ?? []).map(r => ({
            ...r,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            id: (r as any).id ?? Math.random().toString(36).substring(2, 9),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            isNew: (r as any).isNew ?? false,
        }))
    ))
    const [openDialog, setOpenDialog] = React.useState<boolean>(false)
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
    const [idToDelete, setIdToDelete] = React.useState<GridRowId | null>(null);

    React.useEffect(() => {
        const withIds = (data ?? []).map((r) => ({
            ...r,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            id: (r as any).id ?? Math.random().toString(36).substring(2, 9),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            isNew: (r as any).isNew ?? false,
        }));
        setRows(withIds)
    }, [data])

    const aprobadoOptions = [
        { value: true, label: 'APROBADO' },
        { value: false, label: 'DESAPROBADO' }
    ]

    const handleConfirmDelete = async () => {
        if (idToDelete) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const updated = rows.filter(row => (row as any).id !== idToDelete)
            setRows(updated)
            if (setData) setData(updated)
            setIdToDelete(null)
            setOpenDialog(false)
        }
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        setIdToDelete(id)
        setOpenDialog(true)
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const processRowUpdate = async (newRow: GridRowModel): Promise<any> => {
        const updatedRow: IConstanciaDetalle = {
            idioma: newRow.idioma,
            nivel: newRow.nivel,
            ciclo: newRow.ciclo,
            modalidad: newRow.modalidad,
            mes: newRow.mes,
            año: newRow.año,
            aprobado: newRow.aprobado,
            nota: newRow.nota,
            isNew: false,
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setRows((prevRows) => prevRows.map((row: any) => (row.id === newRow.id ? { ...updatedRow, id: row.id } : row)))
        if (setData) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setData((prevData) => prevData.map((row: any) => (row.id === newRow.id ? { ...updatedRow, id: row.id } : row)))
        }
        return { ...updatedRow, id: newRow.id }
    };

    const handleNewClick = () => {
        const newRowId = Math.random().toString(36).substring(2, 9)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newRow: any = {
            id: newRowId,
            idioma: idioma ?? '',
            nivel: nivel ?? '',
            ciclo: '',
            modalidad: 'REGULAR',
            mes: '',
            año: '2000',
            aprobado: true,
            nota: 0,
            isNew: true,
        }
        setRows((old) => [...old, newRow])
        if (setData) setData((prev) => ([...prev, newRow]))
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [newRowId]: { mode: GridRowModes.Edit, fieldToFocus: 'nota' },
        }));
    }

    const cols: GridColDef[] = [
        { field: 'idioma', headerName: 'IDIOMA', editable: true, width: 140 },
        { field: 'nivel', headerName: 'NIVEL', editable: true, width: 110, type: 'singleSelect', valueOptions: NIVEL },
        { field: 'ciclo', headerName: 'CICLO', editable: true, width: 140 },
        {
            field: 'modalidad', headerName: 'MODALIDAD', editable: true, width: 140, type: 'singleSelect', valueOptions: [
                { value: 'REGULAR', label: 'REGULAR' },
                { value: 'INTENSIVO', label: 'INTENSIVO' }
            ]
        },
        { field: 'mes', headerName: 'MES', editable: true, width: 140, type: 'singleSelect', valueOptions: MESES },
        { field: 'año', headerName: 'AÑO', editable: true, width: 120 },
        { field: 'aprobado', headerName: 'ESTADO', editable: true, type: 'singleSelect', valueOptions: aprobadoOptions, width: 160 },
        { field: 'nota', headerName: 'NOTA', editable: true, width: 110, type: 'number' },
    ]

    return (
        <React.Fragment>
            <Button
                disabled={nuevo}
                variant="contained"
                endIcon={<AddIcon />}
                sx={{ mb: 1 }}
                onClick={handleNewClick}>
                Asignar Nota(s)
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
