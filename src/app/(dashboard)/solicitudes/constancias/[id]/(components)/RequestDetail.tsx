'use client'
import React from 'react'
import { MyAccordion, MyDialog } from '@/components/MUI'
import SolicitudesService from '@/services/solicitudes.service'
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';
import Grid from '@mui/material/Grid2'
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import FaceIcon from '@mui/icons-material/Face';
import PowerIcon from '@mui/icons-material/Power';
import { Chip, Typography } from '@mui/material'
import { PanelData } from '@/components/MUI/MyAccordion'
import { Isolicitud } from '@/modules/solicitudes/interfaces/solicitud.interface'
import BasicInfo from '../../../(componets)/BasicInfo'
import FinanceInfo from '../../../(componets)/FinanceInfo'
import BackButton from '@/components/BackButton'
import IProspecto from '@/interfaces/prospecto.interface'
import ProspectosService from '@/services/prospectos.service'
import InfoExtra from '../../../../../../modules/solicitudes/components/InfoExtra';

export default function RequestDetail(props:{id:string}) 
{
    const {id} = props
    //Hooks *************************************************
    const [openDialog, setOpenDialog] = React.useState<boolean>(false);
    const [solicitud, setSolicitud] = React.useState<Isolicitud>()
    const [prospecto, setProspecto] = React.useState<IProspecto>()

	React.useEffect(()=>{
        const getData = async(id :string) =>{
            try{
                const solicitud = await SolicitudesService.getItem(id) as Isolicitud
                setSolicitud(solicitud)
                const prospecto = await ProspectosService.getItem(solicitud.alumno_id as string)
                setProspecto(prospecto)
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
	const saveItem = async (values:Isolicitud) =>{
        if(values.fecha_pago){
            SolicitudesService.updateItem({...values, id:id, fecha_pago: new Date(values.fecha_pago).toISOString().split('T')[0]})
        }else{
            SolicitudesService.updateItem({...values, id: id, pago:solicitud?.pago})
        }
        setOpenDialog(true)
    }

	const panels:PanelData[] = [
        {
            title: 'Información de solicitud',
            content: solicitud && (<FinanceInfo item={solicitud as Isolicitud} saveItem={saveItem} />),
            disabled: false
        },
        {
            title: 'Información de Alumno',
            content: solicitud && (<BasicInfo item={solicitud as Isolicitud} saveItem={saveItem} /> ),
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
                        solicitud?.estado === 'NUEVO' ? 
                        (<Chip icon={<MilitaryTechIcon />} label="Solicitud Nueva" sx={{m:1}} color="error"/>) : 
                        solicitud?.estado === 'ELABORADO' ?
                        (<Chip icon={<MilitaryTechIcon />} label="Solicitud Elaborada" sx={{m:1}} color="warning"/>) : 
                        (<Chip icon={<MilitaryTechIcon />} label="Solicitud Terminada" sx={{m:1}} color="success"/>)
                }
                {
                        prospecto?.facultad !== 'PAR' ? 
                        (<Chip icon={<FaceIcon />} label="Alumno UNAC" sx={{m:1}} color="primary"/>) : 
                        solicitud?.trabajador ? 
                        (<Chip icon={<FaceIcon />} label="Trabajador UNAC" sx={{m:1}} color="primary" />) :
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
