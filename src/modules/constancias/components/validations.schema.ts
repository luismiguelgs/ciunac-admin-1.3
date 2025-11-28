import { IConstancia } from '@/modules/constancias/interfaces/constancia.interface'
import * as yup from 'yup'

const msgReq = 'Campo requerido'

const validationSchema = yup.object<IConstancia>({
    estudiante: yup.string().required(msgReq),
    dni: yup.string().required(msgReq),
    idioma: yup.string().trim().required(msgReq),
    nivel: yup.string().trim().required(msgReq),
    tipo: yup.string().trim().required(msgReq),
    ciclo: yup.string().trim().required(msgReq),
    modalidad: yup.string().trim().when('tipo', {
        is: 'MATRICULA',
        then: (schema:yup.Schema)=> schema.required(msgReq),
        otherwise: (schema:yup.Schema) => schema.optional().nullable(),
    }),
    impreso : yup.boolean(),
    solicitud_id: yup.number(),
    horario: yup.string().trim().when('tipo', {
        is: 'MATRICULA',
        then: (schema:yup.Schema)=> schema.required(msgReq),
        otherwise: (schema:yup.Schema) => schema.optional().nullable(),
    })
})

const initialValues:IConstancia ={
    estudiante: '',
    idioma: '',
    impreso: false,
    modalidad: 'REGULAR',
    nivel : '',
    tipo: 'MATRICULA',
    ciclo: '',
    dni: '',
    solicitud_id: 0,
    horario: '',
}

export { initialValues, validationSchema }