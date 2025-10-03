'use client'
import Grid from '@mui/material/Grid2';
import { Button, FormControlLabel,  InputAdornment, TextField, Checkbox } from '@mui/material'
import pdfLogo from '@/assets/pdf.png'
import { DatePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import  Link  from '@mui/material/Link'
import { useFormik } from 'formik'
import React from 'react'
import EditNoteIcon from '@mui/icons-material/EditNote';
import SaveIcon from '@mui/icons-material/Save';
import noImage from '@/assets/no_disponible.png'
import validationSchema from './validation.schema'
import { Isolicitud } from '@/modules/solicitudes/interfaces/solicitud.interface'
import useStore from '@/hooks/useStore';
import { useDocumentsStore,  useSubjectsStore } from '@/modules/opciones/store/types.stores';
import { MySelect } from '@/components/MUI';
import { ESTADO, NIVEL } from '@/lib/constants';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/es';

type Props = {
  item: Isolicitud,
  saveItem(values:Isolicitud) : void
}

export default function FinanceInfo({item, saveItem}:Props) 
{
    const documents = useStore(useDocumentsStore, (state) => state.documents)
    const subjects = useStore(useSubjectsStore, (state) => state.subjects)
    const [edit, setEdit] = React.useState<boolean>(false)
    const isPdf = item.img_voucher?.split('?')[0].slice(-3) === 'pdf'
    const hasImage = Boolean(item.img_voucher)

    if (item.creado && item.creado.seconds) {
        item.creado = dayjs(new Date(item.creado.seconds * 1000 + (item.creado.nanoseconds || 0) / 1e6))
    }
    if (item.modificado && item.modificado.seconds) {
        item.modificado = dayjs(new Date(item.modificado.seconds * 1000 + (item.modificado.nanoseconds || 0) / 1e6))
    }
    
    const formik = useFormik<Isolicitud>({
        initialValues:{
            periodo: item.periodo,
            solicitud : item.solicitud,
            estado: item.estado,
            idioma: item.idioma,
            nivel: item.nivel,
            numero_voucher: item.numero_voucher,
            pago: item.pago,
            fecha_pago: dayjs(new Date(item.fecha_pago)),
            trabajador: item.trabajador,
        },
        validationSchema: validationSchema,
        onSubmit: (values)=>{
            saveItem(values)
            setEdit(false)
        }
    })

    //funciones
    const handleClickEdit = () =>{
        setEdit(true)
    }

    return (
        <Grid container spacing={2} p={1}>
            <Grid container spacing={2} size={{xs:12, md:8}} component='form' onSubmit={formik.handleSubmit}>
                {/**Tipo de Solicitud */}
                <Grid size={{xs:12, sm:6}}>
                    { documents && <MySelect 
                        name='solicitud'
                        disabled
                        label='Tipo de Solicitud'
                        handleChange={formik.handleChange}
                        value={formik.values.solicitud as string}
                        data={documents}
                    />}
                </Grid>
                {/**Estado */}
                <Grid size={{xs:12, sm:6}}>
                    <MySelect 
                        disabled={!edit} 
                        data={ESTADO} 
                        name="estado" 
                        error={formik.touched.estado && Boolean(formik.errors.estado)}
                        label="Estado" 
                        value={formik.values.estado as string} 
                        handleChange={formik.handleChange}
                        helperText={formik.touched.estado && formik.errors.estado}
                    />
                </Grid>
                {/**Idioma */}
                <Grid size={{xs:12, sm:6}}>
                    {subjects && <MySelect 
                        data={subjects}
                        disabled={!edit} 
                        error={formik.touched.idioma && Boolean(formik.errors.idioma)}
                        name='idioma'
                        label='Idioma'
                        value={formik.values.idioma as string}
                        handleChange={formik.handleChange}
                        helperText={formik.touched.idioma && formik.errors.idioma}
                    />}
                </Grid>
                {/**Nivel */}
                <Grid size={{xs:12, sm:6}}>
                    <MySelect 
                        data={NIVEL}
                        disabled={!edit} 
                        error={formik.touched.nivel && Boolean(formik.errors.nivel)}
                        name='nivel'
                        label='Nivel'
                        value={formik.values.nivel as string}
                        handleChange={formik.handleChange}
                        helperText={formik.touched.nivel && formik.errors.nivel}
                    />
                </Grid>
                {/**Número Voucher */}
                <Grid size={{xs:12, sm:6}}>
                    <TextField
                        required
                        disabled={!edit}
                        fullWidth
                        error={formik.touched.numero_voucher && Boolean(formik.errors.numero_voucher)}
                        value={formik.values.numero_voucher}
                        onChange={formik.handleChange}
                        name="numero_voucher"
                        label="Número de voucher"
                        slotProps={{inputLabel: {shrink: true,}}}
                        helperText={formik.touched.numero_voucher && formik.errors.numero_voucher}
                    />
                </Grid>
                <Grid size={{xs:12, sm:6}}>
                    <TextField
                        type='number'
                        fullWidth
                        required
                        disabled={!edit}
                        error={formik.touched.pago && Boolean(formik.errors.pago)}
                        label='Monto pagado'
                        value={formik.values.pago}
                        slotProps={{
                            input:{startAdornment: <InputAdornment position="start">S/</InputAdornment>,},
                        }}
                        onChange={formik.handleChange}
                        name="pago"
                        helperText={formik.touched.pago && formik.errors.pago}
                    />
                </Grid>
                <Grid size={{xs:12, sm:6}}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es'>
                        <DatePicker 
                            label="Fecha de Pago"
                            disabled={!edit}
                            value={formik.values.fecha_pago} 
                            onChange={(date)=>formik.setFieldValue('fecha_pago',date)} 
                            maxDate={dayjs(new Date())}
                            slotProps={{
                                textField:{
                                    fullWidth:true,
                                    error: Boolean(formik.touched.fecha_pago) && Boolean(formik.errors.fecha_pago),
                                    helperText: (formik.touched.fecha_pago && formik.errors.fecha_pago) as React.ReactNode
                                }
                            }}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid size={{xs:12, sm:6}}>
                    <TextField
                        disabled
                        fullWidth
                        value={formik.values.periodo}
                        onChange={formik.handleChange}
                        name="periodo"
                        label="Periodo"
                        slotProps={{inputLabel: {shrink: true,}}}
                        helperText={formik.touched.periodo && formik.errors.periodo}
                    />
                </Grid>
                <Grid size={{xs:12, sm:6}}>
                    <FormControlLabel disabled={!edit} control={<Checkbox checked={item.trabajador} />} label="Trabajador" />
                </Grid>
                <Grid size={{xs:12, sm:6}}>
                {   Boolean(item.img_voucher) ?
                        (<Link href={item?.img_voucher} underline='always' target='_blank' rel="noopener">VER VOUCHER</Link>) 
                    :null
                }
                </Grid>
                <Grid size={{xs:12, sm:6}}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es'>
                        <DateTimePicker 
                            label="Fecha de creación"
                            disabled
                            value={dayjs(new Date(item.creado))}
                            ampm
                            slotProps={{
                                textField:{
                                    fullWidth:true,
                                    variant: 'standard'
                                }
                            }}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid size={{xs:12, sm:6}}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es'>
                        <DateTimePicker
                            label="Fecha de última edición"
                            ampm
                            disabled
                            value={dayjs(new Date(item.modificado))}
                            slotProps={{
                                textField:{
                                    fullWidth:true,
                                    variant:'standard'
                                }
                            }}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid size={{xs:12, sm:6}}>
                    <Button
                        variant="contained" 
                        color="primary" 
                        sx={{ml:0, mr:2}} 
                        fullWidth
                        onClick={handleClickEdit} 
                        endIcon={<EditNoteIcon />}
                        disabled={edit}>
                        Editar
                    </Button>
                </Grid>
                <Grid size={{xs:12, sm:6}}>
                    <Button 
                        variant="contained" 
                        color="success" 
                        type='submit'
                        fullWidth
                        sx={{ml:0, mr:2}} 
                        endIcon={<SaveIcon />}
                        disabled={!edit}>
                        Guardar
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={1} size={{xs:12, md:4}}>
                    {/*Imagen*/}
                    <Grid size={{xs:12}} display='flex' alignContent='center' alignItems='center'>
                    { 
                        isPdf ? 
                            (<img src={pdfLogo.src} style={{maxHeight:'440px', width:'100%'}}/>):
                            hasImage ?
                                (<img src={item?.img_voucher} style={{maxHeight:'440px', margin:'0 auto'}}/>) : 
                                (<img src={noImage.src} style={{ maxHeight:'440px', margin:'0 auto'}}/>)
                    }
                    </Grid>
                </Grid>
            </Grid>
    )
}
