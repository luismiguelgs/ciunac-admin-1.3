import { Icertificado } from '@/modules/certificados/interfaces/certificado.interface'
import * as yup from 'yup'

const msgReq = 'Campo requerido'

const validationSchema = yup.object<Icertificado>({
    alumno: yup.string().required(msgReq),
    tipo: yup.string().trim().required(msgReq),
    dni: yup.string().required(msgReq),
    fecha_emision: yup.date().required(msgReq),
    fecha_conclusion: yup.date().required(msgReq),
    idioma: yup.string().trim().required(msgReq),
    nivel: yup.string().trim().required(msgReq),
    numero_registro: yup.string().trim().required(msgReq),
    horas: yup.number().required(msgReq).max(400).min(100, 'Mínimo 100 horas'),
    elaborador: yup.string().trim(),
    curricula_antigua: yup.boolean(),
    duplicado : yup.boolean(),
    url : yup.string().trim().when('tipo', {
        is: 'fisico',
        then: (schema:yup.Schema) => schema.optional().nullable(),
        otherwise: (schema:yup.Schema)=> schema.required(msgReq),
    }),
    id_solicitud: yup.string(),
    certificado_anterior: yup.string().trim().when('duplicado', {
        is: true,
        then: (schema:yup.Schema)=> schema.required(msgReq),
        otherwise: (schema:yup.Schema) => schema.optional().nullable(),
    })
})

const initialValues:Icertificado ={
    alumno: '',
    dni: '',
    idioma: '',
    impreso: false,
    nivel : '',
    tipo: 'fisico',
    fecha_emision: new Date(),
    fecha_conclusion: new Date(),
    horas: 0,
    elaborador: '',
    numero_registro: 'B00 -Folio',
    curricula_antigua: false,
    duplicado: false,
    certificado_anterior: '',
    id_solicitud: '',
    url: ''
}

export { initialValues, validationSchema }