import { Link, TextField } from '@mui/material'
import pdfLogo from '@/assets/pdf.png'
import noImage from '@/assets/no_disponible.png'
import Grid from '@mui/material/Grid2'
import { ISolicitudRes } from '../../interfaces/solicitudres.interface'

type Props = {
    item: ISolicitudRes
    imagen_dni: string
    edit: boolean
}

export default function BasicInfo({item, edit, imagen_dni}:Props) 
{
    const isPdf = imagen_dni?.split('?')[0].slice(-3) === 'pdf'
    const hasImage = Boolean(imagen_dni)

    return (
        <Grid container spacing={2} p={2}>
            <Grid container spacing={2} size={{xs: 12, md: 8}}>
                <Grid size={{xs: 12, sm: 6}} >
                    <TextField
                        disabled={!edit}
                        fullWidth
                        value={item?.estudiante?.apellidos}
                        //onChange={e=>handleChange(e)}
                        name="apellidos"
                        label="Apellidos"
                        slotProps={{ inputLabel: { shrink: true, } }}
                        helperText={false && "Campo requerido, mínimo 8 dígitos"}
                    />
                </Grid>
                <Grid size={{xs: 12, sm: 6}}>
                    <TextField
                        disabled={!edit}
                        fullWidth
                        value={item?.estudiante?.nombres}
                        //onChange={e=>handleChange(e)}
                        name="nombres"
                        label="Nombres"
                        slotProps={{ inputLabel: { shrink: true, } }}
                        helperText={false && "Campo requerido, mínimo 8 dígitos"}
                    />
                </Grid>
                <Grid size={{xs: 12, sm: 6}}>
                    <TextField
                        //required
                        disabled={!edit}
                        fullWidth
                        value={item?.estudiante?.numeroDocumento}
                        //onChange={e=>handleChange(e)}
                        name="dni"
                        label="DNI"
                        slotProps={{ inputLabel: { shrink: true, } }}
                        helperText={false && "Campo requerido, mínimo 8 dígitos"}
                    />
                </Grid>
                <Grid size={{xs: 12, sm: 6}}>
                    <TextField
                        required
                        disabled={!edit}
                        fullWidth
                        value={item?.estudiante?.celular}
                        //onChange={e=>handleChange(e)}
                        name="celular"
                        label="Celular"
                        slotProps={{ inputLabel: { shrink: true, } }}
                        helperText={false && "Campo requerido, mínimo 8 dígitos"}
                    />
                </Grid>
                <Grid size={{xs: 12, sm: 6}} alignContent='center'>
                    {   Boolean(imagen_dni) ?
                            (<Link href={imagen_dni} underline='always' target='_blank' rel="noopener">VER DNI</Link>) 
                        :null
                    }
                </Grid>
            </Grid>
            <Grid container spacing={1} size={{xs: 12, md: 4}}>
            { 
                isPdf ? 
                    (<img src={pdfLogo.src} width='100%' />):
                    hasImage ? 
                       (<img src={imagen_dni} width='100%'/>) :
                       (<img src={noImage.src} width='100%'/>)
            }
            </Grid>
        </Grid>
    )
}
