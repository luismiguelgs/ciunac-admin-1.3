'use client'
import Grid from '@mui/material/Grid2';
import { Button, FormControlLabel,  InputAdornment, TextField, Checkbox } from '@mui/material'
import pdfLogo from '@/assets/pdf.png'
import dayjs from 'dayjs'
import  Link  from '@mui/material/Link'
import { useFormik } from 'formik'
import React from 'react'
import EditNoteIcon from '@mui/icons-material/EditNote';
import SaveIcon from '@mui/icons-material/Save';
import noImage from '@/assets/no_disponible.png'
import {validationSchemaFinance} from '../schemas/validation.schema'
import { ISolicitudRes } from '@/modules/solicitudes/interfaces/solicitudres.interface'
import { MySelect } from '@/components/MUI';
import { ESTADO, NIVEL } from '@/lib/constants';
import SelectSubjects from '@/components/SelectSubjects';
import Image from 'next/image';
import MyDatePicker from '@/components/MyDatePicker';
import SelectDocuments from '@/components/SelectDocuments';

type Props = {
    item: ISolicitudRes,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    saveItem:(values:any) => void
}

export default function FinanceInfo({item, saveItem}:Props) 
{
    let voucher = null

    if(item.imgVoucher){
        voucher = item.imgVoucher
    }else{
        voucher = item.imgVoucher
    }
    
    const [edit, setEdit] = React.useState<boolean>(false)
    const isPdf = voucher?.split('?')[0].slice(-3) === 'pdf'
    const hasImage = Boolean(voucher)

    const formik = useFormik<Partial<ISolicitudRes>>({
        initialValues:{
            tipoSolicitudId: item.tipoSolicitudId,
            estadoId: item.estadoId,
            idiomaId: item.idiomaId,
            nivelId: item.nivelId,
            numeroVoucher: item.numeroVoucher,
            pago: item.pago,
            fechaPago: item.fechaPago //dayjs(new Date(item.fechaPago)),
        },
        validationSchema: validationSchemaFinance,
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
                    <SelectDocuments
                        handleChange={formik.handleChange}
                        value={formik.values.tipoSolicitudId as unknown as string}
                        error={formik.touched.tipoSolicitudId && Boolean(formik.errors.tipoSolicitudId)}
                        helperText={formik.touched.tipoSolicitudId && formik.errors.tipoSolicitudId}
                        disabled={!edit}
                    />
                </Grid>
                {/**Estado */}
                <Grid size={{xs:12, sm:6}}>
                    <MySelect 
                        disabled={!edit} 
                        data={ESTADO} 
                        name="estadoId" 
                        error={formik.touched.estadoId && Boolean(formik.errors.estadoId)}
                        label="Estado" 
                        value={formik.values.estadoId as unknown as string} 
                        handleChange={formik.handleChange}
                        helperText={formik.touched.estadoId && formik.errors.estadoId}
                    />
                </Grid>
                {/**Idioma */}
                <Grid size={{xs:12, sm:6}}>
                    <SelectSubjects
                        handleChange={formik.handleChange}
                        value={formik.values.idiomaId as unknown as string}
                        error={formik.touched.idiomaId && Boolean(formik.errors.idiomaId)}
                        helperText={formik.touched.idiomaId && formik.errors.idiomaId}
                        disabled={!edit}
                    />
                </Grid>
                {/**Nivel */}
                <Grid size={{xs:12, sm:6}}>
                    <MySelect 
                        data={NIVEL}
                        disabled={!edit} 
                        error={formik.touched.nivelId && Boolean(formik.errors.nivelId)}
                        name='nivelId'
                        label='Nivel'
                        value={formik.values.nivelId as unknown as string}
                        handleChange={formik.handleChange}
                        helperText={formik.touched.nivelId && formik.errors.nivelId}
                    />
                </Grid>
                {/**Número Voucher */}
                <Grid size={{xs:12, sm:6}}>
                    <TextField
                        required
                        disabled={!edit}
                        fullWidth
                        error={formik.touched.numeroVoucher && Boolean(formik.errors.numeroVoucher)}
                        value={formik.values.numeroVoucher}
                        onChange={formik.handleChange}
                        name="numeroVoucher"
                        label="Número de voucher"
                        slotProps={{inputLabel: {shrink: true,}}}
                        helperText={formik.touched.numeroVoucher && formik.errors.numeroVoucher}
                    />
                </Grid>
                <Grid size={{xs:12, sm:6}}>
                    <TextField
                        type='number'
                        fullWidth
                        required
                        disabled={!edit}
                        error={formik.touched.pago && Boolean(formik.errors.pago)}
                        label='Monto pagado (S/.)'
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
                    <MyDatePicker
                        label='Fecha de Pago'
                        name='fechaPago'
                        edit={edit}
                        formik={formik}
                        value={formik.values.fechaPago ? dayjs(formik.values.fechaPago) : undefined}
                        error={Boolean(formik.touched.fechaPago) && Boolean(formik.errors.fechaPago)}
                        helperText={(formik.touched.fechaPago && formik.errors.fechaPago) as React.ReactNode}
                    />  
                </Grid>
                <Grid size={{xs:12, sm:6}}>
                    <TextField
                        disabled
                        fullWidth
                        value={item.periodo}
                        name="periodo"
                        label="Periodo"
                        slotProps={{inputLabel: {shrink: true,}}}
                    />
                </Grid>
                
                <Grid size={{xs:12, sm:6}}>
                    <MyDatePicker
                        label="Fecha de creación"
                        name="creado"
                        ampm={true}
                        value={dayjs(new Date(item.creadoEn))}
                    />
                </Grid>
                <Grid size={{xs:12, sm:6}}>
                    <MyDatePicker
                        label="Fecha de última edición"
                        name="modificado"
                        ampm={true}
                        value={dayjs(new Date(item.modificadoEn))}
                    />
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
                    <Grid size={{xs:12}} sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    { 
                        isPdf ? 
                            (<Image src={pdfLogo.src} style={{width:'100%', height:'100%', objectFit: 'contain'}} alt='pdf' width={1000} height={1000} priority/>) :
                            hasImage ?
                                (<Image src={voucher as string} style={{width:'100%', height:'100%', objectFit: 'contain'}} alt='voucher' width={1000} height={1000} priority/>) : 
                                (<Image src={noImage.src} style={{width:'100%', height:'100%', objectFit: 'contain'}} alt='no image' width={1000} height={1000} priority/>)
                    }
                    </Grid>
                    <Grid size={{xs:12}} sx={{display:'flex', justifyContent:'center', alignItems:'center', mt: -2}}>
                    {   Boolean(voucher) ?
                            (<Link href={voucher} underline='always' target='_blank' rel="noopener" sx={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%'}}>VER VOUCHER</Link>) 
                        :null
                    }
                    </Grid>
                </Grid>
            </Grid>
    )
}
