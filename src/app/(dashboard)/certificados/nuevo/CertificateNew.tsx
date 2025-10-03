'use client'
import type { Session } from "next-auth"
import CertificateForm from "../(components)/(form)/CertificateForm";
import React from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { Icertificado } from "@/modules/certificados/interfaces/certificado.interface";
import {initialValues, validationSchema} from "../(components)/(form)/validation.schema";
import dayjs from 'dayjs'
import CertificadosService, { Collection } from "@/modules/certificados/services/certificados.service";
import { Box } from "@mui/material";
import Grid from '@mui/material/Grid2';
import BackButton from "@/components/BackButton";
import CertificateDetail from "../(components)/CertificateDetail";
import ButtonSave from "@/components/ButtonSave";
import ButtonAsignRequest from "../../../../components/ButtonAsignRequest";
import { Isolicitud } from "@/modules/solicitudes/interfaces/solicitud.interface";
import { PROGRAMAS } from "@/lib/constants";
import  LoadingDialog  from"@/components/MUI/Dialogs/DialogLoading"
import SolicitudesService from "@/services/solicitudes.service";

export default function CertificateNew({ session }: { session: Session | null }) 
{
	//HOOKS *************************************************
    const [loading, setLoading] = React.useState<boolean>(false)
    const [reload, setReload] = React.useState<boolean>(false)
    const [dataRequest, setDataRequest] = React.useState<Isolicitud>()
    
	const [id, setId] = React.useState<string>('nuevo')
    const navigate = useRouter()

	const formik = useFormik<Icertificado>({
        initialValues:initialValues,
        validationSchema : validationSchema,
        onSubmit: async(values:Icertificado) =>{
            setLoading(true)
            values.alumno = values.alumno.toUpperCase()
            // Convert dayjs objects to JavaScript Date objects
            const formattedValues = {
                ...values,
                aceptacion: false,
                impreso: false,
                duplicado: false,
                url:'',
                elaborador: session?.user?.email,
                fecha_emision: dayjs(values.fecha_emision).toDate(),
                fecha_conclusion: dayjs(values.fecha_conclusion).toDate(),
                fecha_aceptacion: dayjs(values.fecha_aceptacion).toDate(),
            } as Icertificado;
            
            const id = await CertificadosService.newItem(Collection.Certificados, formattedValues)
            await SolicitudesService.updateStatus(values?.id_solicitud as string, 'ELABORADO')
            setId(id as string)
            navigate.push(`./${id}`)
            setLoading(false)
        }
    })

    React.useEffect(() => {
        formik.setFieldValue('id_solicitud', dataRequest?.id)
        formik.setFieldValue('alumno', dataRequest?.nombres ?  dataRequest?.apellidos + ' ' +  dataRequest?.nombres  : '')
        formik.setFieldValue('dni', dataRequest?.dni)
        formik.setFieldValue('idioma', dataRequest?.idioma)
        formik.setFieldValue('nivel', dataRequest?.nivel)
        formik.setFieldValue('elaborador', session?.user?.email)
        if(dataRequest?.idioma && dataRequest?.nivel){
            const horas = PROGRAMAS.find(programa => programa.id === `${dataRequest?.idioma}-${dataRequest?.nivel}`)?.horas
            formik.setFieldValue('horas', horas)
            if(dataRequest.nivel === 'BASICO'){
                formik.setFieldValue('numero_registro', 'B00 -Folio')
            }else{
                formik.setFieldValue('numero_registro', 'IA00 -Folio')
            }
        }
        if(dataRequest?.digital){
            formik.setFieldValue('tipo', 'digital')
        }else{
            formik.setFieldValue('tipo', 'fisico')
        }
    }, [reload])
  
	return (
		<Box>
			<CertificateForm formik={formik} id={id} />
			<Grid container spacing={2} p={2} >
				<Grid size={{xs: 12, md: 4}} display={'flex'} alignItems={'center'} justifyContent={'center'} alignContent={'center'}>
					<BackButton fullWidth/>
				</Grid>
				<Grid size={{xs: 12, md: 4}} display={'flex'} alignItems={'center'} justifyContent={'center'} alignContent={'center'}>
					<ButtonAsignRequest
                        setReload={setReload}
                        setData={setDataRequest} 
                        filtro="CERTIFICADO"
                    />
				</Grid>
                <Grid size={{xs: 12, md: 4}} display='flex' alignItems='center' justifyContent='center' alignContent='center'>
                    <ButtonSave fullWidth onClick={()=>formik.submitForm()}/>
				</Grid>
				<Grid size={{xs:12}}>
					<CertificateDetail id_certificado={id} /> 
				</Grid>
			</Grid>
            <LoadingDialog open={loading} message="Cargando..." />
		</Box>
	)
}
