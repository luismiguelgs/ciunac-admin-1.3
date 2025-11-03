import * as yup from 'yup'
import { IExamenUbicacion } from '../../interfaces/examen-ubicacion.interface'

const msgReq = 'Campo requerido'

const validationSchema = yup.object<IExamenUbicacion>({
    codigo: yup.string().required(msgReq).trim(),
    fecha: yup.date().required(msgReq),
    estadoId: yup.number().required(msgReq),
    idiomaId: yup.number().required(msgReq),
    docenteId: yup.string().required(msgReq).trim(),
    aulaId: yup.number().required(msgReq),
})

export default validationSchema