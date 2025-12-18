import { Box } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridColDef, GridEventListener, GridRowEditStopReasons, GridRowId, GridRowModel, GridRowModes, GridRowModesModel, GridToolbar, GridValidRowModel } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import React from 'react';

export type GridAction = {
    icon: React.ReactElement,
    label: string,
    onClick: (id: GridRowId) => () => void,
    color?: 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'; // Color del botón
    showInEditMode?: boolean; // Si el botón debe mostrarse en modo edición
}

type Props = {
    columns: GridColDef[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rows: any[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setRows: React.Dispatch<React.SetStateAction<any[]>>
    rowModesModel: GridRowModesModel
    setRowModesModel: React.Dispatch<React.SetStateAction<GridRowModesModel>>
    handleDeleteClick(id: GridRowId): React.MouseEventHandler<HTMLButtonElement>
    processRowUpdate(newRow: GridRowModel): GridValidRowModel
    actions?: GridAction[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onProcessRowUpdateError?: (error: any) => void
}

export default function EditableDataGrid({ columns, rows, setRows, handleDeleteClick, processRowUpdate, actions = [], onProcessRowUpdateError }: Props) {
    //hooks
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getRowId = (row: any) => row.id ?? row.tempId;
    const handleContainerKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    //functions
    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };
    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };
    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };
    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };
    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => getRowId(row) === id);

        if (editedRow!.isNew) {
            setRows(rows.filter((row) => getRowId(row) !== id));
        }

    };

    //cols
    const cols: GridColDef[] = [
        ...columns,
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Acciones',
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            key={1}
                            icon={<SaveIcon />}
                            label='Guardar'
                            sx={{ color: 'primary.main' }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            key={2}
                            icon={<CancelIcon />}
                            label='Cancelar'
                            className='textPrimary'
                            onClick={handleCancelClick(id)}
                            color='inherit'
                        />,
                    ]
                }

                // Botones por defecto (Editar y Borrar)
                const defaultActions = [
                    <GridActionsCellItem
                        key="edit"
                        icon={<EditIcon />}
                        label="Editar"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        key="delete"
                        icon={<DeleteIcon />}
                        label="Borrar"
                        onClick={handleDeleteClick(id)}
                        color="error"
                    />,
                ];

                // Botones personalizados
                const customActions = actions
                    .filter((action) => !action.showInEditMode || isInEditMode) // Filtrar por modo edición
                    .map((action, index) => (
                        <GridActionsCellItem
                            key={`custom-${index}`}
                            icon={action.icon}
                            label={action.label}
                            onClick={action.onClick(id)}
                            color={action.color || 'inherit'}
                        />
                    ));

                return [...customActions, ...defaultActions,];
            },
        }
    ]

    return (
        <Box minHeight={400} onKeyDown={handleContainerKeyDown} sx={{
            width: '100%',
            height: '72vh',
            '& .actions': {
                color: 'text.secondary',
            },
            '& .textPrimary': {
                color: 'text.primary',
            },
        }}>
            <DataGrid
                rows={rows}
                columns={cols}
                editMode='row'
                slots={{ toolbar: GridToolbar }}
                getRowId={getRowId}
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={onProcessRowUpdateError}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } }
                }}
                pageSizeOptions={[10, 25, 100]}
            />
        </Box>
    )
}
