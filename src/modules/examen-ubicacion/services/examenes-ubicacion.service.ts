import { apiFetch , CRUD, errorHandler} from "@/lib/api.service";
import {IExamenUbicacion, IDetalleExamenUbicacion} from "../interfaces/examen-ubicacion.interface";


export default class ExamenesUbicacionService
{
    private static dbExamenesUbicacion = 'examenesubicacion'
    private static dbDetalleExamenesUbicacion = 'detallesubicacion'

    //Examenes Ubicacion *********************************************************************************
    public static async fetchItems(): Promise<IExamenUbicacion[] | undefined> 
    {
        try{
            const data = await apiFetch<IExamenUbicacion[]>(this.dbExamenesUbicacion, 'GET')
            return data
        }
        catch(err){
            errorHandler(err, CRUD.READ)
        }
    }

    public static async getById(id: number): Promise<IExamenUbicacion | undefined> 
    {
        try{
            const data = await apiFetch<IExamenUbicacion>(`${this.dbExamenesUbicacion}/${id}`, 'GET')
            return data
        }
        catch(err){
            errorHandler(err, CRUD.READ)
        }
    }

    public static async create(obj: IExamenUbicacion): Promise<IExamenUbicacion | undefined> 
    {
        try{
            const data = await apiFetch<IExamenUbicacion>(this.dbExamenesUbicacion, 'POST', obj)
            return data
        }
        catch(err){
            errorHandler(err, CRUD.CREATE)
        }
    }

    public static async update(id: number, obj: IExamenUbicacion): Promise<void | IExamenUbicacion> 
    {
        try {
            const data = {...obj, fecha: new Date(obj.fecha as Date).toISOString()}
            console.log(id,data)
            const res = await apiFetch<IExamenUbicacion>(`${this.dbExamenesUbicacion}/${id}`, 'PATCH', data)
            return res
        } catch (err) {
            errorHandler(err, CRUD.UPDATE)
        }
    }

    public static async updateStatus(id: number, state: number): Promise<void | IExamenUbicacion> 
    {
        try {
            const data = await apiFetch<IExamenUbicacion>(`${this.dbExamenesUbicacion}/${id}`, 'PATCH', {estadoId: state})
            return data
        } catch (err) {
            errorHandler(err, CRUD.UPDATE)
        }
    }

    public static async delete(id: number): Promise<void> 
    {
        try {
            await apiFetch(`${this.dbExamenesUbicacion}/${id}`, 'DELETE')
            console.info('Elemento borrado correctamente');
        } catch (err) {
            errorHandler(err, CRUD.DELETE)
        }
    }

    //Detalle Examenes Ubicacion *****************************************************************************
    public static async fetchItemsDetail(id?: number): Promise<IDetalleExamenUbicacion[] | undefined> 
    {
        try{
            if(!id){
                const data = await apiFetch<IDetalleExamenUbicacion[]>(this.dbDetalleExamenesUbicacion, 'GET')
                return data
            }
            const data = await apiFetch<IDetalleExamenUbicacion[]>(`${this.dbDetalleExamenesUbicacion}/examen/${id}`, 'GET')
            return data
        }
        catch(err){
            errorHandler(err, CRUD.READ)
        }
    }

    public static async createDetail(obj: IDetalleExamenUbicacion): Promise<IDetalleExamenUbicacion | undefined> 
    {
        try{
            const data = await apiFetch<IDetalleExamenUbicacion>(this.dbDetalleExamenesUbicacion, 'POST', obj)
            return data
        }
        catch(err){
            errorHandler(err, CRUD.CREATE)
        }
    }

    public static async updateDetail(id: number, obj: IDetalleExamenUbicacion): Promise<void | IDetalleExamenUbicacion> 
    {
        try {
            const data = {
                activo: obj.activo,
                calificacionId: obj.calificacionId,
                terminado: obj.terminado,
                nota: Number(obj.nota),
                estudianteId: obj.estudianteId,
                examenId: obj.examenId,
                idiomaId: obj.idiomaId,
                nivelId: obj.nivelId,
                solicitudId: obj.solicitudId,
            }
            const res = await apiFetch<IDetalleExamenUbicacion>(`${this.dbDetalleExamenesUbicacion}/${id}`, 'PATCH', data)
            return res
        } catch (err) {
            errorHandler(err, CRUD.UPDATE)
        }
    }
    public static async updateDetailStatus(id: number, terminado: boolean): Promise<void | IDetalleExamenUbicacion> 
    {
        try {
            const data = await apiFetch<IDetalleExamenUbicacion>(`${this.dbDetalleExamenesUbicacion}/${id}`, 'PATCH', {terminado: terminado})
            return data
        } catch (err) {
            errorHandler(err, CRUD.UPDATE)
        }
    }

    public static async deleteDetail(id: number): Promise<void> 
    {
        try {
            await apiFetch(`${this.dbDetalleExamenesUbicacion}/${id}`, 'DELETE')
            console.info('Elemento borrado correctamente');
        } catch (err) {
            errorHandler(err, CRUD.DELETE)
        }
    }
}