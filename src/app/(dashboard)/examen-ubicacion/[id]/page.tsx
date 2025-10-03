'use client'
import useStore from '@/hooks/useStore'
import { Icalificacion } from '@/interfaces/calificacion.interface'
import { Iexamen, IexamenNotas } from '@/interfaces/examen.interface'
import { Iprofesor } from '@/interfaces/profesores.interface'
import { Isalon } from '@/modules/opciones/interfaces/types.interface'
import { CalificacionesService } from '@/services/calificaciones.service'
import { ExamenesService, Collection as CollectionExam } from '@/services/examenes.service'
import { Collection, OpcionesService } from '@/services/opciones.service'
import ProfesoresService from '@/services/profesores.service'
import { useSubjectsStore } from '@/modules/opciones/store/types.stores'
import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import React from 'react'
import ExamForm from '../(components)/ExamForm'
import ExamParticipants from '../(components)/ExamParticipants'
import { MyDialog } from '@/components/MUI'
import { PDFViewer } from '@react-pdf/renderer'
import ActaFormat from '../(components)/ActaFormat'
import dayjs from 'dayjs'
import 'dayjs/locale/es';
dayjs.locale('es');

export default function ExamDetailPage(params:{params:{id:string}}) 
{
    const id = params.params.id
    const navigate = useRouter()
    const subjects = useStore(useSubjectsStore, (state) => state.subjects)

    const [profesores, setProfesores] = React.useState<Iprofesor[]>([])
    const [salones, setSalones] = React.useState<Isalon[]>([])
    const [calificaciones, setCalificaciones] = React.useState<Icalificacion[]>()
    const [participantes, setParticipantes] = React.useState<IexamenNotas[]>([])
    const [data, setData] = React.useState<Iexamen | undefined>()
    const [open, setOpen] = React.useState<boolean>(false)
    const [calificacionesId, setCalificacionesId] = React.useState<string>('')
    const [profesor, setProfesor] = React.useState<string>('')

    React.useEffect(()=>{
        const loadData = async (id:string|undefined) =>{
            const dataProfesores = await ProfesoresService.fetchItems()
            const dataSalones = await OpcionesService.fetchItems<Isalon>(Collection.Salones)
            const dataCalificaciones = await CalificacionesService.fetchItems()
            setProfesores(dataProfesores)
            setSalones(dataSalones)
            setCalificaciones(dataCalificaciones)
            const data = await ExamenesService.selectItem(id as string)
            setData(data)
            const participantes = await ExamenesService.fetchItemsDetail(id as string)
            setParticipantes(participantes)
            setCalificacionesId(data?.calificacion_id ?? '')
        }
        loadData(id)
    },[])

    const handleClickActa = () => {
        const item = profesores.filter(item => item.id === data?.profesor_id)[0]
        setProfesor(`${item.nombres} ${item.apellidos}`)
        setOpen(true)
    }
    const handleClickSave = async(values:Iexamen) => {
        setCalificacionesId(values.calificacion_id)
        await ExamenesService.updateItem(CollectionExam.Examenes, {...values, id:id})
        navigate.back()
    }

    return (
        <Box>
            <Typography variant='h5' gutterBottom>Examen Detalle ({id})</Typography>
            {
                data ? 
                <ExamForm 
                    ID={id}
                    salones={salones}
                    profesores={profesores}
                    data={data}
                    calificaciones={calificaciones}
                    handleClickActa={handleClickActa}
                    handleClickSave={handleClickSave}
                /> : <Typography variant='h6' gutterBottom>Loading...</Typography>
            }
            { calificacionesId && <ExamParticipants id={id} idioma={data?.idioma} />  }
            <MyDialog 
                open={open}
                type='SIMPLE'
                title='ACTA DEL EXAMEN'
                setOpen={setOpen}
                content={<>
                    <PDFViewer width={800} height={500}>
				        <ActaFormat
                            data={participantes} 
                            fecha={dayjs(new Date(data?.fecha_examen.seconds * 1000)).format('D [de] MMMM [de] YYYY' )} 
                            idioma={subjects?.filter(item=>item.value === data?.idioma)[0]?.label} 
                            profesor={profesor} />
			        </PDFViewer>
                </>}
            />
        </Box>
    )
}
