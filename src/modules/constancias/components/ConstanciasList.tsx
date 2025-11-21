import { IConstancia } from '../interfaces/constancia.interface'
import { ConstanciasService } from '@/modules/constancias/services/constancias.service'
import SolicitudesService from '@/modules/solicitudes/services/solicitud.service'
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
    rows: IConstancia[]
    setRows: React.Dispatch<React.SetStateAction<IConstancia[]>>
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
        await ConstanciasService.updateStatus(id as string, checked)
        const info = rows.find((row) => row.id === id)
		if(checked)
            await SolicitudesService.updateStatus(info?.solicitud_id as number, 3) //entregardo
        else
            await SolicitudesService.updateStatus(info?.solicitud_id as number, 2) //impreso
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
            //borrar el item
            await ConstanciasService.deleteItem(ID as string);
            setRows(rows.filter((row: IConstancia) => row.id !== ID));
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
