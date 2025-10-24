import Grid from '@mui/material/Grid2'
import IProspecto from '../../../interfaces/prospecto.interface'
import React from 'react'
import { TextField } from '@mui/material'
import useStore from '@/hooks/useStore';
import {  useFacultiesStore } from '@/modules/opciones/store/types.stores';
import { MySelect } from '@/components/MUI';
import { ESCUELAS } from '@/lib/constants';

export default function InfoStudent({item}:{item:IProspecto}) 
{
    console.log(item)
    const faculties = useStore(useFacultiesStore, (state) => state.faculties)

    return (
        <Grid container spacing={2} p={2}>
            <Grid size={{xs: 12, sm: 6}} >
                <TextField
                    disabled
                    variant='standard'
                    fullWidth
                    value={item?.apellidos}
                    label="Apellidos"
                    slotProps={{ inputLabel: { shrink: true, } }}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 6}} >
                <TextField
                    disabled
                    fullWidth
                    variant='standard'
                    value={item?.nombres}
                    label="Nombres"
                    slotProps={{ inputLabel: { shrink: true, } }}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 6}} >
                <TextField
                    disabled
                    variant='standard'
                    fullWidth
                    value={item?.dni}
                    label="Documento de Identidad"
                    slotProps={{ inputLabel: { shrink: true, } }}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 6}} >
                <TextField
                    disabled
                    fullWidth
                    variant='standard'
                    value={item?.telefono}
                    label="Teléfono"
                    slotProps={{ inputLabel: { shrink: true, } }}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 6}} >
                { faculties && <MySelect
                        disabled={true}
                        data={faculties} 
                        name="facultad" 
                        variant='standard'
                        label="Facultad" 
                        value={item?.facultad} 
                        handleChange={()=>{}}
                />}
            </Grid>
            <Grid size={{xs: 12, sm: 6}} >
                { faculties && <MySelect
                        disabled={true}
                        data={ESCUELAS} 
                        variant='standard'
                        name="facultad" 
                        label="Facultad" 
                        value={item?.escuela} 
                        handleChange={()=>{}}
                />}
            </Grid>
            <Grid size={{xs: 12, sm: 6}} >
                <TextField
                    disabled
                    fullWidth
                    variant='standard'
                    value={item?.codigo}
                    label="Código"
                    slotProps={{ inputLabel: { shrink: true, } }}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 6}} >
                <TextField
                    disabled
                    fullWidth
                    variant='standard'
                    value={item?.email}
                    label="Email"
                    slotProps={{ inputLabel: { shrink: true, } }}
                />
            </Grid>
        </Grid>
    )
}
