'use client'
import React from 'react'
import Grid from '@mui/material/Grid2'
import { FormikProps } from 'formik'
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material'
import { MySelect, MySwitch } from '@/components/MUI'
import { NIVEL } from '@/lib/constants'
import SelectSubjects from '@/components/SelectSubjects'
import { Iconstancia } from '../../../../interfaces/constancia.interface'

type Props = {
    formik: FormikProps<Iconstancia>,
    id: string,
    edit?: boolean
}


export default function ConstanciaForm({formik, id, edit=false}:Props)
{
    return(
        <Grid container spacing={2} component='form' onSubmit={formik.handleSubmit}>
            <Grid size={{xs: 12, sm: 6}}>
                <MySelect
                    data={[
                        {
                            value: 'CONSTANCIA_MATRICULA',
                            label: 'CONSTANCIA DE MATRÍCULA'
                        },
                        {
                            value: 'CONSTANCIA_NOTAS',
                            label: 'CONSTANCIA DE NOTAS'
                        }
                    ]}
                    handleChange={formik.handleChange}
                    label='Tipo de contancia'
                    name='tipo'
                    disabled={id!== 'nuevo'}
                    error={formik.touched.tipo && Boolean(formik.errors.tipo)}
                    value={formik.values.tipo} 
                />
            </Grid>
            <Grid size={{xs: 12, sm: 6}}> 
                <TextField
                    autoFocus
                    value={formik.values.estudiante || ''}
                    name='estudiante'
                    label="Alumno"
                    error={formik.touched.estudiante && Boolean(formik.errors.estudiante)}
                    type="text"
                    fullWidth
                    disabled={id !== 'nuevo' && !edit}
                    variant="outlined"
                    onChange={formik.handleChange}
                    helperText={formik.touched.estudiante && formik.errors.estudiante}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 6}}>
                <TextField
                    autoFocus
                    value={formik.values.id_solicitud || ''}
                    name='id_solicitud'
                    label="ID Solicitud"
                    error={formik.touched.id_solicitud && Boolean(formik.errors.id_solicitud)}
                    type="text"
                    fullWidth
                    disabled={true}
                    slotProps={{inputLabel: { shrink: true, }}}
                    variant="outlined"
                    onChange={formik.handleChange}
                    helperText={formik.touched.id_solicitud && formik.errors.id_solicitud}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 3}}>
                <TextField
                    value={formik.values.dni || ''}
                    name='dni'
                    label="DNI alumno"
                    error={formik.touched.dni && Boolean(formik.errors.dni)}
                    type="text"
                    fullWidth
                    disabled={id !== 'nuevo' && !edit}
                    slotProps={{inputLabel: { shrink: true, }}}
                    variant="outlined"
                    onChange={formik.handleChange}
                    helperText={formik.touched.dni && formik.errors.dni}
                />
            </Grid>
            
            <Grid size={{xs: 12, sm: 3}}>
                <SelectSubjects 
                    disabled={id !== 'nuevo' && !edit}
                    error={formik.touched.idioma && Boolean(formik.errors.idioma)}
                    helperText={formik.touched.idioma && formik.errors.idioma}
                    value={formik.values.idioma}
                    handleChange={formik.handleChange}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 3}}>
                <MySelect 
                    data={NIVEL}
                    handleChange={formik.handleChange}
                    label='Nivel'
                    name='nivel'
                    disabled={id !== 'nuevo' && !edit}
                    error={formik.touched.nivel && Boolean(formik.errors.nivel)}
                    value={formik.values.nivel}
                    helperText={formik.touched.nivel && formik.errors.nivel}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 3}}>
                <TextField
                    value={formik.values.ciclo || ''}
                    name='ciclo'
                    label="ciclo alumno"
                    error={formik.touched.ciclo && Boolean(formik.errors.ciclo)}
                    type="number"
                    fullWidth
                    disabled={id !== 'nuevo' && !edit}
                    slotProps={{inputLabel: { shrink: true, }}}
                    variant="outlined"
                    onChange={formik.handleChange}
                    helperText={formik.touched.ciclo && formik.errors.ciclo}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 3}}>
                { formik.values.tipo === 'CONSTANCIA_MATRICULA' && <FormControl>
                    <FormLabel id="radio-modalidad-label">Modalidad</FormLabel>
                    <RadioGroup 
                        row
                        value={formik.values.modalidad || ''}
                        onChange={formik.handleChange} 
                        aria-labelledby='radio-modalidad-label' 
                        name='modalidad'>
                        <FormControlLabel value='REGULAR' control={<Radio />} label='REGULAR' />
                        <FormControlLabel value='INTENSIVO' control={<Radio />} label='INTENSIVO' />
                    </RadioGroup>
                </FormControl>}
            </Grid>
            <Grid size={{xs: 12, sm: 3}}>
                { formik.values.tipo === 'CONSTANCIA_MATRICULA' && <TextField
                    value={formik.values.horario || ''}
                    name='horario'
                    label="Horario Matriculado"
                    error={formik.touched.horario && Boolean(formik.errors.horario)}
                    type="text"
                    fullWidth
                    disabled={id !== 'nuevo' && !edit}
                    slotProps={{inputLabel: { shrink: true, }}}
                    variant="outlined"
                    onChange={formik.handleChange}
                    helperText={formik.touched.horario && formik.errors.horario}
                />}
            </Grid>
            <Grid size={{xs: 12, sm: 3}}>
                <MySwitch 
                    label='Impreso'
                    name='impreso'
                    disabled={id == 'nuevo' && !edit}
                    checked={formik.values.impreso as boolean}
                    handleChange={formik.handleChange}
                    sx={{mt:1}}
                />
            </Grid>
        </Grid>
    )
}