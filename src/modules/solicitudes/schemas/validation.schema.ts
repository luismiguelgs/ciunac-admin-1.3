import { Isolicitud } from "@/modules/solicitudes/interfaces/solicitud.interface"
import * as yup from 'yup'

const msgReq = 'Campo requerido'

export const validationSchemaFinance = yup.object<Isolicitud>({
    tipoSolicitudId: yup.number().required(msgReq),
    estadoId: yup.number().required(msgReq),
    idiomaId: yup.number().required(msgReq),
    nivelId: yup.number().required(msgReq),
    numeroVoucher: yup.string().required(msgReq),
    pago: yup.number().required(msgReq),
    fechaPago: yup.date().required(msgReq),
})

export const validationSchemaBasic = yup.object<Isolicitud>({
    apellidos: yup.string().required(msgReq),
    nombres: yup.string().required(msgReq),
    dni: yup.string().required(msgReq),
    celular : yup.string().required(msgReq),
})