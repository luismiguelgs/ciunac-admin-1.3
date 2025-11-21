'use client'
import { Iconstancia } from '../../../../modules/constancias/interfaces/constancia.interface'
import { Collection, ConstanciasService } from '@/services/constancias.service'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import React from 'react'
import Grid from '@mui/material/Grid2';
import { initialValues, validationSchema } from '../(components)/validations.schema'
import { Isolicitud } from '@/modules/solicitudes/interfaces/solicitud.interface'
import { Box } from '@mui/material'
import BackButton from '@/components/BackButton'
import ButtonSave from '@/components/ButtonSave'
import LoadingDialog from '@/components/MUI/Dialogs/DialogLoading'
import ConstanciaForm from '../(components)/ConstanciaForm'
import ButtonAsignRequest from '@/components/ButtonAsignRequest'
import SolicitudesService from '@/services/solicitudes.service'

export default function ConstanciasNewPage() 
{
    //HOOKS *************************************************
    const [loading, setLoading] = React.useState<boolean>(false)
    const [reload, setReload] = React.useState<boolean>(false)
    const [dataRequest, setDataRequest] = React.useState<Isolicitud>()
    
	const [id, setId] = React.useState<string>('nuevo')
    const navigate = useRouter()

    const formik = useFormik<Iconstancia>({
        initialValues:initialValues,
        validationSchema : validationSchema,
        onSubmit: async(values:Iconstancia) =>{
            setLoading(true)
            values.estudiante = values.estudiante.toUpperCase()
            //alert(JSON.stringify(values,null, 2))
            const id = await ConstanciasService.newItem(Collection.CONSTANCIAS, values)
            setId(id as string)
            navigate.push(`./${id}`)
            await SolicitudesService.updateStatus(values.id_solicitud as string, 'ELABORADO')
            setLoading(false)
        }
    })

    React.useEffect(() => {
        formik.setFieldValue('id_solicitud', dataRequest?.id)
        formik.setFieldValue('tipo', dataRequest?.solicitud === 'CONSTANCIA_DE_NOTAS' ? 'CONSTANCIA_NOTAS' : 'CONSTANCIA_MATRICULA')
        formik.setFieldValue('estudiante', dataRequest?.nombres ?  dataRequest?.apellidos + ' ' +  dataRequest?.nombres  : '')
        formik.setFieldValue('dni', dataRequest?.dni)
        formik.setFieldValue('idioma', dataRequest?.idioma)
        formik.setFieldValue('nivel', dataRequest?.nivel)
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
