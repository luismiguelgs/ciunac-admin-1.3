import { apiFetch, omit } from '@/lib/api.service';
import { IProfesor } from '@/modules/examen-ubicacion/interfaces/profesores.interface';

export default class ProfesoresService
{
    
    private static collection = 'docentes'

    static async fetchItems<IProfesor>():Promise<IProfesor[]>{
        const data = await apiFetch<IProfesor[]>(this.collection, 'GET')
        return data
    }

    public static async getItem(id:string):Promise<IProfesor>{
        const data = await apiFetch<IProfesor>(`${this.collection}/${id}`, 'GET')
        return data
    }
    
    public static async newItem<IProfesor extends {id?:string, isNew?:boolean}>
    (item:IProfesor) :Promise<IProfesor>
    { 
        const rest = omit(item, ['isNew','id']);
        const data = await apiFetch<Omit<IProfesor, 'isNew' | 'id'>>(this.collection, 'POST', rest)
        return data as IProfesor
    }

    public static async updateItem<IProfesor extends {id?:string, isNew?:boolean}>
    (item:IProfesor): Promise<IProfesor> {
        const rest = omit(item, ['isNew','id']);
        const data = await apiFetch<Omit<IProfesor, 'isNew' | 'id'>>(`${this.collection}/${item.id}`, 'PATCH', rest)
        return data as IProfesor
    }

    public static async deleteItem(id:string | undefined) : Promise<void>{
        const data = await apiFetch<void>(`${this.collection}/${id}`, 'DELETE')
        return data
    }
}