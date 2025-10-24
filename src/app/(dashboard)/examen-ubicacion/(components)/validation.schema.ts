import { Iexamen } from '../../../../modules/examen-ubicacion/interfaces/examen-ubicacion.interface'
import * as yup from 'yup'

const msgReq = 'Campo requerido'

const validationSchema = yup.object<Iexamen>({
    fecha_examen: yup.date().required(msgReq),
    estado: yup.string().required(msgReq),
    fecha_final: yup.date().required(msgReq),
    salon: yup.string().required(msgReq).trim(),
    profesor_id: yup.string().trim().required(msgReq),
    idioma: yup.string().trim().required(msgReq),
    nivel: yup.string().trim().required(msgReq),
    calificacion_id: yup.string().trim().required(msgReq),
    codigo: yup.string().required(msgReq).trim(),
})

export default validationSchema