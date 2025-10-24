import { Isolicitud } from '@/modules/solicitudes/interfaces/solicitud.interface'
import { obtenerPeriodo } from '@/lib/utils'
import * as yup from 'yup'
import dayjs from 'dayjs'

const msgReq = 'Campo requerido'
const msgDni = 'Campo de 8 caracteres'

const validationSchema = yup.object<Isolicitud>({
    estudianteId: yup.string().trim(),
    apellidos: yup.string().required(msgReq).trim(),
    nombres: yup.string().trim().required(msgReq),
    solicitud: yup.string().trim().required(msgReq),
    celular: yup.string().trim().required(msgReq).min(11,'El campo requiere 9 caracteres'),
    dni: yup.string().trim().required(msgReq).min(8,msgDni),
    tipoDocumento: yup.string().trim().required(msgReq),
    idioma: yup.string().trim().required(msgReq),
    nivel: yup.string().trim().default('1'),
    facultad: yup.string().trim(),
    escuela: yup.string().trim(),
    codigo: yup.string().trim(),
    numero_voucher: yup.string().trim().required(msgReq),
    pago: yup.number().required(msgReq),
    fecha_pago: yup.date().required(msgReq),
    digital: yup.boolean().required(msgReq),
});
const initialValues: Isolicitud = {
    solicitud: '1',
    digital: false,
    estudianteId: '',
    tipoDocumento: 'DNI',
    apellidos: '',
    nombres: '',
    celular: '',
    dni: '',
    periodo: obtenerPeriodo(),
    idioma: '',
    nivel: '1',
    facultad: '',
    escuela: '',
    codigo: '',
    numero_voucher: '',
    pago: '50',
    fecha_pago: dayjs(new Date()),
}

export {validationSchema, initialValues}