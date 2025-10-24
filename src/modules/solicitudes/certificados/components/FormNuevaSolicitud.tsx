'use client';
import React from 'react'
import { MySelect, MySwitch } from '@/components/MUI'
import { useMask } from '@react-input/mask'
import { useFormik } from 'formik'
import { Box, Button, InputAdornment, TextField, Paper, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2';
import { Isolicitud } from '@/modules/solicitudes/interfaces/solicitud.interface'
import { NIVEL } from '@/lib/constants'
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import dayjs, { Dayjs } from 'dayjs'
import {validationSchema, initialValues} from '../schemas/form.schema';
import BackButton from '@/components/BackButton';
import 'dayjs/locale/es';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';   
import SelectSubjects from '@/components/SelectSubjects';
import SelectDocuments from '@/components/SelectDocuments';
import SelectFaculty from '@/components/SelectFaculty';
import DateInput from '@/components/MyDatePicker';
import EstudiantesService from '@/modules/estudiantes/services/estudiantes.service';
import SelectEscuela from '@/components/select-escuela';

type Props = {
    onSubmit(values:Isolicitud) : void
    ubicacion?: boolean
}

export default function FormNuevaSolicitud({onSubmit}:Props) 
{
    const [fechaCreacion, setFechaCreacion] = React.useState(false)
    const [facultad, setFacultad] = React.useState<number | undefined>(undefined)
    const [loading, setLoading] = React.useState(false)

    const apellidoRef = useMask({ mask: '________________________________________', replacement: { _: /^[a-zA-Z \u00C0-\u00FF]*$/ } })
    const nombreRef = useMask({ mask: '________________________________________', replacement: { _: /^[a-zA-Z \u00C0-\u00FF]*$/ } })
    const celularRef = useMask({ mask: '___-___-___', replacement: { _: /\d/ } });
    const codigoRef = useMask({ mask: '__________', replacement: { _: /^[a-zA-Z0-9_]*$/ } });
    const dniRef = useMask({ mask: '________', replacement: { _: /\d/ } });
    const voucherRef = useMask({ mask: '_______________', replacement: { _: /\d/ } });
    const pagoRef = useMask({ mask: '_____', replacement: { _: /^[0-9.]*$/ } });

    const formik = useFormik<Isolicitud>({
        initialValues,
        validationSchema,
        onSubmit: async(values, {resetForm}) => {
            onSubmit(values)
            resetForm()
        }
    })

    const handleSearch = async () => {
        const dni = formik.values.dni
        setLoading(true)
            try {
                const response = await EstudiantesService.fetchItemByDNI(String(dni))
                if(response) {
                    const student = response
                    formik.setFieldValue('celular', student.celular)
                    formik.setFieldValue('apellidos', student.apellidos)
                    formik.setFieldValue('nombres', student.nombres)
                    formik.setFieldValue('estudianteId', student.id)
                    formik.setFieldValue('facultad', student.facultadId?.toString() || '')
                    formik.setFieldValue('escuela', student.escuelaId?.toString() || '')
                    formik.setFieldValue('codigo', student.codigo || '')
                }
            } catch (error) {
                console.log(error)
            }
        setLoading(false)
    }

    const handleFacultyChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        formik.handleChange(e)
        setFacultad(+e.target.value)
    }

    const handleDocumentChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        formik.handleChange(e)
        const documentType = +e.target.value
        
        let amout = '0'
        switch (documentType) {
            case 1:
                amout = '50'; break;
            case 2:
                amout = '30'; formik.setFieldValue('digital', true); break;
            case 3:
                amout = '50'; break;
            case 4:
                amout = '30'; formik.setFieldValue('digital', true); break;
            case 5:
                amout = '20'; formik.setFieldValue('digital', true); break;
            case 6:
                amout = '20'; formik.setFieldValue('digital', true); break;
            default:
                amout = '30'; break;
        }     
        formik.setFieldValue('pago', amout)
    }

    return (
        <Box sx={{p: 1, maxWidth: '1200px', mx: 'auto'}} component='form' onSubmit={formik.handleSubmit}>
            <Grid container spacing={1}>
                {/* Solicitud Information Section */}
                <Grid size={{xs:12}}>
                    <Paper elevation={2} sx={{ p: 3, mb: 3, width: '100%' }}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                            Información de la Solicitud
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={{xs:12, md:4}}>
                                <SelectDocuments 
                                    handleChange={handleDocumentChange}
                                    name='solicitud'
                                    value={formik.values.solicitud as string}
                                    error={formik.touched.solicitud && Boolean(formik.errors.solicitud)}
                                />
                            </Grid>
                            <Grid size={{xs:12, md:4}}>
                                <SelectSubjects 
                                    handleChange={formik.handleChange}
                                    name='idioma'
                                    value={formik.values.idioma as string}
                                    error={formik.touched.idioma && Boolean(formik.errors.idioma)}
                                />
                            </Grid>
                            <Grid size={{xs:12, md:4}}>
                                <MySelect 
                                    data={NIVEL}
                                    error={formik.touched.nivel && Boolean(formik.errors.nivel)}
                                    name='nivel'
                                    label='Nivel'
                                    value={formik.values.nivel as string}
                                    handleChange={formik.handleChange}
                                    helperText={formik.touched.nivel && formik.errors.nivel}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                {/* Basic Information Section */}
                <Grid size={{xs:12}}>
                    <Paper elevation={2} sx={{ p: 3, mb: 3, width: '100%' }}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                            Información Básica
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={{xs:12, md:4}}>
                                <MySelect 
                                    data={[{value:'DNI',label:'DNI'},{value:'CE',label:'CE'},{value:'PASAPORTE',label:'PASAPORTE'}]}
                                    error={formik.touched.tipoDocumento && Boolean(formik.errors.tipoDocumento)}
                                    name='tipoDocumento'
                                    label='Tipo Documento'
                                    value={formik.values.tipoDocumento as string}
                                    handleChange={formik.handleChange}
                                    helperText={formik.touched.tipoDocumento && formik.errors.tipoDocumento}
                                />
                            </Grid>
                            <Grid size={{xs:12, md:4}}>
                                <TextField
                                    inputRef={dniRef}
                                    fullWidth
                                    autoComplete='off'
                                    error={formik.touched.dni && Boolean(formik.errors.dni)}
                                    value={formik.values.dni}
                                    onChange={formik.handleChange}
                                    name="dni"
                                    id="dni"
                                    label="Número Documento"
                                    helperText={formik.touched.dni && formik.errors.dni}
                                />
                            </Grid>
                            <Grid size={{xs:12, md:4}}>
                                <Button 
                                    onClick={handleSearch}
                                    fullWidth
                                    disabled={loading}
                                    sx={{
                                        fontSize: '1.1rem',
                                        py: 1.5,
                                        px: 3,
                                    }} 
                                    type="button" 
                                    variant="contained" 
                                    color="primary" 
                                    endIcon={<SearchIcon />}
                                >
                                    Buscar
                                </Button>
                            </Grid>
                            
                            <Grid size={{xs:12, md:4}}>
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
                            <Grid size={{xs:12, md:4}}>
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
                                <input type='hidden' value={formik.values.estudianteId} name='estudianteId' />
                            </Grid>
                            <Grid size={{xs:12, md:4}}>
                                <TextField
                                    inputRef={celularRef}
                                    fullWidth
                                    autoComplete='off'
                                    error={formik.touched.celular && Boolean(formik.errors.celular)}
                                    value={formik.values.celular}
                                    onChange={formik.handleChange}
                                    name="celular"
                                    id="celular"
                                    label="Celular"
                                    helperText={formik.touched.celular && formik.errors.celular}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* UNAC Student Information Section */}
                <Grid size={{xs:12}}>
                    <Paper elevation={2} sx={{ p: 3, mb: 3, width: '100%' }}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                            Información de Estudiante UNAC
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={{xs:12, md:6}}>
                                <SelectFaculty 
                                    handleChange={handleFacultyChange}
                                    value={formik.values.facultad as string}
                                    error={formik.touched.facultad && Boolean(formik.errors.facultad)}
                                />
                            </Grid>
                            <Grid size={{xs:12, md:6}}>
                                <SelectEscuela
                                    handleChange={formik.handleChange}
                                    value={formik.values.escuela as string}
                                    error={formik.touched.escuela && Boolean(formik.errors.escuela)}
                                    facultad={facultad}
                                />
                            </Grid>
                            <Grid size={{xs:12, md:6}}>
                                <TextField
                                    fullWidth
                                    value={formik.values.codigo}
                                    error={formik.touched.codigo && Boolean(formik.errors.codigo)}
                                    autoComplete='off'
                                    disabled={formik.values.facultad === 'PAR'}
                                    inputRef={codigoRef}
                                    onChange={formik.handleChange}
                                    name="codigo"
                                    label="Código de Alumno"
                                    helperText={formik.touched.codigo && formik.errors.codigo}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Payment Information Section */}
                <Grid size={{xs:12}}>
                    <Paper elevation={2} sx={{ p: 3, mb: 3, width: '100%' }}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                            Información de Pago
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={{xs:12, md:4}}>
                                <TextField
                                    fullWidth
                                    inputRef={voucherRef}
                                    error={formik.touched.numero_voucher && Boolean(formik.errors.numero_voucher)}
                                    value={formik.values.numero_voucher}
                                    autoComplete='off'
                                    onChange={formik.handleChange}
                                    name="numero_voucher"
                                    label="Número de voucher"
                                    helperText={formik.touched.numero_voucher && formik.errors.numero_voucher}
                                />
                            </Grid>
                            <Grid size={{xs:12, md:4}}>
                                <TextField
                                    fullWidth
                                    autoComplete='off'
                                    inputRef={pagoRef}
                                    label='Monto pagado'
                                    error={formik.touched.pago && Boolean(formik.errors.pago)}
                                    value={formik.values.pago}
                                    slotProps={{
                                        input:{
                                            startAdornment: <InputAdornment position="start">S/</InputAdornment>,
                                        }
                                    }}
                                    onChange={formik.handleChange}
                                    name="pago"
                                    helperText={formik.touched.pago && formik.errors.pago}
                                />
                            </Grid>
                            <Grid size={{xs:12, md:4}}>
                                <DateInput 
                                    label='Fecha de Pago'
                                    value={formik.values.fecha_pago as Dayjs | null}
                                    name='fecha_pago'
                                    edit={true}
                                    formik={formik}
                                    error={formik.touched.fecha_pago && Boolean(formik.errors.fecha_pago)}
                                    helperText={(formik.touched.fecha_pago && formik.errors.fecha_pago) as string}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                {/* Extra Information Section */}
                <Grid size={{xs:12}}>
                    <Paper elevation={2} sx={{ p: 3, mb: 3, width: '100%' }}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                            Información Adicional
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={{xs:12, md:6}}>
                                <MySwitch
                                    label='Ingresar Fecha de solicitud'
                                    checked={fechaCreacion}
                                    name='fecha_creacion'
                                    handleChange={()=> setFechaCreacion(!fechaCreacion)}
                                />
                            </Grid>
                            <Grid size={{xs:12, md:6}}>
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es'>
                                    <DatePicker 
                                        label="Fecha de Ingreso"
                                        disabled={!fechaCreacion}
                                        value={formik.values.creado} 
                                        onChange={(date)=>formik.setFieldValue('creado',date)} 
                                        maxDate={dayjs(new Date())}
                                        slotProps={{
                                            textField:{
                                                fullWidth:true,
                                                error: Boolean(formik.touched.creado) && Boolean(formik.errors.creado)
                                            }
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            <Box display='flex' m={2} justifyContent='flex-end'>
                <BackButton sx={{ fontSize: '1.1rem', py: 1, px: 2 }} />
                <Button 
                    sx={{
                        ml: 2,
                        fontSize: '1.1rem',
                        py: 1,
                        px: 3
                    }} 
                    type="submit" 
                    variant="contained" 
                    color="success" 
                    endIcon={<SaveIcon />}
                >
                    Enviar
                </Button>
            </Box>
        </Box>
    )
}
