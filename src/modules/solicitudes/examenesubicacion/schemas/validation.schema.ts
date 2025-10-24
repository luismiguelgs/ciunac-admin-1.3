import * as yup from 'yup'
import { ISolicitudRes } from "../../interfaces/solicitudres.interface"

const msgReq = 'Campo requerido'

const validationSchema = yup.object<Partial<ISolicitudRes>>({
    tipoSolicitudId: yup.string().required(msgReq),
    estadoId: yup.string().required(msgReq),
    idiomaId: yup.string().required(msgReq),
    nivelId: yup.string().required(msgReq),
    numeroVoucher: yup.string().trim().when('trabajador',{
        is: true,
        then: (schema:yup.Schema) => schema.optional().nullable(),
        otherwise: (schema:yup.Schema)=> schema.required(msgReq),
    }),
    pago: yup.number().when('trabajador', {
        is: true,
        then: (schema:yup.Schema) => schema.optional().nullable(),
        otherwise: (schema: yup.Schema) => schema.required(msgReq)
    }),
    fechaPago: yup.date().when('trabajador',{
        is:true,
        then: (schema:yup.Schema) => schema.optional().nullable(),
        otherwise: (schema:yup.Schema) => schema.required(msgReq)
    })
})

export default validationSchema