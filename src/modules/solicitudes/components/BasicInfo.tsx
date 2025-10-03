import { Button, TextField } from '@mui/material'
import noImage from '@/assets/no_disponible.png'
import Grid from '@mui/material/Grid2'
import React from 'react'
import { useFormik } from 'formik'
import { validationSchemaBasic } from '../schemas/validation.schema'
import Image from 'next/image'
import EditNoteIcon from '@mui/icons-material/EditNote';
import SaveIcon from '@mui/icons-material/Save';
import IEstudiante from '@/modules/estudiantes/interfaces/estudiante.interface'
import { ISolicitudRes } from '../interfaces/solicitudres.interface'

type Props = {
    item: ISolicitudRes,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    saveItem:(values:any) => void
}

export default function BasicInfo({item, saveItem}:Props) 
{
    const [edit, setEdit] = React.useState<boolean>(false)

    console.log(item)

    const formik = useFormik<IEstudiante>({
        initialValues:{
            apellidos: item.estudiante?.apellidos as string,
            nombres: item.estudiante?.nombres as string,
            numeroDocumento: item.estudiante?.numeroDocumento as string,
            celular: item.estudiante?.celular as string,
        },
        validationSchema: validationSchemaBasic,
        onSubmit: (values)=>{
            saveItem(values)
            setEdit(false)
        }
    })
    return (
        <Grid container spacing={2} p={2}>
            <Grid container spacing={2} size={{xs: 12, md: 8}} component={'form'} onSubmit={formik.handleSubmit}>
                <Grid size={{xs: 12, sm: 6}} >
                    <TextField
                        required
                        disabled={!edit}
                        fullWidth
                        value={formik.values.apellidos}
                        onChange={formik.handleChange}
                        error={formik.touched.apellidos && Boolean(formik.errors.apellidos)}
                        name="apellidos"
                        label="Apellidos"
                        slotProps={{ inputLabel: { shrink: true, } }}
                        helperText={formik.touched.apellidos && formik.errors.apellidos}
                    />
                </Grid>
                <Grid size={{xs: 12, sm: 6}}>
                    <TextField
                        required
                        disabled={!edit}
                        fullWidth
                        value={formik.values.nombres}
                        error={formik.touched.nombres && Boolean(formik.errors.nombres)}
                        onChange={formik.handleChange}
                        name="nombres"
                        label="Nombres"
                        slotProps={{ inputLabel: { shrink: true, } }}
                        helperText={formik.touched.nombres && formik.errors.nombres}
                    />
                </Grid>
                <Grid size={{xs: 12, sm: 6}}>
                    <TextField
                        required
                        disabled={!edit}
                        error={formik.touched.numeroDocumento && Boolean(formik.errors.numeroDocumento)}
                        fullWidth
                        value={formik.values.numeroDocumento}
                        onChange={formik.handleChange}
                        name="numeroDocumento"
                        label="DNI"
                        slotProps={{ inputLabel: { shrink: true, } }}
                        helperText={formik.touched.numeroDocumento && formik.errors.numeroDocumento}
                    />
                </Grid>
                <Grid size={{xs: 12, sm: 6}}>
                    <TextField
                        required
                        disabled={!edit}
                        error={formik.touched.celular && Boolean(formik.errors.celular)}
                        fullWidth
                        value={formik.values.celular}
                        onChange={formik.handleChange}
                        name="celular"
                        label="Celular"
                        slotProps={{ inputLabel: { shrink: true, } }}
                        helperText={formik.touched.celular && formik.errors.celular}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={1} size={{xs: 12, md: 4}}>
            <Image 
                src={noImage.src} 
                style={{width:'100%', height:'100%', objectFit: 'contain'}} 
                alt='no image' 
                width={1000} 
                height={1000} 
                priority/>
            </Grid>
        </Grid>
    )
}
