'use client'
import React from 'react'
import Grid from '@mui/material/Grid2';
import CardChart from './CardChart';
import SolicitudesService from '@/services/solicitudes.service';
import MyLineChart from './MyLineChart';
import MyPieChart from './MyPieChart';
import { Isolicitud } from '@/modules/solicitudes/interfaces/solicitud.interface';
import MyBarChartH from './MyBarChartH';
import MyBarChartV from './MyBarChartV';
import { Skeleton } from '@mui/material';


// Skeleton para cargar gráficos
function SkeletonCard({ title }: { title: string }) {
    return (
      <CardChart title={title}>
        <Skeleton variant="rectangular" width="100%" height={250} />
      </CardChart>
    );
}

/**
 * Componente que muestra 2 graficas.
 * La primera es una grafica de torta que muestra el numero de solicitudes por idioma.
 * La segunda es una grafica de lineas que muestra el numero de solicitudes por mes.
 * @returns {JSX.Element}
 */
export default function Graphs(): JSX.Element 
{
    const [data, setData] = React.useState<Isolicitud[]>([]);

    React.useEffect(() => {
        const getData = async () => {
            const res = await SolicitudesService.fetchItemsWODate();
            setData(res);
        }
        getData();
    }, []);

    return (
        <>
            <Grid size={{xs: 12, sm: 6}}>
                {
                    data.length > 0 ? (
                        <CardChart title='Solicitudes por idioma'>
                            <MyPieChart data={data} />
                        </CardChart>
                    ) : (
                        <SkeletonCard title='Solicitudes por idioma' />
                    )
                }
            </Grid>
                
            <Grid size={{xs:12, sm:6}}>
                {
                    data.length > 0 ? (
                        <CardChart title='Solicitudes por mes'>
                            <MyLineChart data={data}/>
                        </CardChart>
                    ) : (
                        <SkeletonCard title='Solicitudes por mes' />
                    )
                }
            </Grid>

            <Grid size={{xs:12, sm:6}}>
                {
                    data.length > 0 ? (
                        <CardChart title='Solicitudes por Facultad'>
                            <MyBarChartH data={data}/>
                        </CardChart>
                    ) : (
                        <SkeletonCard title='Solicitudes por Facultad' />
                    )
                }
                
            </Grid>

            <Grid size={{xs:12, sm:6}}>
                {
                    data.length > 0 ? (
                        <CardChart title='Solicitudes por estado'>
                            <MyBarChartV data={data} />
                        </CardChart>
                    ) : (
                        <SkeletonCard title='Solicitudes por estado' />
                    )
                }
            </Grid>
        </>
    )
}
