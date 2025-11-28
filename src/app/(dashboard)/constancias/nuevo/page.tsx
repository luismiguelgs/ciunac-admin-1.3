'use client'
import { IConstancia } from '@/modules/constancias/interfaces/constancia.interface'
import { ConstanciasService } from '@/modules/constancias/services/constancias.service'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import React from 'react'
import Grid from '@mui/material/Grid2';
import { initialValues, validationSchema } from '@/modules/constancias/components/validations.schema'
import { Box } from '@mui/material'
import BackButton from '@/components/BackButton'
import ButtonSave from '@/components/ButtonSave'
import LoadingDialog from '@/components/MUI/Dialogs/DialogLoading'
import ConstanciaForm from '@/modules/constancias/components/ConstanciaForm'
import ButtonAsignRequest from '@/components/ButtonAsignRequest'
import SolicitudesService from '@/modules/solicitudes/services/solicitud.service'
import { ISolicitudRes } from '@/modules/solicitudes/interfaces/solicitudres.interface'
import { useSubjectsStore } from '@/modules/opciones/store/types.stores'
import { NIVEL } from '@/lib/constants'

export default function ConstanciasNewPage() 
{
    //HOOKS *************************************************
    const idiomas = useSubjectsStore()
    const [loading, setLoading] = React.useState<boolean>(false)
    const [reload, setReload] = React.useState<boolean>(false)
    const [dataRequest, setDataRequest] = React.useState<ISolicitudRes>()
    
	const [id, setId] = React.useState<string>('nuevo')
    const navigate = useRouter()

    const formik = useFormik<IConstancia>({
        initialValues:initialValues,
        validationSchema : validationSchema,
        onSubmit: async(values:IConstancia) =>{
            setLoading(true)
            const formattedValues = {
                ...values,
                idioma: idiomas.subjects.find(idioma => idioma.id === +values.idioma)?.nombre,
                idiomaId: +values.idioma,
                nivel: NIVEL.find(nivel => nivel.value === String(values.nivel))?.label,
                nivelId: Number(values.nivel),
                estudiante: values.estudiante.toUpperCase(),                
                url: "no-url"
            } as IConstancia
            console.log(JSON.stringify(formattedValues,null, 2))
            const res = await ConstanciasService.newItem(formattedValues)
            setId(res.id as string)
            navigate.push(`./${res.id}`)
            await SolicitudesService.updateStatus(values.solicitud_id as number, 2) //elaborado
            setLoading(false)
        }
    })

    React.useEffect(() => {
        formik.setFieldValue('solicitud_id', dataRequest?.id as number)
        formik.setFieldValue('tipo', dataRequest?.tipoSolicitudId === 5 ? 'MATRICULA' : 'NOTAS')
        formik.setFieldValue('estudiante', dataRequest?.estudiante?.nombres ?  dataRequest?.estudiante?.apellidos + ' ' +  dataRequest?.estudiante?.nombres  : '')
        formik.setFieldValue('dni', dataRequest?.estudiante?.numeroDocumento as string)
        formik.setFieldValue('idioma', dataRequest?.idiomaId)
        formik.setFieldValue('nivel', dataRequest?.nivelId)
    }, [reload])

    return (
        <Box>
            <ConstanciaForm formik={formik} id={id} />
            <Grid container spacing={2} p={2} >
				<Grid size={{xs: 12, md: 4}} display={'flex'} alignItems={'center'} justifyContent={'center'} alignContent={'center'}>
					<BackButton fullWidth/>
				</Grid>
				<Grid size={{xs: 12, md: 4}} display={'flex'} alignItems={'center'} justifyContent={'center'} alignContent={'center'}>
					<ButtonAsignRequest
                        setReload={setReload}
                        setData={setDataRequest} 
                        filtro='CONSTANCIAS'
                    />
				</Grid>
                <Grid size={{xs: 12, md: 4}} display='flex' alignItems='center' justifyContent='center' alignContent='center'>
                    <ButtonSave fullWidth onClick={()=>formik.submitForm()}/>
				</Grid>
				<Grid size={{xs:12}}>
					{/*<CertificateDetail id_certificado={id} /> */}
				</Grid>
			</Grid>
            <LoadingDialog open={loading} message="Cargando..." />
        </Box>
    )
}
