'use client'
import React from 'react'
import useStore from '@/hooks/useStore'
import OpcionesService, { Collection } from '@/modules/opciones/services/opciones.service'
import { useEscuelasStore } from '@/modules/opciones/store/types.stores'
import { MySelect } from './MUI'
import { Skeleton } from '@mui/material'
import { IEscuela } from '@/modules/opciones/interfaces/types.interface'

type Props = {
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    error?: boolean | undefined
    value: string | number
    disabled?: boolean
    helperText?: React.ReactNode,
    facultad?:number
}
export default function SelectEscuela({handleChange, error, value, helperText, disabled, facultad}:Props) 
{
    const init = useStore(useEscuelasStore, (state) => state.escuelas)
    const [data, setData] = React.useState<IEscuela[] | undefined>(init);

    React.useEffect(() => {
        const getData = async () => {
            const subs = await OpcionesService.fetchItems<IEscuela>(Collection.Escuelas);
            useEscuelasStore.setState({ escuelas: subs })
            setData(subs)
        }
        if(!data) getData()
    }, []);

    if(!data) return (<Skeleton variant='rectangular' height={55} sx={{mt:1}}/>)
    
    return (
        data && (
            <MySelect
                data={data.filter((escuela) => escuela.facultadId === facultad)}
                handleChange={handleChange}
                error={error}
                label='Escuela'
                name='escuela'
                value={value}
                disabled={disabled}
                helperText={helperText}
            />
        )
    )
}
