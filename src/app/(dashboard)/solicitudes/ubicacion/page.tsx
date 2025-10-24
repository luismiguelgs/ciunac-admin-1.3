'use client';
import { MyDialog, MyTabs } from '@/components/MUI'
import useStore from '@/hooks/useStore';
import { useSubjectsStore } from '@/modules/opciones/store/types.stores';
import { GridRowId } from '@mui/x-data-grid';
import React from 'react'
import { useRouter } from 'next/navigation';
import SolicitudesService from '@/modules/solicitudes/services/solicitud.service';
import { RequestState } from '@/modules/solicitudes/examenesubicacion/components/RequestState';

export default function RequestsUbicationPage() 
{
	//Hooks *****************************************************************
	const subjects = useStore(useSubjectsStore, (state) => state.subjects)
	const navigate = useRouter()
	const [ openDialogDelete, setOpenDialogDelete ] = React.useState<boolean>(false)
	const [idToDelete, setIdToDelete] = React.useState<GridRowId | null>(null);

	//Functions**************************************************************
    //Dialog
    const handleConfirmDelete = async () => {
        if (idToDelete) {
            await SolicitudesService.deleteItem(idToDelete as number);
            setIdToDelete(null);
            setOpenDialogDelete(false);
        }
    };
    const handleDetails = (id:GridRowId) => {
        navigate.push(`/solicitudes/ubicacion/${id}`)
    }
    const handleDelete = async (id:GridRowId) => {
        setIdToDelete(id)
        setOpenDialogDelete(true)
    }

    return (
      	<React.Fragment>
            <MyTabs
                panels={[
                    {
                        label: 'Nuevas',
                        content: <RequestState 
                        state='1' 
                        handleDelete={handleDelete}
                        handleDetails={handleDetails}
                        subjects={subjects}/>,
                    },
                    {
                        label: 'Asignadas',
                        content: <RequestState 
                        handleDelete={handleDelete}
                        handleDetails={handleDetails}
                        state='2' 
                        subjects={subjects}/>,
                    },
                    {
                        label: 'Terminadas',
                        content: <RequestState 
                        handleDelete={handleDelete}
                        handleDetails={handleDetails}
                        state='3' 
                        subjects={subjects}/>,
                    }
                ]}
                    />
                    <MyDialog
                        type="ALERT"
                        title="Borrar Registro"
                        open={openDialogDelete}
                        content='Confirma borrar el registro?'
                        setOpen={setOpenDialogDelete}
                        actionFunc={handleConfirmDelete}
                    />
        </React.Fragment>
    )
}
