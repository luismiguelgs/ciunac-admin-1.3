'use client'
import { Icalificacion } from '../../../../modules/examen-ubicacion/interfaces/calificacion.interface'
import { Iexamen } from '../../../../modules/examen-ubicacion/interfaces/examen-ubicacion.interface'
import { Iprofesor } from '@/modules/examen-ubicacion/interfaces/profesores.interface'
import { Isalon } from '@/modules/opciones/interfaces/types.interface'
import { CalificacionesService } from '@/modules/examen-ubicacion/services/calificaciones.service'
import { ExamenesService, Collection as CollectionExam } from '@/services/examenes.service'
import { Collection, OpcionesService } from '@/services/opciones.service'
import ProfesoresService from '@/modules/examen-ubicacion/services/profesores.service'
import { Box } from '@mui/material'
import { useRouter } from 'next/navigation'
import React from 'react'
import ExamForm from '../(components)/ExamForm'
import ExamParticipants from '../(components)/ExamParticipants'

const ID = 'nuevo'

export default function NewUbicationExamPage() 
{
	
	const navigate = useRouter()
    const [profesores, setProfesores] = React.useState<Iprofesor[]>([])
    const [salones, setSalones] = React.useState<Isalon[]>([]) 
    const [calificaciones, setCalificaciones] = React.useState<Icalificacion[]>()
    //const [calificacionesId, setCalificacionesId] = React.useState<string>('')

    React.useEffect(()=>{
        const loadData = async () =>{
            const dataProfesores = await ProfesoresService.fetchItems()
            const dataSalones = await OpcionesService.fetchItems<Isalon>(Collection.Salones)
            const dataCalificaciones = await CalificacionesService.fetchItems()
            setProfesores(dataProfesores)
            setSalones(dataSalones)
            setCalificaciones(dataCalificaciones)
            console.log(profesores);
        }
        loadData()
    },[])
    
    
    const handleClickActa = () => {
        //setOpen(true)
    }
    const handleClickSave = async(values:Iexamen) => {
        //setCalificacionesId(values.calificacion_id)
        const id = await ExamenesService.newItem(CollectionExam.Examenes, values)
        navigate.push(`/examen-ubicacion/${id}`)
        //alert(JSON.stringify(examenData, null, 2))
    }
	return (
		<Box>
            <ExamForm 
                ID={ID}
                salones={salones}
                profesores={profesores}
                calificaciones={calificaciones}
                handleClickSave={handleClickSave}
                handleClickActa={handleClickActa} />
            <ExamParticipants id={ID} />          
        </Box>
	)
}
