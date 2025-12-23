'use client'
import { MyDialog } from '@/components/MUI'
import { Isolicitud } from '@/modules/solicitudes/interfaces/solicitud.interface'
import SolicitudesService from '@/modules/solicitudes/services/solicitud.service'
import React from 'react'
import FormNuevaSolicitud from '@/modules/solicitudes/certificados/components/FormNuevaSolicitud'
import LoadingDialog from '@/components/MUI/Dialogs/DialogLoading'
import EstudiantesService from '@/modules/estudiantes/services/estudiantes.service'

export default function NewRequestPage() {
    //dialogo
    const [open, setOpen] = React.useState<boolean>(false)
    const [loading, setLoading] = React.useState<boolean>(false)

    const onSubmit = async (values: Isolicitud) => {
        setLoading(true)

        let estudianteId = null
        if (values.estudianteId) {
            estudianteId = values.estudianteId
        }

        if (estudianteId) {
            await EstudiantesService.updateItem(estudianteId, values)
        } else {
            const res = await EstudiantesService.newItem(values)
            estudianteId = res.id
        }

        const solicitud = { ...values, estudianteId } as Isolicitud
        console.log(solicitud)
        await SolicitudesService.newItem(solicitud)
        setLoading(false)
        setOpen(true)
    }

    return (
        <>
            <FormNuevaSolicitud onSubmit={onSubmit} />
            <LoadingDialog
                open={loading}
                message='Guardando Solicitud...'
            />
            <MyDialog
                open={open}
                setOpen={setOpen}
                content='Solicitud Guardada !'
                title='Nueva Solicitud'
                type='SIMPLE' />
        </>
    )
}
