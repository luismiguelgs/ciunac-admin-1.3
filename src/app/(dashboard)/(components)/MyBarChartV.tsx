'use client'
import { Isolicitud } from '@/modules/solicitudes/interfaces/solicitud.interface';
import { axisClasses, BarChart } from '@mui/x-charts'
import React from 'react';

export default function MyBarChartV(props:{data: Isolicitud[]}) 
{
    const nuevos = props.data.filter(objeto => objeto.estado === 'NUEVO').length;
    const elaborados = props.data.filter(objeto => objeto.estado === 'ELABORADO').length;
    const entregados = props.data.filter(objeto => objeto.estado === 'ENTREGADO').length;

    const series = [
        { estado: 'Nuevos', cantidad: nuevos},
        { estado: 'Elaborados', cantidad: elaborados},
        { estado: 'Entregados', cantidad: entregados},
    ]

    const chartSetting = {
        yAxis: [
            {
                label: 'certificados',
            },
        ],
        width: 500,
        height: 320,
        sx: {
            [`.${axisClasses.left} .${axisClasses.label}`]: {
                    transform: 'translate(-20px, 0)',
            },
        },
    };
    

    const valueFormatter = (value: number | null) => `${value} unidades`;
    return (
        <React.Fragment>
            <BarChart
                    dataset={series}
                    xAxis={[{scaleType:'band', dataKey: 'estado'}]}
                    series={[
                        {dataKey: 'cantidad', label: 'Cantidad', valueFormatter}
                    ]}
                    {...chartSetting}
            />
        </React.Fragment>
    )
}
