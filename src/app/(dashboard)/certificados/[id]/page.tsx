'use client'
import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import CertificateForm from '@/modules/certificados/components/form/CertificateForm'
import useSubjects from '@/hooks/useSubjects'
import { usePathname, useRouter } from 'next/navigation'
import dayjs from 'dayjs'
import { ICertificado, ICertificadoNota } from '@/modules/certificados/interfaces/certificado.interface'
import CertificadosService from '@/modules/certificados/services/certificados.service'
import { initialValues, validationSchema } from '@/modules/certificados/components/form/validation.schema'
import { useFormik } from 'formik'
import Grid from '@mui/material/Grid2'
import BackButton from '@/components/BackButton'
import ButtonSeeCertificate from '@/modules/certificados/components/ButtonSeeCertificate'
import CertificateDetail from '@/modules/certificados/components/CertificateDetail'
import ButtonSave from '@/components/ButtonSave'
import LoadingDialog from '@/components/MUI/Dialogs/DialogLoading'
import EditIcon from '@mui/icons-material/Edit';
import { NIVEL } from '@/lib/constants'

export default function CertificateDetailPage() 
{
    //HOOKS *************************************************
    const [loading, setLoading] = React.useState<boolean>(true)
    const navigate = useRouter()
    const pathname = usePathname()
    const id = pathname.split('/').pop()

    const { data: idiomas } = useSubjects()

    const [data , setData] = React.useState<ICertificado | undefined>(undefined)
    const [detalle, setDetalle] = React.useState<ICertificadoNota[]>([])
    const [edit, setEdit] = React.useState<boolean>(false)

    const formik = useFormik<ICertificado>({
        initialValues,
        validationSchema: validationSchema,
        onSubmit: async(values:ICertificado) =>{
            // Convert dayjs objects to JavaScript Date objects
            const cleanNotas = detalle.map(({id, isNew, ...rest})=>rest)
            const formattedValues = {
                ...values,
                id,
                idiomaId: Number(values.idioma),
                idioma: idiomas?.filter(item=>item.id === Number(values.idioma))[0]?.nombre,
                nivelId: Number(values.nivel),
                nivel: NIVEL.filter(item=>item.value === String(values.nivel))[0]?.label,
                fechaEmision: dayjs(values.fechaEmision).toDate(),
                fechaConcluido: dayjs(values.fechaConcluido).toDate(),
                notas: cleanNotas
            } as ICertificado;
            console.log(formattedValues)
            await CertificadosService.updateItem(formattedValues as ICertificado)
            navigate.back()
        }
    })

    React.useEffect(()=>{
        const loadData = async (id:string|undefined) =>{
            const data = await CertificadosService.getItem(id as string)
            // If you have a detail endpoint, fetch and set it here.
            setDetalle(data?.notas || [])
            setData(data)
            formik.setValues({
                estudiante: data?.estudiante || initialValues.estudiante,
                impreso: data?.impreso ?? initialValues.impreso,
                numeroDocumento: data?.numeroDocumento || initialValues.numeroDocumento,
                solicitudId: data?.solicitudId ?? initialValues.solicitudId,
                idioma: String(data?.idiomaId) || initialValues.idioma,
                nivel: String(data?.nivelId) || initialValues.nivel,
                tipo: data?.tipo || initialValues.tipo,
                elaboradoPor: data?.elaboradoPor || initialValues.elaboradoPor,
                fechaEmision: data?.fechaEmision ? new Date(data?.fechaEmision) : initialValues.fechaEmision,
                fechaConcluido: data?.fechaConcluido ? new Date(data?.fechaConcluido) : initialValues.fechaConcluido,
                cantidadHoras: data?.cantidadHoras ?? initialValues.cantidadHoras,
                numeroRegistro: data?.numeroRegistro || initialValues.numeroRegistro,
                curriculaAnterior: data?.curriculaAnterior ?? initialValues.curriculaAnterior,
                duplicado: data?.duplicado ?? initialValues.duplicado,
                certificadoOriginal: data?.certificadoOriginal || initialValues.certificadoOriginal,
                url: data?.url || initialValues.url,
                aceptado: data?.aceptado ?? initialValues.aceptado,
                fechaAceptacion: data?.fechaAceptacion ? new Date(data?.fechaAceptacion) : undefined,
                periodo: data?.periodo || initialValues.periodo,
                notas: data?.notas || initialValues.notas,
            })
            setLoading(false)
        }
        if(id) loadData(id as string)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[id])

    return (
        <Box>
            <Typography variant="h5" gutterBottom>{`Certificado Detalle (${id})` }</Typography>
            <CertificateForm formik={formik} id={id as string} edit={edit}/>
            <Grid container spacing={2} p={2} >
                <Grid size={{xs: 12, md: 3}} display='flex' alignItems='center' justifyContent='center' alignContent='center'>
                    <BackButton fullWidth />
                </Grid>
                <Grid size={{xs: 12, md: 3}} display='flex' alignItems='center' justifyContent='center' alignContent='center'>
                    <Button fullWidth onClick={()=>setEdit(!edit)} variant="contained" color="primary" startIcon={<EditIcon />}>
                        Editar
                    </Button>
                </Grid>
                <Grid size={{xs: 12, md: 3}} display='flex' alignItems='center' justifyContent='center' alignContent='center'>
                    <ButtonSave fullWidth onClick={()=>formik.submitForm()}/>
                </Grid>
                <Grid size={{xs: 12, md: 3}} display='flex' alignItems='center' justifyContent='center' alignContent='center'>
                    <ButtonSeeCertificate 
                        data={data} 
                        id={id as string} 
                        notas={detalle} 
                        virtual={data?.tipo !== 'FISICO'}
                    />
                </Grid>
                <Grid size={{xs:12}}>
                {
                    loading ?
                        <LoadingDialog open={loading} message='Cargando...'/>
                    :
                        <CertificateDetail data={detalle} setData={setDetalle} idioma={formik.values.idioma}  nivel={formik.values.nivel}/>
                }
                </Grid>
            </Grid>
        </Box>
    )
}
