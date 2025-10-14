'use client'
import React from 'react'
import Grid from '@mui/material/Grid2'
import { FormikProps } from 'formik'
import { ICertificado } from '@/modules/certificados/interfaces/certificado.interface'
import { TextField } from '@mui/material'
import { MySelect, MySwitch } from '@/components/MUI'
import { NIVEL } from '@/lib/constants'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import SelectSubjects from '@/components/SelectSubjects'

type Props = {
    formik: FormikProps<ICertificado>,
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
                    value={formik.values.estudiante}
                    name='estudiante'
                    label="Estudiante"
                    error={formik.touched.estudiante && Boolean(formik.errors.estudiante)}
                    type="text"
                    fullWidth
                    disabled={id !== 'nuevo' && !edit}
                    slotProps={{inputLabel: { shrink: true, }}}
                    variant="outlined"
                    onChange={formik.handleChange}
                    helperText={formik.touched.estudiante && formik.errors.estudiante}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 6}}>
                <TextField
                    autoFocus
                    value={formik.values.solicitudId}
                    name='solicitudId'
                    label="ID Solicitud"
                    error={formik.touched.solicitudId && Boolean(formik.errors.solicitudId)}
                    type="text"
                    fullWidth
                    disabled={id !== 'nuevo' && !edit}
                    slotProps={{inputLabel: { shrink: true, }}}
                    variant="outlined"
                    onChange={formik.handleChange}
                    helperText={formik.touched.solicitudId && formik.errors.solicitudId}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 3}}>
            <TextField
                    autoFocus
                    value={formik.values.numeroDocumento}
                    name='numeroDocumento'
                    disabled={id !== 'nuevo' && !edit}
                    label="Documento de Identidad"
                    error={formik.touched.numeroDocumento && Boolean(formik.errors.numeroDocumento)}
                    type="text"
                    fullWidth
                    slotProps={{inputLabel: { shrink: true, }}}
                    variant="outlined"
                    onChange={formik.handleChange}
                    helperText={formik.touched.numeroDocumento && formik.errors.numeroDocumento}
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
                    value={formik.values.cantidadHoras}
                    name='cantidadHoras'
                    disabled={id !== 'nuevo'}
                    label="Cantidad de Horas"
                    error={formik.touched.cantidadHoras && Boolean(formik.errors.cantidadHoras)}
                    type="number"
                    fullWidth
                    variant="outlined"
                    onChange={formik.handleChange}
                    helperText={formik.touched.cantidadHoras && formik.errors.cantidadHoras}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 3}}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es'>
                    <DatePicker 
                        label="Fecha Emisión"
                        value={dayjs(formik.values.fechaEmision)} 
                        onChange={(date)=>formik.setFieldValue('fechaEmision',date)} 
                        maxDate={dayjs(new Date())}
                        disabled={id !== 'nuevo' && !edit}
                        slotProps={{
                            textField:{
                                fullWidth:true,
                                error: Boolean(formik.touched.fechaEmision) && Boolean(formik.errors.fechaEmision),
                                helperText: (formik.touched.fechaEmision && formik.errors.fechaEmision) as string
                            }
                        }}
                    />
                </LocalizationProvider>
            </Grid>
            <Grid size={{xs: 12, sm: 3}}>
                <TextField
                    autoFocus
                    value={formik.values.numeroRegistro}
                    name='numeroRegistro'
                    label="Número de Registro"
                    disabled={id !== 'nuevo' && !edit}
                    error={formik.touched.numeroRegistro && Boolean(formik.errors.numeroRegistro)}
                    type="text"
                    fullWidth
                    variant="outlined"
                    onChange={formik.handleChange}
                    helperText={formik.touched.numeroRegistro && formik.errors.numeroRegistro}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 3}}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es'>
                    <DatePicker 
                        label="Fecha Concluido"
                        value={dayjs(formik.values.fechaConcluido)} 
                        onChange={(date)=>formik.setFieldValue('fechaConcluido',dayjs(date))} 
                        disabled={id !== 'nuevo' && !edit}
                        maxDate={dayjs(new Date())}
                        slotProps={{
                            textField:{
                                fullWidth:true,
                                error: Boolean(formik.touched.fechaConcluido) && Boolean(formik.errors.fechaConcluido),
                                helperText: (formik.touched.fechaConcluido && formik.errors.fechaConcluido) as string
                            }
                        }}
                    />
                </LocalizationProvider>
            </Grid>
            <Grid size={{xs: 12, sm: 3}}>
            <MySelect 
                    data={[{label:'Físico', value:'FISICO'},{label:'Digital', value:'VIRTUAL'}]}
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
                    name='curriculaAnterior'
                    disabled={id !== 'nuevo' && !edit}
                    checked={formik.values.curriculaAnterior as boolean}
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
                    name='aceptado'
                    disabled={true}
                    checked={formik.values.aceptado as boolean}
                    handleChange={formik.handleChange}
                    sx={{mt:1}}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 3}}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es'>
                    <DatePicker 
                        label="Fecha Aceptación"
                        value={dayjs(formik.values.fechaAceptacion)} 
                        onChange={(date)=>formik.setFieldValue('fechaAceptacion',dayjs(date))} 
                        disabled={id !== 'nuevo' && !edit}
                        maxDate={dayjs(new Date())}
                        slotProps={{
                            textField:{
                                fullWidth:true,
                                error: Boolean(formik.touched.fechaAceptacion) && Boolean(formik.errors.fechaAceptacion),
                                helperText: (formik.touched.fechaAceptacion && formik.errors.fechaAceptacion) as string
                            }
                        }}
                    />
                </LocalizationProvider>
            </Grid>
            <Grid size={{xs: 12, sm: 3}}>
                <TextField
                    autoFocus
                    disabled={!formik.values.duplicado as boolean}
                    value={formik.values.certificadoOriginal}
                    name='certificadoOriginal'
                    label="Certificado Original"
                    error={formik.touched.certificadoOriginal && Boolean(formik.errors.certificadoOriginal)}
                    type="text"
                    fullWidth
                    variant="outlined"
                    onChange={formik.handleChange}
                    helperText={formik.touched.certificadoOriginal && formik.errors.certificadoOriginal}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 3}}>
                <TextField
                    autoFocus
                    disabled
                    value={formik.values.elaboradoPor}
                    name='elaboradoPor'
                    slotProps={{inputLabel: { shrink: true, }}}
                    label="Elaborado por"
                    error={formik.touched.elaboradoPor && Boolean(formik.errors.elaboradoPor)}
                    type="text"
                    fullWidth
                    variant="outlined"
                    onChange={formik.handleChange}
                    helperText={formik.touched.elaboradoPor && formik.errors.elaboradoPor}
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