'use client';

import SolicitudesService from '@/modules/solicitudes/services/solicitud.service';
import { Chip, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import React from 'react'
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import PowerIcon from '@mui/icons-material/Power';
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';
import MyAccordion, { PanelData } from '@/components/MUI/MyAccordion';
import BackButton from '@/components/BackButton';
import { MyDialog } from '@/components/MUI';
import BasicInfo from '../../../../../modules/solicitudes/examenesubicacion/components/BasicInfo';
import FinanceInfo from '../../../../../modules/solicitudes/examenesubicacion/components/FinanceInfo';
import InfoExtra from '../../../../../modules/solicitudes/examenesubicacion/components/InfoExtra';
import { ISolicitudRes } from '@/modules/solicitudes/interfaces/solicitudres.interface';
import { Isolicitud } from '@/modules/solicitudes/interfaces/solicitud.interface';

export default function RequestUbicationDetail(params: { params: { id: string } }) {
    //hooks
    const { id } = params.params

    //const navigate = useNavigate()
    const [openDialog, setOpenDialog] = React.useState<boolean>(false);
    const [solicitud, setSolicitud] = React.useState<ISolicitudRes>()

    React.useEffect(() => {
        const getData = async (id: number) => {
            try {
                const solicitud = await SolicitudesService.getItemId(id)
                setSolicitud(solicitud)
            }
            catch (err) {
                if (err instanceof Error) {
                    console.error('Error al actualizar el elemento:', err.message);
                } else {
                    console.error('Error desconocido al actualizar el elemento:', err);
                }
            }
        }
        getData(Number(id))
    }, [])

    const saveItem = async (values: ISolicitudRes) => {
        //alert(JSON.stringify({...values, fecha_pago: new Date(values.fecha_pago).toISOString().split('T')[0]},null, 2))
        const data = {
            estadoId: values.estadoId,
            idiomaId: values.idiomaId,
            nivelId: values.nivelId,
            numeroVoucher: values.numeroVoucher,
            pago: values.pago,
            fechaPago: values.fechaPago,
        } as unknown as Isolicitud

        SolicitudesService.updateItem(Number(id), data)
        setOpenDialog(true)
    }

    const panels: PanelData[] = [
        {
            title: 'Información de solicitud',
            content: solicitud && (<FinanceInfo item={solicitud} saveItem={saveItem} />),
            disabled: false
        },
        {
            title: 'Información de Alumno',
            content: solicitud && (
                <BasicInfo
                    item={solicitud}
                    edit={false}
                    imagen_dni={solicitud?.estudiante?.imgDoc as string}
                />),
            disabled: false
        },
        {
            title: 'Información Adicional',
            content: solicitud && (<InfoExtra item={solicitud} />),
            disabled: false
        },
    ]

    return (
        <React.Fragment>
            <Typography variant="h5" gutterBottom>Examen de Ubicación - Detalle Solicitud</Typography>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    {
                        solicitud?.estadoId === 1 ?
                            (<Chip icon={<MilitaryTechIcon />} label="Solicitud Nueva" sx={{ m: 1 }} color="error" />) :
                            solicitud?.estadoId === 2 ?
                                (<Chip icon={<MilitaryTechIcon />} label="Solicitud Elaborada" sx={{ m: 1 }} color="warning" />) :
                                (<Chip icon={<MilitaryTechIcon />} label="Solicitud Terminada" sx={{ m: 1 }} color="success" />)
                    }
                    {
                        solicitud?.manual === true ?
                            (<Chip icon={<PowerIcon />} label="Solicitud Manual" sx={{ m: 1 }} />) :
                            (<Chip icon={<OnlinePredictionIcon />} label="Solicitud Online" sx={{ m: 1 }} />)
                    }
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <MyAccordion panels={panels} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <BackButton />
                </Grid>
            </Grid>
            <MyDialog
                open={openDialog}
                setOpen={setOpenDialog}
                content='Solicitud Guardada !'
                title='Nueva Solicitud'
                type='SIMPLE' />
        </React.Fragment>
    )
}

