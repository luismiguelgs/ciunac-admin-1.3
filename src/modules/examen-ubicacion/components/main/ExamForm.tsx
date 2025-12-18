'use client'
import { IExamenUbicacion } from '@/modules/examen-ubicacion/interfaces/examen-ubicacion.interface'
import { IProfesor } from '@/modules/examen-ubicacion/interfaces/profesores.interface'
import { ISalon } from '@/modules/opciones/interfaces/types.interface'
import { useFormik } from 'formik'
import React from 'react'
import validationSchema from './validation.schema'
import 'dayjs/locale/es';
import Grid from '@mui/material/Grid2';
import { MySelect } from '@/components/MUI'
import { ESTADO_EXAMEN } from '@/lib/constants'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import BackButton from '@/components/BackButton'
import EditNoteIcon from '@mui/icons-material/EditNote';
import SaveIcon from '@mui/icons-material/Save';
import PreviewIcon from '@mui/icons-material/Preview';
import SelectSubjects from '@/components/SelectSubjects'
import { obtenerPeriodo } from '@/lib/utils'
import dayjs from 'dayjs'

type Props = {
    ID: string | number | undefined,
    data?: IExamenUbicacion | undefined,
    handleClickActa: () => void,
    salones: ISalon[],
    profesores: IProfesor[],
    handleClickSave: (value: IExamenUbicacion) => void
}


export default function ExamForm({ ID, handleClickActa, salones, profesores, handleClickSave, data }: Props) {
    //HOOKS *************************************************
    //const subjects = useStore(useSubjectsStore, (state) => state.subjects)
    const [editar, setEditar] = React.useState<boolean>(false)

    const formik = useFormik<IExamenUbicacion>({
        initialValues: {
            estadoId: data?.estadoId ?? 6,
            fecha: data?.fecha ? dayjs(new Date(data.fecha as Date)) : dayjs(new Date()),
            aulaId: data?.aulaId || 1,
            docenteId: data?.docenteId || '',
            idiomaId: data?.idiomaId || 1,
            codigo: data?.codigo || '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { fecha, ...rest } = values
            const examenData = {
                ...rest,
                fecha: fecha ? new Date(fecha as Date) : null,
            } as IExamenUbicacion;
            handleClickSave(examenData)
        }
    })

    // useEffect to update codigo when idioma or nivel changes
    React.useEffect(() => {
        if (formik.values.idiomaId && formik.values.aulaId) {
            formik.setFieldValue('codigo', `${obtenerPeriodo()}-${formik.values.idiomaId}-${formik.values.aulaId}`);
        }
    }, [formik.values.idiomaId, formik.values.aulaId]);

    return (
        <Grid container spacing={2} p={3} component='form' onSubmit={formik.handleSubmit}>
            <Grid size={{ xs: 12, md: 4 }} >
                <MySelect
                    data={ESTADO_EXAMEN}
                    handleChange={formik.handleChange}
                    error={formik.touched.estado && Boolean(formik.errors.estado)}
                    label='Extado'
                    name='estado'
                    disabled={!editar}
                    value={Number(formik.values.estadoId)}
                    helperText={formik.touched.estado && formik.errors.estado}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} >
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es'>
                    <DatePicker
                        label="Fecha de Examen"
                        name='fecha'
                        disabled={ID !== 'nuevo' && !editar}
                        value={dayjs(formik.values.fecha as Date)}
                        onChange={(date) => formik.setFieldValue('fecha', date)}
                        minDate={dayjs(new Date())}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                error: Boolean(formik.touched.fecha) && Boolean(formik.errors.fecha),
                                helperText: (formik.touched.fecha && formik.errors.fecha) as string
                            }
                        }}
                    />
                </LocalizationProvider>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} >
                <MySelect
                    data={salones}
                    handleChange={formik.handleChange}
                    error={formik.touched.aulaId && Boolean(formik.errors.aulaId)}
                    label='Salón'
                    name='aulaId'
                    disabled={ID !== 'nuevo' && !editar}
                    value={formik.values.aulaId}
                    helperText={formik.touched.aulaId && formik.errors.aulaId}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} >
                <FormControl
                    sx={{ minWidth: 120, width: '100%' }}
                    disabled={ID !== 'nuevo' && !editar}
                    error={formik.touched.docenteId && Boolean(formik.errors.docenteId)}>
                    <InputLabel>Profesor</InputLabel>
                    <Select
                        name='docenteId'
                        onChange={formik.handleChange}
                        value={formik.values.docenteId}
                        label='Profesor'>
                        {
                            profesores.map((item, index) => (
                                <MenuItem key={index} value={item.id}>
                                    {`${item.nombres} ${item.apellidos}`}
                                </MenuItem>
                            ))
                        }
                    </Select>
                    <FormHelperText>{(formik.touched.docenteId && formik.errors.docenteId) as string}</FormHelperText>
                </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} >
                <SelectSubjects
                    handleChange={formik.handleChange}
                    error={formik.touched.idiomaId && Boolean(formik.errors.idiomaId)}
                    value={formik.values.idiomaId}
                    disabled={ID !== 'nuevo'}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} >
                <TextField
                    autoFocus
                    value={formik.values.codigo}
                    name='codigo'
                    disabled
                    label="Código"
                    error={formik.touched.codigo && Boolean(formik.errors.codigo)}
                    type="text"
                    fullWidth
                    variant="outlined"
                    onChange={formik.handleChange}
                    helperText={formik.touched.codigo && formik.errors.codigo}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }} display='flex' alignItems='center' justifyContent='center' alignContent='center'>
                <BackButton fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }} display='flex' alignItems='center' justifyContent='center' alignContent='center'>
                <Button
                    fullWidth
                    disabled={ID === 'nuevo' || editar}
                    onClick={() => { setEditar(true) }}
                    variant="contained"
                    color="primary"
                    startIcon={<EditNoteIcon />}>
                    Editar
                </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }} display='flex' alignItems='center' justifyContent='center' alignContent='center'>
                <Button
                    fullWidth
                    type='submit'
                    variant="contained"
                    color="success"
                    disabled={ID !== 'nuevo' && !editar}
                    startIcon={<SaveIcon />}>
                    Guardar
                </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }} display='flex' alignItems='center' justifyContent='center' alignContent='center'>
                <Button
                    fullWidth
                    onClick={handleClickActa}
                    variant="contained"
                    color="error"
                    disabled={ID === 'nuevo'}
                    startIcon={<PreviewIcon />}>
                    Ver Acta
                </Button>
            </Grid>
        </Grid>
    )
}
