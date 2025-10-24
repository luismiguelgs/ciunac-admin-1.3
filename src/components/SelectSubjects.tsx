'use client'
import React from 'react'
import { MySelect } from './MUI'
import useStore from '@/hooks/useStore'
import { useSubjectsStore } from '@/modules/opciones/store/types.stores'
import OpcionesService, { Collection } from '@/modules/opciones/services/opciones.service'
import { IIdioma } from '@/modules/opciones/interfaces/types.interface'
import { Skeleton } from '@mui/material'

type Props = {
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    error?: boolean | undefined
    value: string | number
    disabled?: boolean
    helperText?: React.ReactNode
    name?: string
}

export default function SelectSubjects({handleChange, error, value, helperText, disabled, name='idiomaId'}:Props) 
{
    const [data, setData] = React.useState<IIdioma[] | undefined>(useStore(useSubjectsStore, (state) => state.subjects)); 

    React.useEffect(() => {
        const getData = async () => {
            const subs = await OpcionesService.fetchItems<IIdioma>(Collection.Idiomas);    
            useSubjectsStore.getState().setSubjects(subs);
            setData(subs)
        } 
        if(!data){
            getData();
        } 
        
    },[]);

    if(!data){
        return (
            <Skeleton variant="rectangular" height={55} />
        )
    }
    return (
        data && (
            <MySelect 
            data={data}
            handleChange={handleChange}
            error={error}
            label='Idioma'
            disabled={disabled}
            name={name}
            value={value}
            helperText={helperText}
            getOptionValue={(option) => String(option.id)}
            getOptionLabel={(option) => option.nombre}
        />)
    )
}
