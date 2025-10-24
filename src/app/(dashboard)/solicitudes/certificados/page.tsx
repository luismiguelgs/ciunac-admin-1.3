'use client'
import { MyDialog, MyTabs } from '@/components/MUI'
import SolicitudesService from '@/modules/solicitudes/services/solicitud.service';
import React from 'react'
import DialogFull from "@/components/MUI/Dialogs/DialogFull";
import { GridRowId } from '@mui/x-data-grid';
import useStore from '@/hooks/useStore';
import { useDocumentsStore, useSubjectsStore } from '@/modules/opciones/store/types.stores';
import { RequestState } from '@/modules/solicitudes/certificados/components/RequestStage';
import RequestDetail from './[id]/RequestDetail';


export default function RequestsCertificatesPage() 
{
	//HOOKS **************************************************
    const documents = useStore(useDocumentsStore, (state) => state.documents)
    const subjects = useStore(useSubjectsStore, (state) => state.subjects)

    const [ID, setID] = React.useState<string| undefined>(''); //Dialog
    const [openDialogDelete, setOpenDialogDelete] = React.useState<boolean>(false);
    const [openDialogFullDetail, setOpenDialogFullDetail] = React.useState<boolean>(false);
    const [refresh, setRefresh] = React.useState<number>(0);

    
    
	//FUNCTIONS ***********************************************
    const handleDelete = (id:GridRowId) =>{
        setID(id as string)
        setOpenDialogDelete(true)
    }
    const handleDetails = (id:GridRowId) =>{
        setOpenDialogFullDetail(true)
        setID(id as string)
    }
    const deleteFunc = async () => {
        await SolicitudesService.deleteItem(Number(ID))
        setOpenDialogDelete(false)
        setRefresh((r) => r + 1)
    }
    return (
        <React.Fragment>
            <MyTabs
                panels={[
                    {
                        label: 'Nuevas',
                        content: (
                            <RequestState
                                state={1} // NUEVO
                                refresh={refresh}
                                handleDelete={handleDelete}
                                handleDetails={handleDetails}
                                documents={documents}
                                subjects={subjects}
                            />
                        ),
                    },
                    {
                        label: 'En Proceso',
                        content: (
                            <RequestState
                                state={2} // PROCESADO
                                refresh={refresh}
                                handleDelete={handleDelete}
                                handleDetails={handleDetails}
                                documents={documents}
                                subjects={subjects}
                            />
                        ),
                    },
                    {
                        label: 'Terminadas',
                        content: (
                            <RequestState
                                state={3} // TERMINADO
                                refresh={refresh}
                                handleDelete={handleDelete}
                                handleDetails={handleDetails}
                                documents={documents}
                                subjects={subjects}
                            />
                        ),
                    },
                ]}
            />
            <MyDialog
                type="ALERT"
                title="Rechazar Solicitud"
                open={openDialogDelete}
                content='Confirma rechazar la solicitud?'
                setOpen={setOpenDialogDelete}
                actionFunc={deleteFunc}
            />

            <DialogFull 
                open={openDialogFullDetail}
                setOpen={setOpenDialogFullDetail}
                title="Detalle de Solicitud"
                content={<RequestDetail id={ID as string} setOpen={setOpenDialogFullDetail} />}
            />
        </React.Fragment>
    )
}
