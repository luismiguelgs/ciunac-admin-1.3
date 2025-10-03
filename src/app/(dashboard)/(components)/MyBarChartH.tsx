'use client'
import { Isolicitud } from '@/modules/solicitudes/interfaces/solicitud.interface';
import { BarChart } from '@mui/x-charts'
import React from 'react'

export default function MyBarChartH(props:{data: Isolicitud[]}) 
{
    const fcc = props.data.filter(objeto => objeto.facultad === 'FCC').length;
    const fpa = props.data.filter(objeto => objeto.facultad === 'FPA').length;
    const fce = props.data.filter(objeto => objeto.facultad === 'FCE').length;
    const fca = props.data.filter(objeto => objeto.facultad === 'FCA').length;
    const fnm = props.data.filter(objeto => objeto.facultad === 'FNM').length;
    const fme = props.data.filter(objeto => objeto.facultad === 'FME').length;
    const fee = props.data.filter(objeto => objeto.facultad === 'FEE').length;
    const fcs = props.data.filter(objeto => objeto.facultad === 'FCS').length;
    const far = props.data.filter(objeto => objeto.facultad === 'FAR').length;
    const fis = props.data.filter(objeto => objeto.facultad === 'FIS').length;
    const fiq = props.data.filter(objeto => objeto.facultad === 'FIQ').length;
    const par = props.data.filter(objeto => objeto.facultad === 'PAR').length;

    const series = [
        { facultad: 'FCC', cantidad: fcc },
        { facultad: 'FPA', cantidad: fpa },
        { facultad: 'FCE', cantidad: fce },
        { facultad: 'FCA', cantidad: fca },
        { facultad: 'FNM', cantidad: fnm },
        { facultad: 'FME', cantidad: fme },
        { facultad: 'FEE', cantidad: fee },
        { facultad: 'FCS', cantidad: fcs },
        { facultad: 'FAR', cantidad: far },
        { facultad: 'FIIS', cantidad: fis },
        { facultad: 'FIQ', cantidad: fiq },
        { facultad: 'PAR', cantidad: par },
    ]
    

    const chartSetting = {
        xAxis: [
            { label: 'certificados (und)', },
        ],
        width: 500,
        height: 320,
    }

    const valueFormatter = (value: number | null) => `${value} unidades`;
    return (
        <React.Fragment>
            <BarChart
                dataset={series}
                yAxis={[{scaleType: 'band', dataKey: 'facultad'}]}
                series={[{dataKey: 'cantidad', label: 'Certificados', valueFormatter}]}
                layout='horizontal'
                {...chartSetting}
            />
        </React.Fragment>
    )
}
