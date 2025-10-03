'use client'
import React from 'react'
import Grid from '@mui/material/Grid2'
import { FormikProps } from 'formik'
import { Icertificado } from '@/modules/certificados/interfaces/certificado.interface'
import { TextField } from '@mui/material'
import { MySelect, MySwitch } from '@/components/MUI'
import { NIVEL } from '@/lib/constants'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import SelectSubjects from '@/components/SelectSubjects'

type Props = {
    formik: FormikProps<Icertificado>,
    id: string,
    edit?: boolean
}


export default function CertificateForm({formik, id, edit=false}:Props)
{
    return (
        <Grid container spacing={2} p={2} component='form' onSubmit={formik.handleSubmit}>
            <Grid size={{xs: 12, sm: 6}}>
                <TextField
                    autoFocus
                    value={formik.values.alumno}
                    name='alumno'
                    label="Alumno"
                    error={formik.touched.alumno && Boolean(formik.errors.alumno)}
                    type="text"
                    fullWidth
                    disabled={id !== 'nuevo' && !edit}
                    variant="outlined"
                    onChange={formik.handleChange}
                    helperText={formik.touched.alumno && formik.errors.alumno}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 6}}>
                <TextField
                    autoFocus
                    value={formik.values.id_solicitud}
                    name='id_solicitud'
                    label="ID Solicitud"
                    error={formik.touched.id_solicitud && Boolean(formik.errors.id_solicitud)}
                    type="text"
                    fullWidth
                    disabled={id !== 'nuevo' && !edit}
                    slotProps={{inputLabel: { shrink: true, }}}
                    variant="outlined"
                    onChange={formik.handleChange}
                    helperText={formik.touched.id_solicitud && formik.errors.id_solicitud}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 3}}>
            <TextField
                    autoFocus
                    value={formik.values.dni}
                    name='dni'
                    disabled={id !== 'nuevo' && !edit}
                    label="Documento de Identidad"
                    error={formik.touched.dni && Boolean(formik.errors.dni)}
                    type="number"
                    fullWidth
                    slotProps={{inputLabel: { shrink: true, }}}
                    variant="outlined"
                    onChange={formik.handleChange}
                    helperText={formik.touched.dni && formik.errors.dni}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 3}}>
                <SelectSubjects 
                    disabled={id !== 'nuevo'}
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
                    disabled={id !== 'nuevo'}
                    error={formik.touched.nivel && Boolean(formik.errors.nivel)}
                    value={formik.values.nivel}
                    helperText={formik.touched.nivel && formik.errors.nivel}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 3}}>
                <TextField
                    autoFocus
                    value={formik.values.horas}
                    name='horas'
                    disabled={id !== 'nuevo'}
                    label="Cantidad de Horas"
                    error={formik.touched.horas && Boolean(formik.errors.horas)}
                    type="number"
                    fullWidth
                    variant="outlined"
                    onChange={formik.handleChange}
                    helperText={formik.touched.horas && formik.errors.horas}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 3}}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es'>
                    <DatePicker 
                        label="Fecha Emisión"
                        value={dayjs(formik.values.fecha_emision)} 
                        onChange={(date)=>formik.setFieldValue('fecha_emision',date)} 
                        maxDate={dayjs(new Date())}
                        disabled={id !== 'nuevo' && !edit}
                        slotProps={{
                            textField:{
                                fullWidth:true,
                                error: Boolean(formik.touched.fecha_emision) && Boolean(formik.errors.fecha_emision),
                                helperText: (formik.touched.fecha_emision && formik.errors.fecha_emision) as string
                            }
                        }}
                    />
                </LocalizationProvider>
            </Grid>
            <Grid size={{xs: 12, sm: 3}}>
                <TextField
                    autoFocus
                    value={formik.values.numero_registro}
                    name='numero_registro'
                    label="Número de Registro"
                    disabled={id !== 'nuevo' && !edit}
                    error={formik.touched.numero_registro && Boolean(formik.errors.numero_registro)}
                    type="text"
                    fullWidth
                    variant="outlined"
                    onChange={formik.handleChange}
                    helperText={formik.touched.numero_registro && formik.errors.numero_registro}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 3}}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es'>
                    <DatePicker 
                        label="Fecha Concluido"
                        value={dayjs(formik.values.fecha_conclusion)} 
                        onChange={(date)=>formik.setFieldValue('fecha_conclusion',dayjs(date))} 
                        disabled={id !== 'nuevo' && !edit}
                        maxDate={dayjs(new Date())}
                        slotProps={{
                            textField:{
                                fullWidth:true,
                                error: Boolean(formik.touched.fecha_conclusion) && Boolean(formik.errors.fecha_conclusion),
                                helperText: (formik.touched.fecha_conclusion && formik.errors.fecha_conclusion) as string
                            }
                        }}
                    />
                </LocalizationProvider>
            </Grid>
            <Grid size={{xs: 12, sm: 3}}>
            <MySelect 
                    data={[{label:'Físico', value:'fisico'},{label:'Digital', value:'digital'}]}
                    handleChange={formik.handleChange}
                    label='Tipo de Certificado'
                    name='tipo'
                    disabled={id !== 'nuevo' && !edit}
                    error={formik.touched.tipo && Boolean(formik.errors.tipo)}
                    value={formik.values.tipo}
                    helperText={formik.touched.tipo && formik.errors.tipo}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 3}}>
                <MySwitch 
                    label='Curricula Antigua'
                    name='curricula_antigua'
                    disabled={id !== 'nuevo' && !edit}
                    checked={formik.values.curricula_antigua as boolean}
                    handleChange={formik.handleChange}
                    sx={{mt:1}}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 3}}>
                <MySwitch 
                    label='Impreso'
                    name='impreso'
                    disabled={id !== 'nuevo' && !edit}
                    checked={formik.values.impreso as boolean}
                    handleChange={formik.handleChange}
                    sx={{mt:1}}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 3}}>
                <MySwitch 
                    label='Duplicado'
                    name='duplicado'
                    disabled={id !== 'nuevo' && !edit}
                    checked={formik.values.duplicado as boolean}
                    handleChange={formik.handleChange}
                    sx={{mt:1}}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 3}}>
                <MySwitch 
                    label='Aceptado'
                    name='aceptacion'
                    disabled={true}
                    checked={formik.values.aceptacion as boolean}
                    handleChange={formik.handleChange}
                    sx={{mt:1}}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 3}}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es'>
                    <DatePicker 
                        label="Fecha Aceptación"
                        value={dayjs(formik.values.fecha_aceptacion)} 
                        onChange={(date)=>formik.setFieldValue('fecha_aceptacion',dayjs(date))} 
                        disabled={id !== 'nuevo' && !edit}
                        maxDate={dayjs(new Date())}
                        slotProps={{
                            textField:{
                                fullWidth:true,
                                error: Boolean(formik.touched.fecha_aceptacion) && Boolean(formik.errors.fecha_aceptacion),
                                helperText: (formik.touched.fecha_aceptacion && formik.errors.fecha_aceptacion) as string
                            }
                        }}
                    />
                </LocalizationProvider>
            </Grid>
            <Grid size={{xs: 12, sm: 3}}>
                <TextField
                    autoFocus
                    disabled={!formik.values.duplicado as boolean}
                    value={formik.values.certificado_anterior}
                    name='certificado_anterior'
                    label="Certificado Original"
                    error={formik.touched.certificado_anterior && Boolean(formik.errors.certificado_anterior)}
                    type="text"
                    fullWidth
                    variant="outlined"
                    onChange={formik.handleChange}
                    helperText={formik.touched.certificado_anterior && formik.errors.certificado_anterior}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 3}}>
                <TextField
                    autoFocus
                    disabled
                    value={formik.values.elaborador}
                    name='elaborador'
                    label="Elaborado por"
                    error={formik.touched.elaborador && Boolean(formik.errors.elaborador)}
                    type="text"
                    fullWidth
                    variant="outlined"
                    onChange={formik.handleChange}
                    helperText={formik.touched.elaborador && formik.errors.elaborador}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 3}}>
                <TextField
                    autoFocus
                    value={formik.values.url}
                    name='url'
                    label="URL"
                    error={formik.touched.url && Boolean(formik.errors.url)}
                    type="text"
                    fullWidth
                    slotProps={{inputLabel: { shrink: true, }}}
                    disabled={id !== 'nuevo' && !edit}
                    variant="outlined"
                    onChange={formik.handleChange}
                    helperText={formik.touched.url && formik.errors.url}
                />
            </Grid>
        </Grid>
    )
}