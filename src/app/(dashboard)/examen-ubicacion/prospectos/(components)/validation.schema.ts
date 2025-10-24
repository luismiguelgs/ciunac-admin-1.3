import * as yup from 'yup'
import  IProspecto  from '../../../../../interfaces/prospecto.interface'

const msgReq = 'Campo requerido'
const msgDni = 'Campo de 8 caracteres'

const validationSchema = yup.object<IProspecto>({
    dni: yup.string().required(msgReq).trim().min(8,msgDni).max(8, msgDni),
    apellidos: yup.string().required(msgReq).trim(),
    nombres: yup.string().trim().required(msgReq),
    telefono: yup.string().trim().required(msgReq),
    facultad: yup.string().trim().required(msgReq),
    email: yup.string().email(),
    trabajador: yup.boolean().required()
})

export default validationSchema