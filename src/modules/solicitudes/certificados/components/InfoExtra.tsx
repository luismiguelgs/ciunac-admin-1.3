'use client'
import Grid from '@mui/material/Grid2'
import { Card, CardContent, CardHeader, CardMedia, Link } from '@mui/material'
import pdfLogo from '@/assets/pdf.png'
import noImage from '@/assets/no_disponible.png'
import { ISolicitudRes } from '../../interfaces/solicitudres.interface'

type Props = {
    item: ISolicitudRes
}
type ObjImage = {
    title: string
    isPdf: boolean,
    hasImage: boolean
}

export default function InfoExtra({item}:Props) 
{   
    const certificadoEstudio: ObjImage = {
        title : 'Certificado de Estudio',
        isPdf : item.imgCertEstudio?.split('?')[0].slice(-3) === 'pdf',
        hasImage : Boolean(item.imgCertEstudio?.slice(0,4) === 'http')
    }
    
    return (
        <Grid container spacing={2} p={1}>
            <Grid size={{xs:12, sm:6}} display='flex'>
                <Card sx={{p:2, width:'100%'}}>
                    <CardHeader title={'Certificado de Trabajo'} />
                    <CardMedia 
                        component='img'
                        alt={'Certificado de Trabajo'}
                        style={{maxHeight:'440px', width:'100%', margin:'0 auto'}}
                        image={noImage.src}
                    />
                    <CardContent>
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
                                    item.imgCertEstudio :
                                    noImage.src
                        }
                    />
                    <CardContent>
                    {   certificadoEstudio.hasImage ?
                            (<Link href={item?.imgCertEstudio} underline='always' target='_blank' rel="noopener">VER IMAGEN</Link>) 
                            :null
                    }
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}