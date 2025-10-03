'use client'
import React from 'react'
import useStore from '@/hooks/useStore'
import OpcionesService, { Collection } from '@/modules/opciones/services/opciones.service'
import { useFacultiesStore } from '@/modules/opciones/store/types.stores'
import { MySelect } from './MUI'
import { Skeleton } from '@mui/material'
import { IFacultad } from '@/modules/opciones/interfaces/types.interface'

type Props = {
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    error?: boolean | undefined
    value: string | number
    disabled?: boolean
    helperText?: React.ReactNode,
}
export default function SelectFaculty({handleChange, error, value, helperText, disabled}:Props) 
{
    const init = useStore(useFacultiesStore, (state) => state.faculties)
    const [data, setData] = React.useState<IFacultad[] | undefined>(init);

    React.useEffect(() => {
        const getData = async () => {
            const subs = await OpcionesService.fetchItems<IFacultad>(Collection.Facultades);
            useFacultiesStore.setState({ faculties: subs })
            setData(subs)
        }
        if(!data) getData()
    }, []);

    if(!data) return (<Skeleton variant='rectangular' height={55} sx={{mt:1}}/>)
    
    return (
        data && (
            <MySelect
                data={data}
                handleChange={handleChange}
                error={error}
                label='Facultad'
                name='facultad'
                value={value}
                
                disabled={disabled}
                helperText={helperText}
            />
        )
    )
}
