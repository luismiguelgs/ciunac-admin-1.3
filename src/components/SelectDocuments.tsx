'use client'
import React from 'react'
import { MySelect } from './MUI'
import useStore from '@/hooks/useStore'
import { useDocumentsStore } from '@/modules/opciones/store/types.stores'
import OpcionesService, { Collection } from '@/modules/opciones/services/opciones.service'
import { Skeleton } from '@mui/material'
import { ITipoSolicitud } from '@/modules/opciones/interfaces/types.interface'

type Props = {
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    error?: boolean | undefined
    value: string | number
    disabled?: boolean
    helperText?: React.ReactNode
    name?: string
}

export default function SelectDocuments({handleChange, error, value, helperText, disabled, name='tipoSolicitudId'}:Props) 
{
    const [data, setData] = React.useState<ITipoSolicitud[] | undefined>(useStore(useDocumentsStore, (state) => state.documents)); 

    React.useEffect(() => {
        const getData = async () => {
            const subs = await OpcionesService.fetchItems<ITipoSolicitud>(Collection.Tiposolicitud);    
            useDocumentsStore.getState().setDocuments(subs);
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
                data={data.filter((item) => item.id !== 8)}
                handleChange={handleChange}
                error={error}
                label='Tipo de solicitud'
                disabled={disabled}
                name={name}
                value={value}
                helperText={helperText}
                getOptionValue={(option) => String(option.id)}
                getOptionLabel={(option) => option.solicitud}
        />)
    )
}
