'use client'
import Grid from '@mui/material/Grid2';
import { Button, InputAdornment, TextField } from '@mui/material'
import pdfLogo from '@/assets/pdf.png'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import Link from '@mui/material/Link'
import { useFormik } from 'formik'
import React from 'react'
import EditNoteIcon from '@mui/icons-material/EditNote';
import SaveIcon from '@mui/icons-material/Save';
import noImage from '@/assets/no_disponible.png'
import validationSchema from '../schemas/validation.schema'
//import useStore from '@/hooks/useStore';
//import { useDocumentsStore,  useSubjectsStore } from '@/modules/opciones/store/types.stores';
import { MySelect } from '@/components/MUI';
import { ESTADO, NIVEL } from '@/lib/constants';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/es';
import { ISolicitudRes } from '../../interfaces/solicitudres.interface';
import SelectDocuments from '@/components/SelectDocuments';
import SelectSubjects from '@/components/SelectSubjects';
import MyDatePicker from '@/components/MyDatePicker';

type Props = {
    item: ISolicitudRes,
    saveItem(values: Partial<ISolicitudRes>): void
}

export default function FinanceInfo({ item, saveItem }: Props) {
    //const documents = useStore(useDocumentsStore, (state) => state.documents)
    //const subjects = useStore(useSubjectsStore, (state) => state.subjects)
    const [edit, setEdit] = React.useState<boolean>(false)
    const isPdf = item.imgVoucher?.split('?')[0].slice(-3) === 'pdf'
    const hasImage = Boolean(item.imgVoucher)

    const formik = useFormik<Partial<ISolicitudRes>>({
        initialValues: {
            periodo: item.periodo,
            tipoSolicitudId: 7,//item.tipoSolicitudId,
            estadoId: item.estadoId,
            idiomaId: item.idiomaId,
            nivelId: item.nivelId,
            numeroVoucher: item.numeroVoucher,
            pago: item.pago,
            fechaPago: item.fechaPago,//dayjs(new Date(item.fechaPago)),
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            const payload = {
                ...values,
                estadoId: values.estadoId != null ? Number(values.estadoId as unknown as string) : undefined,
                idiomaId: values.idiomaId != null ? Number(values.idiomaId as unknown as string) : undefined,
                nivelId: values.nivelId != null ? Number(values.nivelId as unknown as string) : undefined,
                tipoSolicitudId: values.tipoSolicitudId != null ? Number(values.tipoSolicitudId as unknown as string) : undefined,
            }
            saveItem(payload as Partial<ISolicitudRes>)
            setEdit(false)
        }
    })

    //funciones
    const handleClickEdit = () => {
        setEdit(true)
    }

    return (
        <Grid container spacing={2} p={1}>
            <Grid container spacing={2} size={{ xs: 12, md: 8 }} component='form' onSubmit={formik.handleSubmit}>
                {/**Tipo de Solicitud */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <SelectDocuments
                        handleChange={formik.handleChange}
                        value={formik.values.tipoSolicitudId != null ? String(formik.values.tipoSolicitudId) : ''}
                        error={formik.touched.tipoSolicitudId && Boolean(formik.errors.tipoSolicitudId)}
                        helperText={formik.touched.tipoSolicitudId && formik.errors.tipoSolicitudId}
                        disabled={true}
                    />
                </Grid>
                {/**Estado */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <MySelect
                        disabled={!edit}
                        data={ESTADO}
                        name="estadoId"
                        error={formik.touched.estadoId && Boolean(formik.errors.estadoId)}
                        label="Estado"
                        value={formik.values.estadoId != null ? String(formik.values.estadoId) : ''}
                        handleChange={formik.handleChange}
                        helperText={formik.touched.estadoId && formik.errors.estadoId}
                        getOptionValue={(option) => option.value}
                        getOptionLabel={(option) => option.label}
                    />
                </Grid>
                {/**Idioma */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <SelectSubjects
                        handleChange={formik.handleChange}
                        value={formik.values.idiomaId != null ? String(formik.values.idiomaId) : ''}
                        error={formik.touched.idiomaId && Boolean(formik.errors.idiomaId)}
                        helperText={formik.touched.idiomaId && formik.errors.idiomaId}
                        disabled={!edit}
                    />
                </Grid>
                {/**Nivel */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <MySelect
                        data={NIVEL}
                        disabled={!edit}
                        error={formik.touched.nivelId && Boolean(formik.errors.nivelId)}
                        name='nivelId'
                        label='Nivel'
                        value={formik.values.nivelId != null ? String(formik.values.nivelId) : ''}
                        handleChange={formik.handleChange}
                        helperText={formik.touched.nivelId && formik.errors.nivelId}
                        getOptionValue={(option) => option.value}
                        getOptionLabel={(option) => option.label}
                    />
                </Grid>
                {/**Número Voucher */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        required
                        disabled={!edit}
                        fullWidth
                        error={formik.touched.numeroVoucher && Boolean(formik.errors.numeroVoucher)}
                        value={formik.values.numeroVoucher ?? ''}
                        onChange={formik.handleChange}
                        name="numeroVoucher"
                        label="Número de voucher"
                        slotProps={{ inputLabel: { shrink: true, } }}
                        helperText={formik.touched.numeroVoucher && formik.errors.numeroVoucher}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        type='number'
                        fullWidth
                        required
                        disabled={!edit}
                        error={formik.touched.pago && Boolean(formik.errors.pago)}
                        label='Monto pagado'
                        value={formik.values.pago ?? ''}
                        slotProps={{
                            input: { startAdornment: <InputAdornment position="start">S/</InputAdornment>, },
                        }}
                        onChange={formik.handleChange}
                        name="pago"
                        helperText={formik.touched.pago && formik.errors.pago}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <MyDatePicker
                        label='Fecha de Pago'
                        name='fechaPago'
                        edit={edit}
                        formik={formik}
                        value={formik.values.fechaPago ? dayjs(formik.values.fechaPago) : null}
                        error={Boolean(formik.touched.fechaPago) && Boolean(formik.errors.fechaPago)}
                        helperText={(formik.touched.fechaPago && formik.errors.fechaPago) as React.ReactNode}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        disabled
                        fullWidth
                        value={formik.values.periodo ?? ''}
                        onChange={formik.handleChange}
                        name="periodo"
                        label="Periodo"
                        slotProps={{ inputLabel: { shrink: true, } }}
                        helperText={formik.touched.periodo && formik.errors.periodo}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    {Boolean(item.imgVoucher) ?
                        (<Link href={item?.imgVoucher} underline='always' target='_blank' rel="noopener">VER VOUCHER</Link>)
                        : null
                    }
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>

                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es'>
                        <DateTimePicker
                            label="Fecha de creación"
                            disabled
                            value={dayjs(new Date(item.creadoEn))}
                            ampm
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    variant: 'standard'
                                }
                            }}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es'>
                        <DateTimePicker
                            label="Fecha de última edición"
                            ampm
                            disabled
                            value={dayjs(new Date(item.modificadoEn))}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    variant: 'standard'
                                }
                            }}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ ml: 0, mr: 2 }}
                        fullWidth
                        onClick={handleClickEdit}
                        endIcon={<EditNoteIcon />}
                        disabled={edit}>
                        Editar
                    </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Button
                        variant="contained"
                        color="success"
                        type='submit'
                        fullWidth
                        sx={{ ml: 0, mr: 2 }}
                        endIcon={<SaveIcon />}
                        disabled={!edit}>
                        Guardar
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={1} size={{ xs: 12, md: 4 }}>
                {/*Imagen*/}
                <Grid
                    size={{ xs: 12 }}
                    display='flex'
                    alignContent='center'
                    alignItems='center'
                    justifyContent='center'
                    sx={{ maxHeight: 440, overflow: 'hidden' }}
                >
                    {
                        isPdf ?
                            (<img src={pdfLogo.src} style={{ width: '100%', height: 'auto', maxHeight: '440px', objectFit: 'contain', display: 'block' }} />) :
                            hasImage ?
                                (<img src={item?.imgVoucher} style={{ width: '100%', height: 'auto', maxHeight: '440px', objectFit: 'contain', display: 'block' }} />) :
                                (<img src={noImage.src} style={{ width: '100%', height: 'auto', maxHeight: '440px', objectFit: 'contain', display: 'block' }} />)
                    }
                </Grid>
            </Grid>
        </Grid>
    )
}
