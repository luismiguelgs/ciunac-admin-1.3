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
import ISolicitudBeca from '../interfaces/solicitud-beca.interfaces';

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

export default function InfoSol({item}:{item:ISolicitudBeca}) 
{
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
                    value={'SOLICITUD DE BECA'}
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
                    value={dayjs(new Date(item?.creado_en as string))}
                />
            </Grid>
            <Grid size={{xs:12, sm:6}}>
                    <MyDatePicker
                        label="Fecha de última edición"
                        name="modificado"
                        ampm={true}
                        value={dayjs(new Date(item?.modificado_en as string))}
                    />
            </Grid>
            <Grid size={{xs:12}}>
                <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                    Documentos Relacionados
                </Typography>
                <List dense={true} sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    <MyListItem avatar={<MarkAsUnreadIcon />} text='Carta de Compromiso' href={toPreviewUrl(item.carta_de_compromiso)}/>
                    <MyListItem avatar={<HistoryEduIcon />} text='Historial Académico' href={toPreviewUrl(item.historial_academico)}/>
                    <MyListItem avatar={<ArticleIcon />} text='Constancia de matrícula' href={toPreviewUrl(item.constancia_matricula)}/>
                    <MyListItem avatar={<EmojiEventsIcon />} text='Constancia tercio/quinto superior' href={toPreviewUrl(item.contancia_tercio)}/>
                    <MyListItem avatar={<AssignmentTurnedInIcon />} text='Declaracion Jurada' href={toPreviewUrl(item.declaracion_jurada)}/>
                </List>
            </Grid>
        </Grid>
    )
}

function toPreviewUrl(url: string) {
    const idMatch = url.match(/id=([^&]+)/);
    if (idMatch && idMatch[1]) {
        return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
    }
    return url;
}