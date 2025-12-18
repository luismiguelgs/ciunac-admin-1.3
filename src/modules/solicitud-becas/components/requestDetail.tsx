'use client'
import BackButton from '@/components/BackButton';
import { MyDialog } from '@/components/MUI';
import MyAccordion, { PanelData } from '@/components/MUI/MyAccordion';
import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React from 'react'
import InfoStudent from './infoStudent';
import InfoSol from './infoSol';
import Observaciones from './observaciones';
import { SolicitudBecasService } from '../services/solicitudes-beca.service';
import ISolicitudBeca from '../interfaces/solicitud-beca.interfaces';

type TEstado = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO'

export default function RequestDetail(props: { id: string }) {
    const { id } = props
    //Hooks *************************************************
    const [openDialog, setOpenDialog] = React.useState<boolean>(false);
    const [solicitud, setSolicitud] = React.useState<ISolicitudBeca>()
    const [estado, setEstado] = React.useState<TEstado>('PENDIENTE')

    React.useEffect(() => {
        const getData = async (id: string) => {
            try {
                const solicitud = await SolicitudBecasService.getItem(id)
                setSolicitud(solicitud)
                setEstado(solicitud.estado as TEstado)
            }
            catch (err) {
                if (err instanceof Error) {
                    console.error('Error al actualizar el elemento:', err.message);
                } else {
                    console.error('Error desconocido al actualizar el elemento:', err);
                }
            }
        }
        getData(id as string)
    }, [])

    //Functions *************************************************
    const handleChange = async (
        event: React.MouseEvent<HTMLElement>,
        nuevoEstado: TEstado,
    ) => {
        setEstado(nuevoEstado);
        SolicitudBecasService.updateStatus(id, nuevoEstado)
        console.log('Event:', event);
        setOpenDialog(true)
    };

    const panels: PanelData[] = [
        {
            title: 'Información del Estudiante',
            content: solicitud && (<InfoStudent item={solicitud} />),
            disabled: false
        },
        {
            title: 'Información de la Solicitud',
            content: solicitud && (<InfoSol item={solicitud} />),
            disabled: false
        },
        {
            title: 'Observaciones',
            content: solicitud && (<Observaciones item={solicitud} />),
            disabled: false
        }
    ]

    return (
        <React.Fragment>
            <Typography variant="h5" gutterBottom>Becas - Detalle Solicitud</Typography>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <MyAccordion panels={panels} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <BackButton />
                    <ToggleButtonGroup
                        color="primary"
                        value={estado}
                        exclusive
                        onChange={handleChange}
                        aria-label="Platform"
                    >
                        <ToggleButton value="PENDIENTE">PENDIENTE</ToggleButton>
                        <ToggleButton value="APROBADO">APROBADO</ToggleButton>
                        <ToggleButton value="RECHAZADO">RECHAZADO</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
            </Grid>
            <MyDialog
                open={openDialog}
                setOpen={setOpenDialog}
                content='Solicitud Guardada !'
                title='Nueva Solicitud'
                type='SIMPLE'
            />
        </React.Fragment>
    )
}