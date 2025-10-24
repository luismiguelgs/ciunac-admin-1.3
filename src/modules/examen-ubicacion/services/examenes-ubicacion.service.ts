import { apiFetch , CRUD, errorHandler} from "@/lib/api.service";
import {IExamenUbicacion, IDetalleExamenUbicacion} from "../interfaces/examen-ubicacion.interface";


export default class ExamenesUbicacionService
{
    private static dbExamenesUbicacion = 'examenesubicacion'
    private static dbDetalleExamenesUbicacion = 'detalleexamenesubicacion'

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
            const data = await apiFetch<IExamenUbicacion>(`${this.dbExamenesUbicacion}/${id}`, 'PATCH', obj)
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
    public static async fetchItemsDetail(id: number): Promise<IDetalleExamenUbicacion[] | undefined> 
    {
        try{
            const data = await apiFetch<IDetalleExamenUbicacion[]>(`${this.dbDetalleExamenesUbicacion}/${id}`, 'GET')
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
            const data = await apiFetch<IDetalleExamenUbicacion>(`${this.dbDetalleExamenesUbicacion}/${id}`, 'PATCH', obj)
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