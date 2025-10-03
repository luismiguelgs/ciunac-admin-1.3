'use client'
import Grid from '@mui/material/Grid2'
import { Card, CardContent, CardHeader, CardMedia, Link } from '@mui/material'
import pdfLogo from '@/assets/pdf.png'
import noImage from '@/assets/no_disponible.png'
import { Isolicitud } from '@/modules/solicitudes/interfaces/solicitud.interface'

type Props = {
    item: Isolicitud
}
type ObjImage = {
    title: string
    isPdf: boolean,
    hasImage: boolean
}

export default function InfoExtra({item}:Props) 
{   
    console.log(item);  
    
    const certificadoTrabajo:ObjImage =  {
        title : 'Certificado de Trabajo',
        isPdf : item.img_cert_trabajo?.split('?')[0].slice(-3) === 'pdf',
        hasImage : Boolean(item.img_cert_trabajo?.slice(0,4) === 'http')
    }
    const certificadoEstudio: ObjImage = {
        title : 'Certificado de Estudio',
        isPdf : item.img_cert_estudio?.split('?')[0].slice(-3) === 'pdf',
        hasImage : Boolean(item.img_cert_estudio?.slice(0,4) === 'http')
    }
    
    return (
        <Grid container spacing={2} p={1}>
            <Grid size={{xs:12, sm:6}} display='flex'>
                <Card sx={{p:2, width:'100%'}}>
                    <CardHeader title={certificadoTrabajo.title} />
                    <CardMedia 
                        component='img'
                        alt={certificadoTrabajo.title}
                        style={{maxHeight:'440px', width:'100%', margin:'0 auto'}}
                        image={
                            certificadoTrabajo.isPdf ? 
                                pdfLogo.src : 
                                certificadoTrabajo.hasImage ?
                                    item.img_cert_trabajo :
                                    noImage.src
                        }
                    />
                    <CardContent>
                    {   certificadoTrabajo.hasImage ?
                            (<Link href={item?.img_cert_trabajo} underline='always' target='_blank' rel="noopener">VER IMAGEN</Link>) 
                            :null
                    }
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={{xs:12, sm:6}} display='flex'>
                <Card sx={{p:1, width:'100%'}}>
                    <CardHeader title={certificadoEstudio.title} />
                    <CardMedia 
                        component='img'
                        alt={certificadoEstudio.title}
                        style={{maxHeight:'440px', width:'100%', margin:'0 auto'}}
                        image={
                            certificadoEstudio.isPdf ? 
                                pdfLogo.src : 
                                certificadoEstudio.hasImage ?
                                    item.img_cert_estudio :
                                    noImage.src
                        }
                    />
                    <CardContent>
                    {   certificadoEstudio.hasImage ?
                            (<Link href={item?.img_cert_estudio} underline='always' target='_blank' rel="noopener">VER IMAGEN</Link>) 
                            :null
                    }
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}