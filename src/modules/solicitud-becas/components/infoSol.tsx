import { Isolicitud } from '@/modules/solicitudes/interfaces/solicitud.interface'
import React from 'react'
import Grid from '@mui/material/Grid2'
import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from '@mui/material'
import MyDatePicker from '@/components/MyDatePicker';
import dayjs from 'dayjs';
import ArticleIcon from '@mui/icons-material/Article';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Link from 'next/link';
import MarkAsUnreadIcon from '@mui/icons-material/MarkAsUnread';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

function MyListItem({avatar, href, text}:{avatar:React.ReactNode, href:string | undefined, text:string}) {
    const secondary = href?.split('?')[0].split('2F').pop();
    return(
        <>
            <ListItem>
                <ListItemAvatar>
                    <Avatar>
                        {avatar}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={text} secondary={
                    <React.Fragment>
                        <Link href={href as string} target='_blank'>{secondary}</Link>
                    </React.Fragment>
                } />
            </ListItem>
            <Divider variant="inset" component="li" />
        </>
    )
}

export default function InfoSol({item}:{item:Isolicitud}) 
{
    if (item.creado && item.creado.seconds) {
        item.creado = dayjs(new Date(item.creado.seconds * 1000 + (item.creado.nanoseconds || 0) / 1e6))
    }
    if (item.modificado && item.modificado.seconds) {
        item.modificado = dayjs(new Date(item.modificado.seconds * 1000 + (item.modificado.nanoseconds || 0) / 1e6))
    }
    return (
        <Grid container spacing={2} p={2}>
             <Grid size={{xs: 12, sm: 6}} >
                <TextField
                    disabled
                    variant='standard'
                    fullWidth
                    value={item?.periodo}
                    label="Periodo de Solicitud"
                    slotProps={{ inputLabel: { shrink: true, } }}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 6}} >
                <TextField
                    disabled
                    variant='standard'
                    fullWidth
                    value={item?.solicitud}
                    label="Tipo de Solicitud"
                    slotProps={{ inputLabel: { shrink: true, } }}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 6}} >
                <TextField
                    disabled
                    variant='standard'
                    fullWidth
                    value={item?.estado}
                    label="Estado de Solicitud"
                    slotProps={{ inputLabel: { shrink: true, } }}
                />
            </Grid>
            <Grid size={{xs: 12, sm: 6}} >
                
            </Grid>
            <Grid size={{xs:12, sm:6}}>
                <MyDatePicker
                    label="Fecha de creación"
                    name="creado"
                    ampm={true}
                    value={dayjs(new Date(item?.creado))}
                />
            </Grid>
            <Grid size={{xs:12, sm:6}}>
                    <MyDatePicker
                        label="Fecha de última edición"
                        name="modificado"
                        ampm={true}
                        value={dayjs(new Date(item?.modificado))}
                    />
            </Grid>
            <Grid size={{xs:12}}>
                <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                    Documentos Relacionados
                </Typography>
                <List dense={true} sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    <MyListItem avatar={<MarkAsUnreadIcon />} text='Carta de Compromiso' href={item.img_cert_trabajo}/>
                    <MyListItem avatar={<HistoryEduIcon />} text='Historial Académico' href={item.img_dni}/>
                    <MyListItem avatar={<ArticleIcon />} text='Constancia de matrícula' href={item.img_cert_estudio}/>
                    <MyListItem avatar={<EmojiEventsIcon />} text='Constancia tercio/quinto superior' href={item.img_voucher}/>
                    <MyListItem avatar={<AssignmentTurnedInIcon />} text='Declaracion Jurada' href={item.certificado_trabajo}/>
                </List>
            </Grid>
        </Grid>
    )
}
