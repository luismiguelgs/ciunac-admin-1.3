import { apiFetch, omit } from '@/lib/api.service';
import IcronogramaExam from '@/modules/examen-ubicacion/interfaces/cronogramaExam.interface';

enum CRUD {
    CREATE = 'create',
    READ = 'read',
    UPDATE = 'update',
    DELETE = 'delete'
}

export default class CronogramaExamService
{
    private static collection = 'cronogramaubicacion'

    public static async fetchItems(): Promise<IcronogramaExam[] | undefined> 
    {
        try{
            const data = await apiFetch<IcronogramaExam[]>(this.collection, 'GET')
            return data
        }
        catch(err){
            this.errorHandler(err, CRUD.READ)
        }
    }

    public static async getById(id: number): Promise<IcronogramaExam | undefined> 
    {
        try{
            const data = await apiFetch<IcronogramaExam>(`${this.collection}/${id}`, 'GET')
            return data
        }
        catch(err){
            this.errorHandler(err, CRUD.READ)
        }
    }

    public static async create<ICronogramaExam extends {id?:number, isNew?:boolean, creadoEn?: unknown, modificadoEn?: unknown}>
    (obj: ICronogramaExam): Promise<undefined | ICronogramaExam> {
        try{
            const rest = omit(obj, ['isNew','id','creadoEn','modificadoEn']);
            const data = await apiFetch<Omit<ICronogramaExam, 'isNew' | 'id' >>(this.collection, 'POST', rest)
            return data as ICronogramaExam
        }catch(err){
            this.errorHandler(err, CRUD.CREATE)
        }
    }

    public static async update<ICronogramaExam extends {id?:number, isNew?:boolean, modulo?: unknown, creadoEn?: unknown, modificadoEn?: unknown}>
    (id: number, obj: ICronogramaExam): Promise<void> 
    {
        try {
            const rest = omit(obj, ['isNew','id','modulo','creadoEn','modificadoEn']);
            await apiFetch<Omit<ICronogramaExam, 'isNew' | 'id'>>(`${this.collection}/${id}`, 'PATCH', rest)
            console.info('Elemento actualizado correctamente');
        } catch (err) {
            this.errorHandler(err, CRUD.UPDATE)
        }
    }
    public static async updateStatus<ICronogramaExam extends {id?:number, isNew?:boolean}>
    (id: number, status: boolean): Promise<void> {
        try {
            await apiFetch<Omit<ICronogramaExam, 'isNew' | 'id'>>(`${this.collection}/${id}`, 'PATCH', {activo: status})
            console.info('Elemento actualizado correctamente');
        } catch (err) {
            this.errorHandler(err, CRUD.UPDATE)
        }
    }

    public static async delete(id: number): Promise<void> {
        try{
            await apiFetch(`${this.collection}/${id}`, 'DELETE')
            console.info('registro borrado', id)
        }
        catch(err){
           this.errorHandler(err, CRUD.DELETE)
        }
    }
    private static errorHandler(err: unknown, operation:string): void {
        if (err instanceof Error) {
            switch (operation){
                case CRUD.CREATE:
                    console.error('Error al crear el elemento:', err.message); 
                    break;
                case CRUD.UPDATE:
                    console.error('Error al actualizar el elemento:', err.message);
                    break;
                case CRUD.DELETE:
                    console.error('Error al borrar el elemento:', err.message);
                    break;
                case CRUD.READ:
                    console.error('Error al cargar el elemento:', err.message);
                    break;
            }
        } else {
            console.error('Error desconocido al actualizar el elemento:', err);
        }
        throw err
    }
}
