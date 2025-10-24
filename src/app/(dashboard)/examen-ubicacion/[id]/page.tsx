'use client'
import useStore from '@/hooks/useStore'
import { ISalon } from '@/modules/opciones/interfaces/types.interface'
import ExamenesUbicacionService from '@/modules/examen-ubicacion/services/examenes-ubicacion.service'
import OpcionesService, { Collection } from '@/modules/opciones/services/opciones.service'
import ProfesoresService from '@/modules/examen-ubicacion/services/profesores.service'
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
import { IProfesor } from '@/modules/examen-ubicacion/interfaces/profesores.interface'
import ICalificacionUbicacion from '@/modules/examen-ubicacion/interfaces/calificacion.interface'
import { IDetalleExamenUbicacion, IExamenUbicacion } from '@/modules/examen-ubicacion/interfaces/examen-ubicacion.interface'
import CalificacionesService from '@/modules/examen-ubicacion/services/calificaciones.service'
dayjs.locale('es');

export default function ExamDetailPage(params:{params:{id:string}}) 
{
    const id = params.params.id
    const navigate = useRouter()
    const subjects = useStore(useSubjectsStore, (state) => state.subjects)

    const [profesores, setProfesores] = React.useState<IProfesor[]>([])
    const [salones, setSalones] = React.useState<ISalon[]>([])
    const [calificaciones, setCalificaciones] = React.useState<ICalificacionUbicacion[]>()
    const [participantes, setParticipantes] = React.useState<IDetalleExamenUbicacion[]>([])
    const [data, setData] = React.useState<IExamenUbicacion | undefined>()
    const [open, setOpen] = React.useState<boolean>(false)
    const [calificacionesId, setCalificacionesId] = React.useState<string>('')
    const [profesor, setProfesor] = React.useState<string>('')

    React.useEffect(()=>{
        const loadData = async (id:number|undefined) =>{
            const dataProfesores = await ProfesoresService.fetchItems()
            const dataSalones = await OpcionesService.fetchItems<ISalon>(Collection.Salones)
            const dataCalificaciones = await CalificacionesService.fetchItems()
            setProfesores(dataProfesores as IProfesor[])
            setSalones(dataSalones as ISalon[])
            setCalificaciones(dataCalificaciones as ICalificacionUbicacion[])
            const data = await ExamenesUbicacionService.getById(id as number)
            setData(data)
            const participantes = await ExamenesUbicacionService.fetchItemsDetail(id as number)
            setParticipantes(participantes as IDetalleExamenUbicacion[])
        }
        loadData(Number(id))
    },[])

    const handleClickActa = () => {
        const item = profesores.filter(item => item.id === data?.docenteId)[0]
        setProfesor(`${item.nombres} ${item.apellidos}`)
        setOpen(true)
    }
    const handleClickSave = async(values:IExamenUbicacion) => {
        await ExamenesUbicacionService.update(values.id as number, {...values, id:Number(id)})
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
            { calificacionesId && <ExamParticipants id={id} idioma={data?.idioma?.nombre} />  }
            <MyDialog 
                open={open}
                type='SIMPLE'
                title='ACTA DEL EXAMEN'
                setOpen={setOpen}
                content={<>
                    <PDFViewer width={800} height={500}>
				        <ActaFormat
                            data={participantes} 
                            fecha={dayjs(new Date(data?.fecha ?? '')).format('D [de] MMMM [de] YYYY' )} 
                            idioma={subjects?.filter(item=>item.id === data?.idiomaId)[0]?.nombre} 
                            profesor={profesor} />
			        </PDFViewer>
                </>}
            />
        </Box>
    )
}
