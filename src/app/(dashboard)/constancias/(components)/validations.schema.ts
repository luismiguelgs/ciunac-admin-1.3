import { Iconstancia } from '../../../../interfaces/constancia.interface'
import * as yup from 'yup'

const msgReq = 'Campo requerido'

const validationSchema = yup.object<Iconstancia>({
    estudiante: yup.string().required(msgReq),
    dni: yup.date().required(msgReq),
    idioma: yup.string().trim().required(msgReq),
    nivel: yup.string().trim().required(msgReq),
    ciclo: yup.string().trim().required(msgReq),
    modalidad: yup.string().trim().when('tipo', {
        is: 'CONSTANCIA_MATRICULA',
        then: (schema:yup.Schema)=> schema.required(msgReq),
        otherwise: (schema:yup.Schema) => schema.optional().nullable(),
    }),
    impreso : yup.boolean(),
    id_solicitud: yup.string(),
    horario: yup.string().trim().when('tipo', {
        is: 'CONSTANCIA_MATRICULA',
        then: (schema:yup.Schema)=> schema.required(msgReq),
        otherwise: (schema:yup.Schema) => schema.optional().nullable(),
    })
})

const initialValues:Iconstancia ={
    estudiante: '',
    idioma: '',
    impreso: false,
    modalidad: 'REGULAR',
    nivel : '',
    tipo: 'CONSTANCIA_MATRICULA',
    ciclo: '',
    dni: '',
    id_solicitud: '',
    horario: '',
}

export { initialValues, validationSchema }