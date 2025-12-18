'use client'
import { ICertificadoNota } from '@/modules/certificados/interfaces/certificado.interface'
import { Button } from '@mui/material'
import { GridColDef, GridRowId, GridRowModel, GridRowModes, GridRowModesModel } from '@mui/x-data-grid'
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import EditableDataGrid from '@/components/MUI/EditableDataGrid'
import { MyDialog } from '@/components/MUI'
import { PROGRAMAS } from '@/lib/constants'

const modeOptions = [
    { value: 'EX.U.', label: 'EXAMEN DE UBICACIÓN' },
    { value: 'C.I.', label: 'CICLO INTENSIVO' },
    { value: 'C.R.', label: 'CICLO REGULAR' }
];

type Props = {
    data: ICertificadoNota[],
    setData?: React.Dispatch<React.SetStateAction<ICertificadoNota[]>>
    idioma?: string | null
    nivel?: string | null
    nuevo?: boolean
}

export default function CertificateDetail({ data, setData, idioma = null, nivel = null, nuevo = false }: Props) {
    const cursos: { value: string, label: string }[] = []
    if (idioma && nivel) {
        const { niveles, label } = PROGRAMAS.filter(item => item.id === `${idioma}-${nivel}`)[0]
        for (let i = 1; i <= niveles; i++) {
            cursos.push({ value: `${label} ${i}`, label: `${label} ${i}` })
        }
    }

    //hooks ****
    const [rows, setRows] = React.useState<ICertificadoNota[]>(() => (
        (data ?? []).map(r => ({
            ...r,
            id: r.id ?? Math.random().toString(36).substring(2, 9),
            isNew: r.isNew ?? false,
        }))
    ))
    const [openDialog, setOpenDialog] = React.useState<boolean>(false)
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
    const [idToDelete, setIdToDelete] = React.useState<GridRowId | null>(null);

    React.useEffect(() => {
        // Cuando recibes las notas del backend (sin tempId)
        const withIds = (data ?? []).map((r) => ({
            ...r,
            id: r.id ?? Math.random().toString(36).substring(2, 9),
            isNew: r.isNew ?? false,
        }));

        setRows(withIds);
    }, [data]);

    //dialog ***
    const handleConfirmDelete = async () => {
        if (idToDelete) {
            const updated = rows.filter(row => row.id !== idToDelete)
            setRows(updated)
            if (setData) setData(updated)
            setIdToDelete(null)
            setOpenDialog(false)
        }
    };
    //datagrid ***
    const handleDeleteClick = (id: GridRowId) => () => {
        setIdToDelete(id)
        setOpenDialog(true)
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const processRowUpdate = async (newRow: GridRowModel): Promise<any> => {
        // Convertimos a tu tipo real
        const updatedRow: ICertificadoNota = {
            id: newRow.id as string,
            ciclo: newRow.ciclo,
            periodo: newRow.periodo,
            modalidad: newRow.modalidad,
            nota: newRow.nota,
            isNew: false,
        };

        // 🔄 Refrescamos el estado local
        setRows((prevRows) =>
            prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
        );

        // 🔄 Si tienes también `setData` desde el padre (upsert por tempId)
        if (setData) {
            setData((prevData) =>
                prevData.map((row) => row.id === updatedRow.id ? updatedRow : row)
                /*
                {
                const exists = prevData.some((row) => row.id === updatedRow.id)
                return exists
                    ? prevData.map((row) => (row.id === updatedRow.id ? updatedRow : row))
                    : [...prevData, updatedRow]
                }
                */
            );
        }
        console.log(data)

        return updatedRow;
    };


    const handleNewClick = () => {
        if (cursos.length > 0) {
            // 🔒 Aseguramos el tipo explícitamente
            const newRows: ICertificadoNota[] = cursos.map((curso): ICertificadoNota => ({
                id: Math.random().toString(36).substring(2, 9),
                ciclo: curso.value,
                periodo: "2025-01",
                modalidad: "C.R.",
                nota: 0,
                isNew: true,
            }));

            // ✅ TypeScript ya no se queja
            setRows((oldRows) => [...oldRows, ...newRows] as ICertificadoNota[]);

            // ✅ Actualizamos también el estado del padre si existe
            if (setData) {
                setData((prev) => ([...prev, ...newRows] as ICertificadoNota[]))
            }

            newRows.forEach((newRow) => {
                setRowModesModel((oldModel) => ({
                    ...oldModel,
                    [newRow.id as string]: { mode: GridRowModes.Edit, fieldToFocus: "nota" },
                }));
            });
            console.log(data)
        }
    }

    const cols: GridColDef[] = [
        { field: 'ciclo', headerName: 'CURSO', editable: true, type: 'singleSelect', valueOptions: cursos, width: 240 },
        { field: 'periodo', headerName: 'CICLO', editable: true, width: 200 },
        { field: 'modalidad', headerName: 'MODALIDAD', type: 'singleSelect', valueOptions: modeOptions, width: 240, editable: true },
        { field: 'nota', headerName: 'NOTA', editable: true, type: 'number' }
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
            {cursos.length > 0 && <EditableDataGrid
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
