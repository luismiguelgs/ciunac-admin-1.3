'use client'
import IProspecto from '@/interfaces/prospecto.interface'
import React from 'react'
import validationSchema from './validation.schema'
import { useFormik } from 'formik'
import { useMask } from '@react-input/mask'
import useStore from '@/hooks/useStore'
import { useFacultiesStore } from '@/modules/opciones/store/types.stores'
import Grid from '@mui/material/Grid2'
import { Button, TextField, Typography } from '@mui/material'
import { MySelect, MySwitch } from '@/components/MUI'
import { changeDate } from '@/lib/utils'
import BackButton from '@/components/BackButton'
import SaveIcon from '@mui/icons-material/Save';

type Props = {
    onSubmit(values:IProspecto) : void
    data?: IProspecto
}
export default function LeadsForm({ onSubmit, data }: Props) 
{
    //hooks ***************************************************************************
    const faculties = useStore(useFacultiesStore, (state) => state.faculties)
   
    const apellidoRef = useMask({ mask: '________________________________________', replacement: { _: /^[a-zA-Z \u00C0-\u00FF]*$/ } })
    const nombreRef = useMask({ mask: '________________________________________', replacement: { _: /^[a-zA-Z \u00C0-\u00FF]*$/ } })
    const telefonoRef = useMask({ mask: '___-___-___', replacement: { _: /\d/ } });
    const codigoRef = useMask({ mask: '__________', replacement: { _: /^[a-zA-Z0-9_]*$/ } });
    const dniRef = useMask({ mask: '________', replacement: { _: /\d/ } });

    const formik = useFormik<IProspecto>({
        initialValues:{
            dni: data?.dni ? data.dni : '',
            apellidos: data?.apellidos ? data.apellidos : '',
            nombres: data?.nombres ? data.nombres : '',
            telefono: data?.telefono ? data.telefono : '',
            facultad: data?.facultad ? data.facultad : 'PAR',
            email: data?.email ? data.email : '',
            codigo: data?.codigo ? data.codigo : '',
            escuela: data?.escuela? data.escuela : '',
            trabajador: data?.trabajador ? data.trabajador : false
        },
        validationSchema: validationSchema,
        onSubmit: (values) =>{
            onSubmit(values)
        }
    })
    return (
        <Grid container spacing={2} component='form' onSubmit={formik.handleSubmit} p={1} mt={2}>
            <Grid size={{xs: 12, sm: 6}}>
                <TextField
                    inputRef={apellidoRef}
                    fullWidth
                    autoComplete='off'
                    error={formik.touched.apellidos && Boolean(formik.errors.apellidos)}
                    value={formik.values.apellidos}
                    onChange={formik.handleChange}
                    name="apellidos"
                    id="apellidos"
                    label="Apellidos"
                    helperText={formik.touched.apellidos && formik.errors.apellidos}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 6}}>
                <TextField
                    inputRef={nombreRef}
                    fullWidth
                    autoComplete='off'
                    error={formik.touched.nombres && Boolean(formik.errors.nombres)}
                    value={formik.values.nombres}
                    onChange={formik.handleChange}
                    name="nombres"
                    id="nombres"
                    label="Nombres"
                    helperText={formik.touched.nombres && formik.errors.nombres}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 6}}>
                <TextField
                    inputRef={dniRef}
                    fullWidth
                    autoComplete='off'
                    error={formik.touched.dni && Boolean(formik.errors.dni)}
                    value={formik.values.dni}
                    onChange={formik.handleChange}
                    name="dni"
                    id="dni"
                    label="DNI"
                    helperText={formik.touched.dni && formik.errors.dni}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 6}}>
                <TextField
                    inputRef={telefonoRef}
                    fullWidth
                    autoComplete='off'
                    error={formik.touched.telefono && Boolean(formik.errors.telefono)}
                    value={formik.values.telefono}
                    onChange={formik.handleChange}
                    name="telefono"
                    id="telefono"
                    label="Teléfono"
                    helperText={formik.touched.telefono && formik.errors.telefono}
                />
            </Grid>
            <Grid size={{xs:12,md:6}}>
                {faculties && <MySelect 
                    data={faculties}
                    name='facultad'
                                label='Facultad'
                                value={formik.values.facultad}
                                handleChange={formik.handleChange}
                                helperText={formik.touched.facultad && formik.errors.facultad}
                            
                />}
            </Grid>
            <Grid size={{xs:12,md:6}}>
                <TextField
                    fullWidth
                    value={formik.values.codigo}
                    error={formik.touched.codigo && Boolean(formik.errors.codigo)}
                    autoComplete='off'
                    inputRef={codigoRef}
                    onChange={formik.handleChange}
                    name="codigo"
                    label="Código de Alumno"
                    helperText={formik.touched.codigo && formik.errors.codigo}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 6}}>
                <TextField
                    fullWidth
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    value={formik.values.email}
                    autoComplete='off'
                    onChange={formik.handleChange}
                    name="email"
                    label="Email"
                    helperText={formik.touched.email && formik.errors.email}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 6}}>
                <MySwitch 
                    label='Trabajador UNAC'
                    checked={formik.values.trabajador as boolean}
                    name='trabajador'
                    handleChange={formik.handleChange}
                />
            </Grid>
            {
                data && (<>
                    <Grid size={{xs: 12, sm: 6}}>
                        <Typography variant="overline" display="block" gutterBottom>
                            Creado: {changeDate(data.creado)}
                        </Typography>
                    </Grid>
                    <Grid size={{xs: 12, sm: 6}}>
                        <Typography variant="overline" display="block" gutterBottom>
                            Modificado: {changeDate(data.modificado)}
                        </Typography>
                    </Grid>
                </>)
            }
            <Grid size={{xs: 12, sm: 6}}>
                <BackButton />
                <Button sx={{mr:1}} type="submit" variant="contained" color="success" endIcon={<SaveIcon />}>
                    Enviar
                </Button>
            </Grid>
        </Grid>
    )
}
