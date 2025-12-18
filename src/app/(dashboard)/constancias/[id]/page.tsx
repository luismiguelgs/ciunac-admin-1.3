'use client'
import { IConstancia } from '@/modules/constancias/interfaces/constancia.interface'
import type { IConstanciaDetalle } from '@/modules/constancias/interfaces/constancia.interface'
import { ConstanciasService } from '@/modules/constancias/services/constancias.service'
import { useFormik } from 'formik'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { initialValues, validationSchema } from '@/modules/constancias/components/validations.schema'
import { Box, Button, Typography } from '@mui/material'
import ConstanciaForm from '@/modules/constancias/components/ConstanciaForm'
import Grid from '@mui/material/Grid2'
import BackButton from '@/components/BackButton'
import EditIcon from '@mui/icons-material/Edit';
import ButtonSave from '@/components/ButtonSave'
import LoadingDialog from '@/components/MUI/Dialogs/DialogLoading'
import ButtonSeeContancia from '@/modules/constancias/components/ButtonSeeContancia'
import ConstanciaDetail from '@/modules/constancias/components/ConstanciaDetail'
import { useSubjectsStore } from '@/modules/opciones/store/types.stores'
import { NIVEL } from '@/lib/constants'

export default function ConstanciasEditPage() {
    //HOOKS *************************************************
    const idiomas = useSubjectsStore()
    const [loading, setLoading] = React.useState<boolean>(false)
    const [data, setData] = React.useState<IConstancia>()
    const [detalle, setDetalle] = React.useState<IConstanciaDetalle[]>([])
    const navigate = useRouter()
    const pathname = usePathname()
    const id = pathname.split('/').pop()
    const [edit, setEdit] = React.useState<boolean>(false)

    const formik = useFormik<IConstancia>({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values: IConstancia) => {
            // Convert dayjs objects to JavaScript Date objects
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const cleanDetalle = detalle.map(({ id, isNew, ...rest }) => rest)
            const formattedValues = {
                ...values,
                idioma: idiomas.subjects.find(idioma => idioma.id === +values.idioma)?.nombre,
                idiomaId: +values.idioma,
                nivel: NIVEL.find(nivel => nivel.value === String(values.nivel))?.label,
                nivelId: Number(values.nivel),
                estudiante: values.estudiante.toUpperCase(),
                id: id as string,
                url: "no-url",
                detalle: cleanDetalle
            };
            //console.log(formattedValues);

            await ConstanciasService.updateItem(formattedValues as IConstancia)
            navigate.back()
        }
    })

    React.useEffect(() => {
        const loadData = async (id: string | undefined) => {
            setLoading(true)
            const data = await ConstanciasService.getItem(id as string)
            setData(data);
            formik.setValues((prev) => ({
                ...prev,
                estudiante: data?.estudiante || initialValues.estudiante,
                impreso: data?.impreso || false,
                solicitud_id: data?.solicitud_id ?? initialValues.solicitud_id,
                idioma: `${data?.idiomaId ?? initialValues.idioma}`,
                nivel: `${data?.nivelId ?? initialValues.nivel}`,
                tipo: data?.tipo || initialValues.tipo,
                dni: data?.dni || initialValues.dni,
                ciclo: data?.ciclo || initialValues.ciclo,
                modalidad: data?.modalidad || initialValues.modalidad,
                horario: data?.horario || initialValues.horario,
            }))
            setLoading(false)
        }
        if (id) loadData(id as string)
    }, [id, formik.setValues])

    return (
        <Box>
            <Typography variant="h5" gutterBottom>{`Constancia Detalle (${id})`}</Typography>
            <ConstanciaForm formik={formik} id={id as string} edit={edit} />
            <Grid container spacing={2} p={2} >
                <Grid size={{ xs: 12, md: 3 }} display='flex' alignItems='center' justifyContent='center' alignContent='center'>
                    <BackButton fullWidth />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }} display='flex' alignItems='center' justifyContent='center' alignContent='center'>
                    <Button fullWidth onClick={() => setEdit(!edit)} variant="contained" color="primary" startIcon={<EditIcon />}>
                        Editar
                    </Button>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }} display='flex' alignItems='center' justifyContent='center' alignContent='center'>
                    <ButtonSave fullWidth onClick={() => formik.submitForm()} />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }} display='flex' alignItems='center' justifyContent='center' alignContent='center'>
                    {data && <ButtonSeeContancia
                        contancia={data}
                        id={id as string}
                    />}
                </Grid>
                <Grid size={{ xs: 12 }}>
                    {
                        data?.tipo === 'NOTAS' &&
                        (<ConstanciaDetail
                            data={data?.detalle || []}
                            setData={setDetalle}
                            idioma={data?.idioma}
                            nivel={data?.nivel}
                        />)
                    }
                </Grid>
            </Grid>
            <LoadingDialog open={loading} message='Cargando...' />
        </Box>
    )
}
