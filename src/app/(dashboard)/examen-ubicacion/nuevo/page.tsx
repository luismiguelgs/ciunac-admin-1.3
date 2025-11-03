'use client'
import { Box } from '@mui/material'
import { useRouter } from 'next/navigation'
import React from 'react'
import ExamForm from '@/modules/examen-ubicacion/components/main/ExamForm'
import ExamParticipants from '@/modules/examen-ubicacion/components/main/ExamParticipants'
import useProfesores from '@/modules/examen-ubicacion/hooks/useProfesores'
import useOpciones from '@/modules/opciones/hooks/use-opciones'
import { Collection } from '@/modules/opciones/services/opciones.service'
import { IExamenUbicacion } from '@/modules/examen-ubicacion/interfaces/examen-ubicacion.interface'
import ExamenesUbicacionService from '@/modules/examen-ubicacion/services/examenes-ubicacion.service'
import { ISalon } from '@/modules/opciones/interfaces/types.interface'
import { IProfesor } from '@/modules/examen-ubicacion/interfaces/profesores.interface'

const ID = 'nuevo'

export default function NewUbicationExamPage() 
{
	
	const navigate = useRouter()
    const {data:profesores} = useProfesores()
    const {data:salones} = useOpciones(Collection.Salones)
    const handleClickActa = () => {
        //setOpen(true)
    }
    const handleClickSave = async(values:IExamenUbicacion) => {
        const res = await ExamenesUbicacionService.create(values)
        navigate.push(`/examen-ubicacion/${res?.id}`)
    }
	return (
		<Box>
            <ExamForm 
                ID={ID}
                salones={ salones as ISalon[]}
                profesores={profesores as IProfesor[]}
                handleClickSave={handleClickSave}
                handleClickActa={handleClickActa} />
            <ExamParticipants id={ID} />          
        </Box>
	)
}
