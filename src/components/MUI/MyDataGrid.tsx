''
import { Portal } from "@mui/material";
import { DataGrid, DataGridProps, GridActionsCellItem, GridColDef, GridRowId, GridRowParams, GridToolbar, GridToolbarProps, GridToolbarQuickFilter } from "@mui/x-data-grid";
import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props<R extends { id?: GridRowId } = any> = {
    data: R[],
    cols: GridColDef<R>[],
    handleDetails(id: GridRowId): void
    handleDelete(id: GridRowId): void;
    getRowId?: (row: R) => GridRowId;
    extraActions?: (id: GridRowId) => React.ReactNode[];
    actions?: boolean;
    initialState?: DataGridProps['initialState'];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MyDataGrid<R extends { id?: GridRowId } = any>({ data, cols, handleDetails, handleDelete, getRowId, extraActions, actions = true, initialState }: Props<R>) {
    const MyCustomToolbar = (props: GridToolbarProps) => {
        return (
            <React.Fragment>
                <Portal container={() => document.getElementById('filter-panel')!}>
                    <GridToolbarQuickFilter />
                </Portal>
                <GridToolbar {...props} />
            </React.Fragment>
        )
    }

    const columns: GridColDef[] = [
        ...cols,
        {
            field: 'actions',
            type: 'actions',
            getActions: (params: GridRowParams): React.ReactElement[] => [
                <GridActionsCellItem
                    key='details'
                    icon={<VisibilityIcon />}
                    label='Detalles'
                    onClick={() => handleDetails(params.id)}
                />,
                ...(extraActions ? extraActions(params.id) as React.ReactElement[] : []),
                <GridActionsCellItem
                    key='delete'
                    showInMenu
                    icon={<DeleteIcon />}
                    label='Borrar'
                    onClick={() => handleDelete(params.id)}
                />
            ]
        }
    ];

    if (!actions) columns.pop();

    return (
        <DataGrid
            pageSizeOptions={[10, 25, 100]}
            rows={data}
            getRowId={getRowId}
            columns={columns}
            disableColumnMenu
            slots={{ toolbar: MyCustomToolbar }}
            initialState={{
                filter: {
                    filterModel: {
                        items: [],
                        quickFilterExcludeHiddenColumns: true
                    },
                    ...initialState?.filter
                },
                sorting: {
                    sortModel: initialState?.sorting?.sortModel || [],
                    ...initialState?.sorting
                },
                ...initialState
            }}
            slotProps={{
                columnsManagement: {
                    disableResetButton: true,
                    disableShowHideToggle: true
                }
            }}
        />
    )
}
