import Grid from '@mui/material/Grid2'
import React from 'react'
import { TextField } from '@mui/material'
//import useStore from '@/hooks/useStore';
//import {  useFacultiesStore } from '@/modules/opciones/store/types.stores';
import ISolicitudBeca from '../interfaces/solicitud-beca.interfaces';

export default function InfoStudent({ item }: { item: ISolicitudBeca }) {
    //console.log(item)
    //const faculties = useStore(useFacultiesStore, (state) => state.faculties)

    return (
        <Grid container spacing={2} p={2}>
            <Grid size={{ xs: 12, sm: 6 }} >
                <TextField
                    disabled
                    variant='standard'
                    fullWidth
                    value={item?.apellidos}
                    label="Apellidos"
                    slotProps={{ inputLabel: { shrink: true, } }}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} >
                <TextField
                    disabled
                    fullWidth
                    variant='standard'
                    value={item?.nombres}
                    label="Nombres"
                    slotProps={{ inputLabel: { shrink: true, } }}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} >
                <TextField
                    disabled
                    variant='standard'
                    fullWidth
                    value={item?.numero_documento}
                    label="Documento de Identidad"
                    slotProps={{ inputLabel: { shrink: true, } }}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} >
                <TextField
                    disabled
                    fullWidth
                    variant='standard'
                    value={item?.telefono}
                    label="Teléfono"
                    slotProps={{ inputLabel: { shrink: true, } }}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} >
                <TextField
                    disabled
                    fullWidth
                    variant='standard'
                    value={item?.facultad}
                    label="Facultad"
                    slotProps={{ inputLabel: { shrink: true, } }}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} >
                <TextField
                    disabled
                    fullWidth
                    variant='standard'
                    value={item?.escuela}
                    label="Escuela"
                    slotProps={{ inputLabel: { shrink: true, } }}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} >
                <TextField
                    disabled
                    fullWidth
                    variant='standard'
                    value={item?.codigo}
                    label="Código"
                    slotProps={{ inputLabel: { shrink: true, } }}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} >
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
