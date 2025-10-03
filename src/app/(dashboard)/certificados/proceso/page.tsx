'use client'
import { Isolicitud } from '@/modules/solicitudes/interfaces/solicitud.interface'
import SolicitudesService from '@/services/solicitudes.service'
import React from 'react'
import Grid from '@mui/material/Grid2'
import { Divider, IconButton, InputBase, MenuItem, Paper, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Kanbam from './(components)/Kanbam'


const años = [
  {value:2025, label:'2025'},
	{value:2024, label:'2024'},
	{value:2023, label:'2023'},
]
const meses = [
	{value:0, label: 'ENERO'},
	{value:1, label: 'FEBRERO'},
	{value:2, label: 'MARZO'},
	{value:3, label: 'ABRIL'},
	{value:4, label: 'MAYO'},
	{value:5, label: 'JUNIO'},
	{value:6, label: 'JULIO'},
	{value:7, label: 'AGOSTO'},
	{value:8, label: 'SETIEMBRE'},
	{value:9, label: 'OCTUBRE'},
	{value:10, label: 'NOVIEMBRE'},
	{value:11, label: 'DICIEMBRE'},
]

export default function CertificateProcessPage() 
{
	const [data, setData] = React.useState<Isolicitud[]>([])
	const [filtered, setFiltered] = React.useState<Isolicitud[]>([])
	const [busqueda,setBusqueda] = React.useState<string>('')
	const [mes, setMes] = React.useState<number>(new Date().getMonth())
	const [año, setAño] = React.useState<number>(new Date().getFullYear())

	React.useEffect(()=>{
		const getData = async()=>{
			const result = await SolicitudesService.fetchItemQueryPeriod(mes, año)
			//console.log(result);
			setData(result)
			setFiltered(result)
		}
		getData()
	},[mes,año])

	const buscar = () => {
		const filtered = data.filter(item => {
			// Puedes ajustar las propiedades que deseas incluir en la búsqueda
			return (
			  item.nombres?.toLowerCase().includes(busqueda.toLowerCase()) ||
			  item.apellidos?.toLowerCase().includes(busqueda.toLowerCase())
			);
		});
		setFiltered(filtered)
	}
	const resetBusqueda = () =>{
		setFiltered(data)
		setBusqueda('')
	}

	const manejarBusqueda = (event:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
		setBusqueda(event.target.value)
		if(event.target.value === ''){
			resetBusqueda()
		}else{
			buscar()
		}
	}

	return (
		<Grid container spacing={2} p={2} >
			<Grid size={{xs: 6 }} >
				<Paper component="form"
					sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', position: 'relative', width:300, m:'0 auto'}} >
						<TextField
							select
							sx={{p:1, lr:2, width:140}}
							label="Año"
							variant="standard"
							value={año}
							onChange={(e)=>setAño(+e.target.value)}
							>
							{años.map((option) => (
								<MenuItem key={option.value} value={option.value}>
									{option.label}
								</MenuItem>
							))}
						</TextField>
						<Divider sx={{ height: 28, m: 1 }} orientation="vertical" />
						<TextField
							select
							sx={{p:1, lr:2, width:140}}
							label="Mes"
							variant="standard"
							value={mes}
							onChange={(e)=>setMes(+e.target.value)}
							>
							{meses.map((option) => (
								<MenuItem key={option.value} value={option.value}>
								{option.label}
								</MenuItem>
							))}
						</TextField>
				</Paper>
			</Grid>
			<Grid size={{xs: 6 }} >
				<Paper component="form"
						sx={{ p: '10px 4px', display: 'flex', alignItems: 'center', width: 400, position:'relative', m:'0 auto' }} >
						<IconButton type="button" sx={{ p: '10px' }} aria-label="search">
							<SearchIcon />
						</IconButton>
						<InputBase
							sx={{ ml: 1, flex: 1 }}
							placeholder="Buscar"
							value={busqueda}
							onChange={(e)=> manejarBusqueda(e)}
							inputProps={{ 'aria-label': 'buscar' }}
						/>
						<Divider sx={{ height: 28, m: 1 }} orientation="vertical" />
						<IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={resetBusqueda}>
							<RestartAltIcon />
						</IconButton>
				</Paper>
			</Grid>
			<Grid size={{xs: 12}}>
				<Kanbam data={filtered} />
			</Grid>
		</Grid>
	)
}
