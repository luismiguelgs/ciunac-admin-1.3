'use client'
import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import CertificateForm from '../(components)/(form)/CertificateForm'
import useStore from '@/hooks/useStore'
import { useSubjectsStore } from '@/modules/opciones/store/types.stores'
import { usePathname, useRouter } from 'next/navigation'
import dayjs from 'dayjs'
import { Icertificado, IcertificadoDetalle } from '@/modules/certificados/interfaces/certificado.interface'
import CertificadosService, { Collection } from '@/modules/certificados/services/certificados.service'
import { initialValues, validationSchema } from '../(components)/(form)/validation.schema'
import { useFormik } from 'formik'
import Grid from '@mui/material/Grid2'
import BackButton from '@/components/BackButton'
import ButtonSeeCertificate from '../(components)/ButtonSeeCertificate'
import CertificateDetail from '../(components)/CertificateDetail'
import ButtonSave from '@/components/ButtonSave'
import LoadingDialog from '@/components/MUI/Dialogs/DialogLoading'
import EditIcon from '@mui/icons-material/Edit';

export default function CertificateDetailPage() 
{
    
	//HOOKS *************************************************
    const [loading, setLoading] = React.useState<boolean>(false)
    const navigate = useRouter()
    const pathname = usePathname()
    const id = pathname.split('/').pop()
	const subjects = useStore(useSubjectsStore, (state) => state.subjects)
	
	const [detalle, setDetalle] = React.useState<IcertificadoDetalle[]>([])
    const [edit, setEdit] = React.useState<boolean>(false)

	React.useEffect(()=>{
        const loadData = async (id:string|undefined) =>{
            setLoading(true)
            const data = await CertificadosService.selectItem(id as string)
            console.log(data);
            const detailData = await CertificadosService.fetchItemsDetail(id as string)
            setDetalle(detailData)
            
            formik.setValues({
                alumno: data?.alumno || initialValues.alumno,
                impreso: data?.impreso || false,
                dni: data?.dni || initialValues.dni,
                id_solicitud: data?.id_solicitud || initialValues.id_solicitud,
                idioma: data?.idioma || initialValues.idioma,
                nivel : data?.nivel || initialValues.nivel,
                tipo: data?.tipo || initialValues.tipo,
                elaborador: data?.elaborador || initialValues.elaborador,
                fecha_emision: data?.fecha_emision || initialValues.fecha_emision,
                fecha_conclusion: data?.fecha_conclusion || initialValues.fecha_conclusion,
                horas: data?.horas || initialValues.horas,
                numero_registro: data?.numero_registro || initialValues.numero_registro,
                curricula_antigua: data?.curricula_antigua || initialValues.curricula_antigua,
                duplicado: data?.duplicado || initialValues.duplicado,
                certificado_anterior: data?.certificado_anterior || initialValues.certificado_anterior,
                url: data?.url || initialValues.url
            })
            setLoading(false)
        }
        if(id) loadData(id as string)
    },[id])

	const formik = useFormik<Icertificado>({
        initialValues,
        validationSchema: validationSchema,
        onSubmit: async(values:Icertificado) =>{
            // Convert dayjs objects to JavaScript Date objects
            const formattedValues = {
                ...values,
                id,
                fecha_emision: dayjs(values.fecha_emision).toDate(),
                fecha_conclusion: dayjs(values.fecha_conclusion).toDate()
            };
            //console.log(formattedValues);
            
            await CertificadosService.updateItem(Collection.Certificados, formattedValues as Icertificado)
            navigate.back()
        }
    })
    
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
                        formik={formik} 
                        id={id as string} 
                        data={detalle} 
                        virtual={formik.values.tipo !== 'fisico'}
                        cursos={subjects} />
				</Grid>
                <Grid size={{xs:12}}>
					<CertificateDetail id_certificado={id as string} idioma={formik.values.idioma}  nivel={formik.values.nivel}/> 
				</Grid>
			</Grid>
            <LoadingDialog open={loading} message='Cargando...'/>
		</Box>
	)
}
