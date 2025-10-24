'use client'
import { Iconstancia, IconstanciaDetalle } from '../../../../interfaces/constancia.interface'
import { Collection, ConstanciasService } from '@/services/constancias.service'
import { useFormik } from 'formik'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { initialValues, validationSchema } from '../(components)/validations.schema'
import { Box, Button, Typography } from '@mui/material'
import ConstanciaForm from '../(components)/ConstanciaForm'
import Grid from '@mui/material/Grid2'
import BackButton from '@/components/BackButton'
import EditIcon from '@mui/icons-material/Edit';
import ButtonSave from '@/components/ButtonSave'
import LoadingDialog from '@/components/MUI/Dialogs/DialogLoading'
import ButtonSeeContancia from '../(components)/ButtonSeeContancia'
import ConstanciaDetail from '../(components)/ConstanciaDetail'

export default function ConstanciasEditPage() 
{
    //HOOKS *************************************************
    const [loading, setLoading] = React.useState<boolean>(false)
    const [data, setData] = React.useState<Iconstancia>()
    const navigate = useRouter()
    const pathname = usePathname()
    const id = pathname.split('/').pop()
	const [detalle, setDetalle] = React.useState<IconstanciaDetalle[]>([])
    const [edit, setEdit] = React.useState<boolean>(false)

	React.useEffect(()=>{
        const loadData = async (id:string|undefined) =>{
            setLoading(true)
            const data = await ConstanciasService.selectItem(id as string)
            setData(data);
            const detailData = await ConstanciasService.fetchItemsDetalle(id as string)
            setDetalle(detailData)
            
            formik.setValues({
                estudiante: data?.estudiante || initialValues.estudiante,
                impreso: data?.impreso || false,
                id_solicitud: data?.id_solicitud || initialValues.id_solicitud,
                idioma: data?.idioma || initialValues.idioma,
                nivel : data?.nivel || initialValues.nivel,
                tipo: data?.tipo || initialValues.tipo,
                dni: data?.dni || initialValues.dni,
                ciclo: data?.ciclo || initialValues.ciclo,
                modalidad: data?.modalidad || initialValues.modalidad,
                horario: data?.horario || initialValues.horario,
            })
            setLoading(false)
        }
        if(id) loadData(id as string)
    },[id])

    const formik = useFormik<Iconstancia>({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async(values:Iconstancia) =>{
            // Convert dayjs objects to JavaScript Date objects
            const formattedValues = {
                ...values,
                id,
            };
            //console.log(formattedValues);
            
            await ConstanciasService.updateItem(Collection.CONSTANCIAS, formattedValues as Iconstancia)
            navigate.back()
        }
    })
    return (
        <Box>
			<Typography variant="h5" gutterBottom>{`Constancia Detalle (${id})` }</Typography>
			<ConstanciaForm formik={formik} id={id as string} edit={edit}/>
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
					{data && <ButtonSeeContancia
                        contancia={data} 
                        id={id as string} 
                        constanciaDetalle={detalle} 
                    />}
				</Grid>
                <Grid size={{xs:12}}>
					{
                        data?.tipo === 'CONSTANCIA_NOTAS' && 
                        (<ConstanciaDetail 
                            id_constancia={id as string}
                            idioma={data?.idioma}
                            nivel={data?.nivel}
                            setDetalle={setDetalle}
                            detalle={detalle}
                        />)
                    }
				</Grid>
			</Grid>
            <LoadingDialog open={loading} message='Cargando...'/>
		</Box>
    )
}
