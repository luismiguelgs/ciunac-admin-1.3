'use client'
import { MyDialog, MyTabs } from '@/components/MUI'
import SolicitudesService from '@/services/solicitudes.service';
import React from 'react'
import DialogFull from "@/components/MUI/Dialogs/DialogFull";
import { GridRowId } from '@mui/x-data-grid';
import useStore from '@/hooks/useStore';
import { useDocumentsStore, useSubjectsStore } from '@/modules/opciones/store/types.stores';
import { RequestState } from '@/modules/solicitudes/constancias/RequestStage';
import RequestDetail from '@/modules/solicitudes/constancias/RequestDetail';


export default function RequestsConstansPage() 
{
	//HOOKS **************************************************
    const documents = useStore(useDocumentsStore, (state) => state.documents)
    const subjects = useStore(useSubjectsStore, (state) => state.subjects)

    const [ID, setID] = React.useState<string| undefined>(''); //Dialog
    const [openDialogDelete, setOpenDialogDelete] = React.useState<boolean>(false);
    const [openDialogFullDetail, setOpenDialogFullDetail] = React.useState<boolean>(false);

	//FUNCTIONS ***********************************************
    const handleDelete = (id:GridRowId) =>{
        setID(id as string)
        setOpenDialogDelete(true)
    }
    const handleDetails = (id:GridRowId) =>{
        setOpenDialogFullDetail(true)
        setID(id as string)
    }
    const deleteFunc = () => {
        SolicitudesService.deleteItem(ID)
        setOpenDialogDelete(false)
    }

	return (
		<React.Fragment>
			<MyTabs
				panels={[
					{
						label: 'Nuevas',
						content: <RequestState 
                            state={1} //'NUEVO' 
                            handleDelete={handleDelete}
                            handleDetails={handleDetails}
                            documents={documents} 
                            subjects={subjects}/>,
					},
					{
						label: 'Elaboaradas',
						content: <RequestState 
                            handleDelete={handleDelete}
                            handleDetails={handleDetails}
                            state={2} //'ELABORADO' 
                            documents={documents} 
                            subjects={subjects}/>,
					},
					{
						label: 'Terminadas',
						content: <RequestState 
                            handleDelete={handleDelete}
                            handleDetails={handleDetails}
                            state={3} //'ENTREGADO' 
                            documents={documents} 
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
				actionFunc={deleteFunc}
        	/>
			<DialogFull 
				open={openDialogFullDetail} 
				setOpen={setOpenDialogFullDetail}
				title="Detalle de Solicitud"
				content={<RequestDetail
					id={ID as string} 
            	/>}
        	/>
		</React.Fragment>
	)
}
