import { IcertificadoDetalle } from '@/modules/certificados/interfaces/certificado.interface';
import { Icertificado } from '@/modules/certificados/interfaces/certificado.interface';
import { firestore } from '@/lib/firebase';
import { collection, doc, updateDoc, serverTimestamp, addDoc, deleteDoc, getDoc, getDocs, query, where, Timestamp } from 'firebase/firestore'
import { changeDate } from '@/lib/utils';

export enum Collection{
    Certificados = 'registro_certificados',
    CertificadosDetalle = 'registro_certificados_detalle'
}

export default class CertificadosService
{
    // Funciones Generales *************************************
    private static db(collectionName: Collection){
        return collection(firestore, collectionName)
    }
    public static async newItem(collectionName:Collection, obj: Icertificado | IcertificadoDetalle): Promise<string | undefined>
    {
        let data:Icertificado | IcertificadoDetalle
        console.log(obj);
        
        if('alumno' in obj){ //Certificados
            data = {
                ...obj,
                impreso: false,
                creado: serverTimestamp(),
                modificado: serverTimestamp()
            }
        }else{ //Certificados Detalle
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {id, isNew ,...newObj} = obj 
            data = newObj
        }
        
        let docRef = null
        
        try{
            docRef = await addDoc(this.db(collectionName), data)
            return docRef.id
        }catch(err){
            if (err instanceof Error) {
                console.error('Error al actualizar el elemento:', err.message);
            } else {
                console.error('Error desconocido al actualizar el elemento:', err);
            }
        }
    }
    public static async updateItem(collectionName: Collection, obj:Icertificado | IcertificadoDetalle):Promise<void>
    {
        type UpdateDataType = Partial<Icertificado> & Partial<IcertificadoDetalle> & { 
            modificado?: ReturnType<typeof serverTimestamp> 
        }

        let dataToUpdate: UpdateDataType;
        
        if('alumno' in obj){ //Certificados
            dataToUpdate = {
                ...obj,
                modificado: serverTimestamp()
            }
        }else { //Certificados detalle
            dataToUpdate = obj
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
    public static async updateStatus(collectionName: Collection, id:string, status: boolean):Promise<void>
    {
        const docRef = doc(firestore, collectionName, id)
        try{
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
    
    public static async deleteItem(collectionName: Collection, id:string)
    {
        try{
            await deleteDoc(doc(firestore, collectionName, id))
        }
        catch(err){
            if (err instanceof Error) {
                console.error('Error al actualizar el elemento:', err.message);
            } else {
                console.error('Error desconocido al actualizar el elemento:', err);
            }
        }
    }
    //Examenes - funciones ****************************************
    public static async fetchItems(printed?: boolean):Promise<Icertificado[]>{
        try{

            const snapShot = await getDocs(this.db(Collection.Certificados))
            const data = snapShot.docs.map((item)=>{
                return{
                    ...item.data(),
                    id: item.id,
                    fecha_emision: item.data().fecha_emision ? new Date(item.data().fecha_emision.seconds * 1000) : null,
                    fecha_conclusion: item.data().fecha_conclusion ? new Date(item.data().fecha_conclusion.seconds * 1000) : null,
                    creado: item.data().creado ? changeDate(item.data().creado) : null,
                    modificado: item.data().modificado ? changeDate(item.data().modificado) : null
                } as Icertificado
            })
            // Aplica el filtro solo si `printed` está definido
            .filter((item) => (printed !== undefined ? item.impreso === printed : true));
            return data
        }
        catch(err){
            if (err instanceof Error) {
                console.error('Error al actualizar el elemento:', err.message);
            } else {
                console.error('Error desconocido al actualizar el elemento:', err);
            }
            throw err
        }
    }
    
    public static async selectItem(id:string):Promise<Icertificado | undefined>
    {
        const docRef = doc(firestore, Collection.Certificados, id)
        try{
            const snapShot = await getDoc(docRef)
            if(snapShot.exists()){
                const data = snapShot.data()
                return {
                    ...data,
                    id: snapShot.id,
                    fecha_emision: (data.fecha_emision as Timestamp).toDate(),
                    fecha_conclusion: (data.fecha_conclusion as Timestamp).toDate(),
                } as Icertificado
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
    public static async fetchItemsDetail(itemId: string):Promise<IcertificadoDetalle[]>{
        try{
            const q = query(this.db(Collection.CertificadosDetalle),where('id_certificado','==',itemId))
            const snapShot = await getDocs(q)
            
            const data = snapShot.docs.map((item)=>{
                return{
                    ...item.data(),
                    id: item.id,
                } as IcertificadoDetalle
            })
            return data
        }
        catch(err){
            if (err instanceof Error) {
                console.error('Error al actualizar el elemento:', err.message);
            } else {
                console.error('Error desconocido al actualizar el elemento:', err);
            }
            throw err
        }
    }
}