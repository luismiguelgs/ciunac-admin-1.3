'use client'
import React from 'react'
import { Button, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import DataTable, { Column } from '@/components/MUI/DataTable';
import SolicitudesService from '@/modules/solicitudes/services/solicitud.service';
import { exportToExcel } from '@/lib/utils';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { ISolicitudRes } from '@/modules/solicitudes/interfaces/solicitudres.interface';

const columns: Column[] = [
    { id:'creadoEn', label:'Fecha',minWidth:40},
    { id: 'estudiante.apellidos', label: 'Apellidos', minWidth: 150 },
    { id: 'estudiante.nombres', label: 'Nombres', minWidth: 120 },
    { id: 'estudiante.numeroDocumento', label: 'DNI', minWidth:100},
    { id: 'pago', label: 'Abono(S/)', minWidth: 25 },
    { id: 'numeroVoucher', label: 'Número de recibo', minWidth: 80 },
    { id: 'nivel.nombre', label: 'Nivel', minWidth: 25, align: 'right' },
    { id: 'idioma.nombre', label: 'Idioma', minWidth: 25, align: 'right' },
];


export default function ReportExam() 
{
    //data y bd
    const [fechaInicial, setFechaInicial] = React.useState<string>(new Date().toISOString().split('T')[0])
    const [displayFechaFinal, setDisplayFechaFinal] = React.useState<string>(new Date().toISOString().split('T')[0])
    const [fechaFinal, setFechaFinal] = React.useState<string>(new Date().toISOString().split('T')[0])
    const [data, setData] = React.useState<ISolicitudRes[]>([]);

    React.useEffect(()=>{
        const getData = async() => {
            const data = await SolicitudesService.fetchItemQueryDate('7', fechaInicial, fechaFinal)
            setData(data)
        }
        getData()
    },[fechaInicial,fechaFinal]);

    //aumenta un dia la fecha final
    const handleFechaFinalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputDate = e.target.value;
        const isValidDate = !isNaN(new Date(inputDate).getTime());
        if (isValidDate) {
          // Obtener la fecha siguiente agregando un día a la fecha ingresada
          setDisplayFechaFinal(inputDate)
          const nextDate = new Date(new Date(inputDate).getTime() + 24 * 60 * 60 * 1000);
          setFechaFinal(nextDate.toISOString().split('T')[0]);
        } else {
          console.error('Fecha inválida');
        }
    };

    const handleExport = async() => {
        await exportToExcel(data)           
    }
    return (
        <React.Fragment>
            <Grid container spacing={2} sx={{mt:1}}>
                <Grid size={{xs: 12, sm: 6}}>
                    <TextField
                        type='date'
                        sx={{mb:2, width:'95%'}}
                        required
                        disabled={false}
                        error={false}
                        value={fechaInicial}
                        onChange={(e)=>{
                            const inputDate = e.target.value;
                            const isValidDate = !isNaN(new Date(inputDate).getTime());
                            if (isValidDate) {
                                setFechaInicial(inputDate);
                            } else {
                                console.error('Fecha inválida');
                            }
                        }}
                        name="fecha"
                        label="Fecha Inicial"
                        helperText={false && "Ingrese la fecha válida"}
                    />
                </Grid>
                <Grid size={{xs: 12, sm: 6}}>
                    <TextField
                        type='date'
                        sx={{mb:2, width:'95%'}}
                        required
                        disabled={false}
                        error={false}
                        value={displayFechaFinal}
                        onChange={handleFechaFinalChange}
                        name="fecha"
                        label="Fecha Final"
                        helperText={false && "Ingrese la fecha válida"}
                    />
                </Grid>
            </Grid>
            <DataTable columns={columns} rows={data} action={false} />
            <Button onClick={handleExport} variant="contained" endIcon={<CloudDownloadIcon />} sx={{mt:1}}>
                Exportar a Excel
            </Button>
        </React.Fragment>
    )
}
