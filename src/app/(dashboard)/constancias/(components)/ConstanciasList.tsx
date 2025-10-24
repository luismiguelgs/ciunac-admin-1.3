import { Iconstancia } from '../../../../interfaces/constancia.interface'
import { Collection, ConstanciasService } from '@/services/constancias.service'
import SolicitudesService from '@/services/solicitudes.service'
import { Chip, Checkbox, Box } from '@mui/material'
import { GridColDef, GridRowId } from '@mui/x-data-grid'
import { useRouter } from 'next/navigation'
import React from 'react'
import Grid from '@mui/material/Grid2'
import NewButton from '@/components/NewButton'
import MyDataGrid from '@/components/MUI/MyDataGrid'
import { MyDialog } from '@/components/MUI'
import dayjs from 'dayjs'
import 'dayjs/locale/es';
dayjs.locale('es');

type Props = {
    rows: Iconstancia[]
    setRows: React.Dispatch<React.SetStateAction<Iconstancia[]>>
    printed?: boolean
}

export default function ConstanciasList({rows, setRows, printed}: Props)
{
    const navigate = useRouter()
    const [ openDialog, setOpenDialog ] = React.useState<boolean>(false)
    const [ID, setID] = React.useState<GridRowId | null>(null);

    //Funcions **********************************************************
    const handleCheckboxChange = async (id:GridRowId, checked:boolean) => {
        setRows((prevRows) =>
            prevRows.map((row) =>
                row.id === id ? { ...row, impreso: checked } : row
            )
        );
        await ConstanciasService.updateStatus(Collection.CONSTANCIAS,id as string, checked)
        const info = rows.find((row) => row.id === id)
        await SolicitudesService.updateStatus(info?.id_solicitud as string, 'ENTREGADO')
    }
	const handleDetails = (id:GridRowId) => {
        setID(id)
		if(printed){
			navigate.push(`../constancias/${id}`)
		}else{
			navigate.push(`./constancias/${id}`)
		}
    }
	const handleDelete = (id:GridRowId) => {
		setID(id as string)
		setOpenDialog(true)
	}
	const handleConfirmDelete = async () => {
        if (ID) {
            //borrar su detalle
            const detail = await ConstanciasService.fetchItemsDetalle(ID as string)
			if(detail.length > 0) {
            	for(const element of detail){
                	await ConstanciasService.deleteItem(Collection.CONSTANCIAS_NOTAS, element.id as string)
            	}
			}
            //borrar el item
            await ConstanciasService.deleteItem(Collection.CONSTANCIAS,ID as string);
            setRows(rows.filter((row: Iconstancia) => row.id !== ID));
            setID(null);
            setOpenDialog(false);
        }
    };

    //Columnas *****************************
	const columns: GridColDef[] = [
		{ 
			field: 'tipo', 
			headerName: 'CONSTANCIA', 
			width: 150,
			renderCell: (params) => {
				switch (params.value) {
					case 'CONSTANCIA_MATRICULA':
						return <Chip label='MATRÍCULA' color="secondary" />
					case 'CONSTANCIA_NOTAS':
						return <Chip label='NOTAS' color="primary" />
					default:
						return <Chip label={params.value} />
				}
			} 
		},
		{ field: 'estudiante', headerName: 'ESTUDIANTE', width: 220 },
		{ field: 'dni', headerName: 'DNI', width: 100 },
		{ field: 'createAt', headerName: 'FECHA', width: 110 },
		{ field: 'idioma', headerName: 'IDIOMA', width: 100 },
		{
			field: 'impreso',
            headerName: 'IMPRESO',
            width: 100,
            renderCell: (params) => {
                return <Checkbox 
                    checked={params.value as boolean}
                    onChange={(e)=>{handleCheckboxChange(params.id as GridRowId, e.target.checked)}} 
                    inputProps={{'aria-label': 'Checkbox Impreso'}}
                />
            }
		},
	]

    return (
		<Grid container spacing={2}>
			<Grid size={{xs: 12, md: 6}}>
				<NewButton text="Nueva Constancia" url='./constancias/nuevo'/>
			</Grid>
			<Grid size={{xs: 12, md: 6}}>
				<Box id='filter-panel' />
			</Grid>
			<Grid size={{xs: 12}} minHeight={300}>
			{
				printed ? <MyDataGrid
				data={rows} 
				cols={columns}
				handleDetails={handleDetails}
				handleDelete={handleDelete}
			/> :
			<MyDataGrid
				data={rows}
				cols={columns}
				handleDetails={handleDetails}
				handleDelete={handleDelete}
			/>
			}
			</Grid>
				<MyDialog 
					type='ALERT'
					title='Borrar Registro'
					content='¿Desea borrar el registro?'
					open={openDialog}
					setOpen={setOpenDialog}
					actionFunc={handleConfirmDelete}
				/>
		</Grid>
	)
}
