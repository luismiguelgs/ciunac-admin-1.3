import { Button } from '@mui/material'
import React from 'react'
import AssignmentIcon from '@mui/icons-material/Assignment';
import DialogFull from '@/components/MUI/Dialogs/DialogFull';
import RequestList from '../modules/certificados/components/RequestList';
import { ISolicitudRes } from '@/modules/solicitudes/interfaces/solicitudres.interface';

type Props = {
    setReload: React.Dispatch<React.SetStateAction<boolean>>
    setData: React.Dispatch<React.SetStateAction<ISolicitudRes |  undefined>>
    filtro?: 'EXAMEN' | 'CONSTANCIAS' | 'CERTIFICADO'
}


export default function ButtonAsignRequest({ setReload, setData, filtro='CERTIFICADO' }: Props) 
{
    //Mostrar las solicitudes nuevas en un modal full
    const [ openDialogFull, setOpenDialogFull ] = React.useState<boolean>(false)
    //seleccionar la solicitud que se va a procesar

    //cargar los datos de la solicitud en el formulario { nombre del alumno, idioma, nivel}
    //guardar el id de la solicitud
    //actualizar el estatus de la solicitud cuando se termine de procesar

    return (
        <React.Fragment>
            <Button 
                fullWidth 
                onClick={()=>setOpenDialogFull(true)} 
                variant="contained" 
                color="primary" 
                startIcon={<AssignmentIcon />}>
                    Asignar Solicitud
            </Button>
            <DialogFull
                title='Solicitudes' 
                open={openDialogFull}
                setOpen={setOpenDialogFull}
                content={
                    <RequestList
                        setOpenDialogFull={setOpenDialogFull} 
                        setReload={setReload} 
                        setRequest={setData} 
                        filtro={filtro}
                    />
                }
            />
        </React.Fragment>
    )
}
