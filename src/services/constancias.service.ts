import { Iconstancia, IconstanciaDetalle } from "../interfaces/constancia.interface";
import { firestore } from "@/lib/firebase";
import { changeDate } from "@/lib/utils";
import { addDoc, collection, getDoc, deleteDoc, doc, getDocs, serverTimestamp, Timestamp, updateDoc, query, where } from "firebase/firestore";

export enum Collection{
    CONSTANCIAS = 'constancias',
    CONSTANCIAS_NOTAS = 'constancias_notas'
}

export class ConstanciasService
{
    // Funciones Generales *************************************
    private static db(collectionName: Collection){
        return collection(firestore, collectionName)
    }
    public static async newItem(collectionName:Collection, obj: Iconstancia | IconstanciaDetalle): Promise<string | undefined>
    {
        let data:Iconstancia | IconstanciaDetalle;
        if('estudiante' in obj){
            data = {
                ...obj,
                createAt: serverTimestamp(),
                updateAt: serverTimestamp()
            }
        }else{
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { isNew, ...cleanObj } = obj;
            data = cleanObj;
        }

        let docRef = null
        try {
            docRef = await addDoc(this.db(collectionName), data)
        } catch (error) {
            console.log(error)
        }
        return docRef?.id
    }
    public static async updateItem(collectionName:Collection, obj: Iconstancia | IconstanciaDetalle): Promise<void>
    {
        type UpdateDataType = Partial<Iconstancia>  & Partial<IconstanciaDetalle> & { 
            modificado?: ReturnType<typeof serverTimestamp> 
        }

        let dataToUpdate: UpdateDataType;
        
        if ('estudiante' in obj) { //constancia
            const constanciaData = {
                ...obj,
                modificado: serverTimestamp()
            };
            // Explicitly cast to unknown first, then to UpdateDataType to avoid type checking errors
            dataToUpdate = constanciaData as unknown as UpdateDataType;
        } else { //constancia detalle
            const detalleData = { ...obj };
            // Explicitly cast to unknown first, then to UpdateDataType to avoid type checking errors
            dataToUpdate = detalleData as unknown as UpdateDataType;
        }
        const docRef = doc(firestore, collectionName, obj.id as string)

        try{
            await updateDoc(docRef, dataToUpdate)
            console.log('update',docRef.id);
        }catch(err){
            if (err instanceof Error) {
                console.error('Error al actualizar el elemento:', err.message);
            } else {
                console.error('Error desconocido al actualizar el elemento:', err);
            }
        }
    }
    public static async updateStatus(collectionName:Collection, id:string, status:boolean): Promise<void>
    {
        try{
            const docRef = doc(firestore, collectionName, id)
            await updateDoc(docRef, {
                impreso: status,
                modificado: serverTimestamp()
            })
        }catch(err){
            if (err instanceof Error) {
                console.error('Error al actualizar el elemento:', err.message);
            } else {
                console.error('Error desconocido al actualizar el elemento:', err);
            }
        }
    }
    public static async deleteItem(collectionName:Collection, id:string): Promise<void>
    {
        try {
            await deleteDoc(doc(firestore, collectionName, id))
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error al borrar el elemento:', error.message);
            } else {
                console.error('Error desconocido al borrar el elemento:', error);
            }
        }
    }
    //Constancias - funciones ****************************************
    public static async fetchItems(printed?:boolean): Promise<Iconstancia[]>
    {
        try{
            const snapShot = await getDocs(this.db(Collection.CONSTANCIAS))
            const data = snapShot.docs.map(doc => {
                const data = doc.data()
                return {
                    ...data,
                    id: doc.id,
                    createAt: data.createAt ? changeDate(data.createAt) : null,
                    updateAt: data.updateAt ? changeDate(data.updateAt) : null,
                } 
            })
            // Filtra según el valor de printed
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((item:any) => {
                return printed === true ? item.impreso === true : item.impreso === false;
            });
            
            return data as Iconstancia[];
        }
        catch(err){
            if (err instanceof Error) {
                console.error('Error al mostrar elementos:', err.message);
            } else {
                console.error('Error desconocido al mostrar elementos:', err);
            }
            throw err
        }
    }
    public static async selectItem(id:string):Promise<Iconstancia | undefined>
    {
        const docRef = doc(firestore, Collection.CONSTANCIAS, id)
        try{
            const snapShot = await getDoc(docRef)
            if(snapShot.exists()){
                const data = snapShot.data()
                return {
                    ...data,
                    id: snapShot.id,
                    createAt: (data.createAt as Timestamp).toDate(),
                    updateAt: (data.updateAt as Timestamp).toDate(),
                } as Iconstancia;
            }
        }catch(err){
            if (err instanceof Error) {
                console.error('Error al actualizar el elemento:', err.message);
            } else {
                console.error('Error desconocido al actualizar el elemento:', err);
            }
        }
    }
    //Calificaciones Detalle - funciones ************************
    public static async fetchItemsDetalle(id:string): Promise<IconstanciaDetalle[]>
    {
        try{
            const q = query(this.db(Collection.CONSTANCIAS_NOTAS), where('id_constancia', '==', id))
            const snapShot = await getDocs(q)
            
            if (snapShot.empty) {
                console.log('No matching documents for id_constancia:', id);
                return [];
            }

            const data = snapShot.docs.map((doc) => {
                const docData = doc.data();
                return {
                    ...docData,
                    id: doc.id,
                } as IconstanciaDetalle;
            });
            return data;
        }
        catch(err: unknown){
            if (err instanceof Error) {
                console.error('Error al mostrar el elemento:', err.message);
            } else {
                console.error('Error desconocido al mostrar el elemento:', err);
            }
            throw err
        }
    }
}