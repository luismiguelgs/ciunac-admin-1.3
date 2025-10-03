'use client'
import React from 'react'
import { DefaultizedPieValueType, PieChart, pieArcLabelClasses } from '@mui/x-charts';
import { Isolicitud } from '@/modules/solicitudes/interfaces/solicitud.interface';

export default function MyPieChart(props:{data:Isolicitud[]}) 
{
    const {data} = props
    const ingles = data.filter(objeto => objeto.idioma === 'INGLES').length;
    const portugues = data.filter(objeto => objeto.idioma === 'PORTUGUES').length;
    const italiano = data.filter(objeto => objeto.idioma === 'ITALIANO').length;
    const frances = data.filter(objeto => objeto.idioma === 'FRANCES').length;
    const otros = data.length - ingles - portugues - italiano - frances
    const TOTAL = data.length;

    const getArcLabel = (params: DefaultizedPieValueType) => {
        const percent = params.value / TOTAL;
        return `${(percent * 100).toFixed(0)}%`;
    };

    const sizing = {
        margin: { left: 6 },
        width: 400,
        height: 250,
    }

    return (
        <React.Fragment>
            <PieChart 
                series={[
                    {
                        data:[
                            {id:0, value: ingles, label:'Inglés'},
                            {id:1, value: portugues, label:'Portugués'},
                            {id:2, value: italiano, label:'Italiano'},
                            {id:3, value: frances, label:'Francés'},
                            {id:4, value: otros, label:'Otros'},
                        ],
                        arcLabel:getArcLabel
                    }
                ]}
                sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fill: 'white',
                      fontSize: 14,
                      fontWeight: 600
                    },
                }}
                {...sizing}
            />
        </React.Fragment>
    )
}
