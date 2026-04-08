import IEstudiante from "../interfaces/estudiante.interface";
import { apiFetch } from "@/lib/api.service";


const collection = 'estudiantes'

interface IEstudianteInput {
    nombres?: string;
    apellidos?: string;
    tipo_documento?: string;
    tipoDocumento?: string;
    dni?: string;
    celular?: string;
    facultad?: string | number;
    escuela?: string | number;
    codigo?: string;
}

export default class EstudiantesService {
    static async fetchItemByDNI(dni: string): Promise<IEstudiante> {
        const data = await apiFetch<IEstudiante>(`${collection}/buscar/${dni}`, 'GET')
        return data
    }

    static async updateItem(id: string, body: IEstudianteInput): Promise<IEstudiante> {
        const estudianteData: Partial<IEstudiante> = {}
        if (body.nombres) estudianteData.nombres = body.nombres
        if (body.apellidos) estudianteData.apellidos = body.apellidos
        if (body.tipo_documento) estudianteData.tipoDocumento = body.tipo_documento
        if (body.dni) estudianteData.numeroDocumento = body.dni
        if (body.celular) estudianteData.celular = body.celular
        if (body.facultad) estudianteData.facultadId = Number(body.facultad)
        if (body.escuela) estudianteData.escuelaId = Number(body.escuela)
        if (body.codigo) estudianteData.codigo = body.codigo

        const data = await apiFetch<IEstudiante>(`${collection}/${id}`, 'PATCH', estudianteData)
        return data
    }

    static async newItem(body: IEstudianteInput): Promise<IEstudiante> {
        const estudianteData: IEstudiante = {
            nombres: body.nombres || '',
            apellidos: body.apellidos || '',
            tipoDocumento: body.tipoDocumento || body.tipo_documento,
            numeroDocumento: body.dni || '',
            celular: body.celular || '',
            facultadId: Number(body.facultad) ? Number(body.facultad) : undefined,
            escuelaId: Number(body.escuela) ? Number(body.escuela) : undefined,
            codigo: body.codigo
        }

        console.log(estudianteData)

        const data = await apiFetch<IEstudiante>(`${collection}`, 'POST', estudianteData)
        return data
    }
}
