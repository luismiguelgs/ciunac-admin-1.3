'use client'
import React from 'react'
import { MyAccordion, MyDialog } from '@/components/MUI'
import SolicitudesService from '@/modules/solicitudes/services/solicitud.service'
import Grid from '@mui/material/Grid2'
import {  Button, Chip, Typography } from '@mui/material'
import { PanelData } from '@/components/MUI/MyAccordion'
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import FaceIcon from '@mui/icons-material/Face';
import PowerIcon from '@mui/icons-material/Power';
import BackButton from '@/components/BackButton'
import FinanceInfo from '@/modules/solicitudes/certificados/components/FinanceInfo';
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';
import BasicInfo from '@/modules/solicitudes/certificados/components/BasicInfo';
import InfoExtra from '@/modules/solicitudes/certificados/components/InfoExtra'
import { ISolicitudRes } from '@/modules/solicitudes/interfaces/solicitudres.interface'
import { Isolicitud } from '@/modules/solicitudes/interfaces/solicitud.interface'

type Props = {
    id: string,
	setOpen?: React.Dispatch<React.SetStateAction<boolean>> | undefined
}

export default function RequestDetail({id, setOpen}:Props) 
{
    //Hooks *************************************************
    const [openDialog, setOpenDialog] = React.useState<boolean>(false);
    const [solicitud, setSolicitud] = React.useState<ISolicitudRes>()

	React.useEffect(()=>{
        const getData = async(id :string) =>{
            try{
                const solicitud = await SolicitudesService.getItemId(Number(id))
                setSolicitud(solicitud)
            }
            catch(err){
                if (err instanceof Error) {
                    console.error('Error al actualizar el elemento:', err.message);
                } else {
                    console.error('Error desconocido al actualizar el elemento:', err);
                }
            }
        }
        getData(id as string)

    },[])

	//Functions *************************************************
	const saveItem = async (values:ISolicitudRes) =>{
        const data = {
            tipoSolicitudId: values.tipoSolicitudId,
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
	
	const panels:PanelData[] = [
        {
            title: 'Información de solicitud',
            content: solicitud && (<FinanceInfo item={solicitud as ISolicitudRes} saveItem={saveItem} />),
            disabled: false
        },
		{
            title: 'Información de Alumno',
            content: solicitud && (<BasicInfo item={solicitud as ISolicitudRes} saveItem={saveItem} /> ),
            disabled: false
        },
		{
            title: 'Información Adicional',
            content: solicitud && (<InfoExtra item={solicitud}/>),
            disabled: false
        },
    ]

	return (
		<React.Fragment>
            <Typography variant="h5" gutterBottom>Constancias - Detalle Solicitud</Typography>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                {
                        solicitud?.estadoId === 1 ? 
                        (<Chip icon={<MilitaryTechIcon />} label="Solicitud Nueva" sx={{m:1}} color="error"/>) : 
                        solicitud?.estadoId === 2 ?
                        (<Chip icon={<MilitaryTechIcon />} label="Solicitud Elaborada" sx={{m:1}} color="warning"/>) : 
                        (<Chip icon={<MilitaryTechIcon />} label="Solicitud Terminada" sx={{m:1}} color="success"/>)
                }
                {
                        solicitud?.alumnoCiunac ? 
                        (<Chip icon={<FaceIcon />} label="Alumno UNAC" sx={{m:1}} color="primary"/>) : 
                        (<Chip icon={<FaceIcon />} label="PARTICULAR" sx={{m:1}} color="primary"/>)
                }
                {
                        solicitud?.manual === true ? 
                        (<Chip icon={<PowerIcon />} label="Solicitud Manual" sx={{m:1}} />) : 
                        (<Chip icon={<OnlinePredictionIcon />} label="Solicitud Online" sx={{m:1}} />)
                }
                </Grid>
                <Grid size={{ xs: 12 }}>
                    {<MyAccordion panels={panels} />}
                </Grid>
                <Grid size={{ xs: 12 }}>
                    {
                        setOpen ? (
							<Button 
								variant="contained"
								color="secondary"
								onClick={()=>{setOpen(false)}}
								sx={{m:2}}
							>
								Cerrar
							</Button>)	: (
							<BackButton sx={{m:2}} />
						)
                    }
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
