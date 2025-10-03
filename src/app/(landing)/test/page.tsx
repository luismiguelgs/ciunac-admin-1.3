'use client'; // DataGrid requiere ser un Client Component

import SolicitudesService from "@/services/solicitudes.service";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box } from "@mui/material";
import { Isolicitud } from "@/modules/solicitudes/interfaces/solicitud.interface"; // Asegúrate que la ruta sea correcta
import { formatDate } from "@/lib/utils";

// Define las columnas para el DataGrid
const columns: GridColDef[] = [
	{ field: 'id', headerName: 'ID', width: 220 },
	{ field: 'periodo', headerName: 'Periodo', width: 130 },
	{ field: 'solicitud', headerName: 'Solicitud', width: 220 },
	{ field: 'estado', headerName: 'Estado', width: 130 },
	{
		field: 'creado',
		headerName: 'Creado (Fecha)', // Header actualizado
		type: 'dateTime',
		width: 200,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		valueGetter: (value:any) => { // Mantenemos el valueGetter robusto
			if (!value) return null;
			if (value instanceof Date && !isNaN(value.getTime())) {
				return value;
			}
			const date = new Date(value);
			if (!isNaN(date.getTime())) {
				return date;
			}
			return null;
		}
	},
	{
		field: 'creadoString', // Nuevo field para la versión string
		headerName: 'Creado (Texto)',
		type: 'string',
		width: 200,
		valueGetter: (_value, row) => { // Accede a la fila para obtener 'creado'
			const createdValue = row.creado;
			return formatDate(createdValue);
		}
	},
	// Se eliminó la columna 'creadoSourceType'
];

export default function TestPage()
{
	const [rows, setRows] = useState<Isolicitud[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function getRequest(){
			try {
				const res = await SolicitudesService.fetchItemsWODate();
				// Asegúrate que cada fila tenga un 'id' único, DataGrid lo necesita.
				const dataWithId = res.map((item, index) => ({ ...item, id: item.id || index }));
				setRows(dataWithId.map(item => ({
					...item,
					id: typeof item.id === 'number' ? item.id.toString() : item.id
				})));
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		}
		getRequest();
	}, []);

	return (
		<Box sx={{ height: 800, width: '100%', mt: 4 }}>
			<DataGrid
				rows={rows}
				columns={columns}
				loading={loading}
				initialState={{
					pagination: {
						paginationModel: { page: 0, pageSize: 10 },
					},
					// Opcional: Ordenar por fecha de creación descendente por defecto
					sorting: {
						sortModel: [{ field: 'creado', sort: 'desc' }],
					},
				}}
				pageSizeOptions={[5, 10, 20]}
				checkboxSelection
				disableRowSelectionOnClick
			/>
		</Box>
	);
}
