'use client'
import type { Session } from "next-auth"
import CertificateForm from "./form/CertificateForm";
import React from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { ICertificado } from "@/modules/certificados/interfaces/certificado.interface";
import {initialValues, validationSchema} from "./form/validation.schema";
import dayjs from 'dayjs'
import CertificadosService from "@/modules/certificados/services/certificados.service";
import { Box } from "@mui/material";
import Grid from '@mui/material/Grid2';
import BackButton from "@/components/BackButton";
import CertificateDetail from "./CertificateDetail";
import ButtonSave from "@/components/ButtonSave";
import ButtonAsignRequest from "@/components/ButtonAsignRequest";
import { NIVEL, PROGRAMAS } from "@/lib/constants";
import  LoadingDialog  from"@/components/MUI/Dialogs/DialogLoading"
import SolicitudesService from "@/modules/solicitudes/services/solicitud.service";
import { ISolicitudRes } from "@/modules/solicitudes/interfaces/solicitudres.interface";
import { obtenerPeriodo } from "@/lib/utils";
import {useSubjectsStore } from "@/modules/opciones/store/types.stores";

export default function CertificateNew({ session }: { session: Session | null }) 
{
	//HOOKS *************************************************
    const idiomas = useSubjectsStore()
    const [loading, setLoading] = React.useState<boolean>(false)
    const [reload, setReload] = React.useState<boolean>(false)
    const [dataRequest, setDataRequest] = React.useState<ISolicitudRes>()
    
	const [id, setId] = React.useState<string>('nuevo')
    const navigate = useRouter()

	const formik = useFormik<ICertificado>({
        initialValues:initialValues,
        validationSchema : validationSchema,
        onSubmit: async(values:ICertificado) =>{
            setLoading(true)
            values.estudiante = values.estudiante.toUpperCase()
            // Convert dayjs objects to JavaScript Date objects
            const formattedValues = {
                ...values,
                idioma: idiomas.subjects.find(idioma => idioma.id === +values.idioma)?.nombre,
                idiomaId: +values.idioma,
                nivel: NIVEL.find(nivel => nivel.value === String(values.nivel))?.label,
                nivelId: Number(values.nivel),
                aceptado: false,
                impreso: false,
                periodo: obtenerPeriodo(),
                duplicado: values.duplicado,
                url:values.url,
                elaboradoPor: session?.user?.email,
                fechaEmision: dayjs(values.fechaEmision).toDate(),
                fechaConcluido: dayjs(values.fechaConcluido).toDate(),
                fechaAceptacion: dayjs(values.fechaAceptacion).toDate(),
            } as ICertificado;
            
            const res = await CertificadosService.newItem(formattedValues)
            await SolicitudesService.updateStatus(values?.solicitudId, 2)
            setId(String(res.id))
            navigate.push(`./${res.id}`)
            setLoading(false)
        }
    })

    React.useEffect(() => {
        formik.setFieldValue('solicitudId', dataRequest?.id)
        formik.setFieldValue('estudiante', dataRequest?.estudiante?.nombres ?  dataRequest?.estudiante?.apellidos + ' ' +  dataRequest?.estudiante?.nombres  : '')
        formik.setFieldValue('numeroDocumento', dataRequest?.estudiante?.numeroDocumento)
        formik.setFieldValue('idioma', dataRequest?.idiomaId)
        formik.setFieldValue('nivel', dataRequest?.nivelId)
        formik.setFieldValue('elaboradoPor', session?.user?.email)
        if(dataRequest?.idiomaId && dataRequest?.nivelId){
            const horas = PROGRAMAS.find(programa => programa.id === `${dataRequest?.idiomaId}-${dataRequest?.nivelId}`)?.horas
            formik.setFieldValue('cantidadHoras', horas)
            if(dataRequest?.nivel?.nombre === 'BÁSICO'){
                formik.setFieldValue('numeroRegistro', 'B00 -Folio')
            }else{
                formik.setFieldValue('numeroRegistro', 'IA00 -Folio')
            }
        }
        if(dataRequest?.digital){
            formik.setFieldValue('tipo', 'VIRTUAL')
        }else{
            formik.setFieldValue('tipo', 'FISICO')
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
					<CertificateDetail data={formik.values.notas} nuevo={true} /> 
				</Grid>
			</Grid>
            <LoadingDialog open={loading} message="Cargando..." />
		</Box>
	)
}
