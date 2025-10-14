import { ICertificado } from '@/modules/certificados/interfaces/certificado.interface'
import * as yup from 'yup'

const msgReq = 'Campo requerido'

const validationSchema = yup.object<ICertificado>({
    estudiante: yup.string().required(msgReq),
    tipo: yup.string().trim().required(msgReq),
    numeroDocumento: yup.string().required(msgReq),
    fechaEmision: yup.date().required(msgReq),
    fechaConcluido: yup.date().required(msgReq),
    idioma: yup.string().required(msgReq),
    nivel: yup.string().trim().required(msgReq),
    numeroRegistro: yup.string().trim().required(msgReq),
    cantidadHoras: yup.number().required(msgReq).max(400).min(100, 'Mínimo 100 horas'),
    elaboradoPor: yup.string().trim(),
    curriculaAnterior: yup.boolean(),
    duplicado : yup.boolean(),
    url : yup.string().trim().when('tipo', {
        is: 'FISICO',
        then: (schema:yup.Schema) => schema.optional().nullable(),
        otherwise: (schema:yup.Schema)=> schema.required(msgReq),
    }),
    solicitudId: yup.number(),
    certificadoOriginal: yup.string().trim().when('duplicado', {
        is: true,
        then: (schema:yup.Schema)=> schema.required(msgReq),
        otherwise: (schema:yup.Schema) => schema.optional().nullable(),
    })
})

const initialValues:ICertificado ={
    estudiante: '',
    numeroDocumento: '',
    idioma: '1',
    impreso: false,
    nivel: '',
    tipo: 'FISICO',
    fechaEmision: new Date(),
    fechaConcluido: new Date(),
    cantidadHoras: 0,
    elaboradoPor: '',
    numeroRegistro: 'B00 -Folio',
    curriculaAnterior: false,
    duplicado: false,
    certificadoOriginal: '',
    solicitudId: 0,
    url: '',
    periodo: '',
    notas: []
}

export { initialValues, validationSchema }