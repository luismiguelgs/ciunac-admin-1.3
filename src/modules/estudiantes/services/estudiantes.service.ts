import IEstudiante from "../interfaces/estudiante.interface";
import { apiFetch } from "@/lib/api.service";


const collection = 'estudiantes'

export default class EstudiantesService {
    static async fetchItemByDNI(dni: string): Promise<IEstudiante> {
        const data = await apiFetch<IEstudiante>(`${collection}/buscar/${dni}`, 'GET')
        return data
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async updateItem(id: string, body: any): Promise<IEstudiante> {
        const estudianteData: any = {}
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async newItem(body: any): Promise<IEstudiante> {
        const estudianteData = {
            nombres: body.nombres,
            apellidos: body.apellidos,
            tipoDocumento: body.tipoDocumento,
            numeroDocumento: body.dni,
            celular: body.celular,
            facultadId: Number(body.facultad) ? Number(body.facultad) : null,
            escuelaId: Number(body.escuela) ? Number(body.escuela) : null,
            codigo: body.codigo
        } as unknown as IEstudiante

        console.log(estudianteData)

        const data = await apiFetch<IEstudiante>(`${collection}`, 'POST', estudianteData)
        return data
    }
}
