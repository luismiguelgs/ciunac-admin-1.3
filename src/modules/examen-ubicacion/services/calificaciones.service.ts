import { apiFetch , CRUD, errorHandler} from "@/lib/api.service";
import ICalificacionUbicacion from "../interfaces/calificacion.interface";

export default class CalificacionesService
{
    // Funciones Generales *************************************
    private static dbCollection = 'calificacionesubicacion'

    public static async fetchItems(): Promise<ICalificacionUbicacion[] | undefined> 
    {
        try{
            const data = await apiFetch<ICalificacionUbicacion[]>(this.dbCollection, 'GET')
            return data
        }
        catch(err){
            errorHandler(err, CRUD.READ)
        }
    }

    public static async getById(id: number): Promise<ICalificacionUbicacion | undefined> 
    {
        try{
            const data = await apiFetch<ICalificacionUbicacion>(`${this.dbCollection}/${id}`, 'GET')
            return data
        }
        catch(err){
            errorHandler(err, CRUD.READ)
        }
    }
    
    public static async create (obj: ICalificacionUbicacion): Promise<undefined | ICalificacionUbicacion> 
    {
        try{
            const rest = {
                cicloId: obj.cicloId,
                idiomaId: obj.idiomaId,
                nivelId: obj.nivelId,
                notaMin: obj.notaMin,
                notaMax: obj.notaMax
            }
            const data = await apiFetch<ICalificacionUbicacion>(this.dbCollection, 'POST', rest)
            return data
        }catch(err){
            errorHandler(err, CRUD.CREATE)
        }
    }

    public static async update(id: number, obj: ICalificacionUbicacion): Promise<void> 
    {
        try {
            const rest = {
                cicloId: obj.cicloId,
                idiomaId: obj.idiomaId,
                nivelId: obj.nivelId,
                notaMin: obj.notaMin,
                notaMax: obj.notaMax
            }
            await apiFetch<ICalificacionUbicacion>(`${this.dbCollection}/${id}`, 'PATCH', rest)
            console.info('Elemento actualizado correctamente');
        } catch (err) {
            errorHandler(err, CRUD.UPDATE)
        }
    }

    public static async delete(id: number): Promise<void> 
    {
        try {
            await apiFetch(`${this.dbCollection}/${id}`, 'DELETE')
            console.info('Elemento borrado correctamente');
        } catch (err) {
            errorHandler(err, CRUD.DELETE)
        }
    }

    
}