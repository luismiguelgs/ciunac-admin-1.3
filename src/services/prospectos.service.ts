import IProspecto from '../interfaces/prospecto.interface';
import { firestore } from '@/lib/firebase';
import { collection, doc, updateDoc, serverTimestamp, addDoc, deleteDoc, getDocs, getDoc} from 'firebase/firestore'

export default class ProspectosService
{
    private static dataCollection = 'prospectos'
    private static db = collection(firestore, this.dataCollection)

    public static async fetchItems(): Promise<IProspecto[]>{
        const snapShot = await getDocs(this.db)
        const data = snapShot.docs.map((item)=>{
            return {...item.data(), id: item.id } as IProspecto
        })
        return data
    }
    public static async getItem(id:string):Promise<IProspecto>{
        const docRef = doc(firestore, this.dataCollection, id)
        const snapShot = await getDoc(docRef)

        return {
            ...snapShot.data(),
            id: snapShot.id
        } as IProspecto
    }
    public static async newItem(obj:IProspecto) :Promise<void | string>{ 
        const data = {
            ...obj,
            creado: serverTimestamp(),
            modificado: serverTimestamp()
        }
        let docRef = null
        try{
            docRef = await addDoc(this.db, data)
            return docRef.id
        }catch(err){
            if (err instanceof Error) {
                console.error(err.message);
            } else {
                console.error('Ocurrió un error desconocido', err);
            }
        }
    }
    public static async updateItem(obj: IProspecto): Promise<void> {
        const dataToUpdate = doc(firestore, this.dataCollection, obj.id as string);
      
        try {
            await updateDoc(dataToUpdate, {
                ...obj,
                modificado: serverTimestamp(),
            });
            console.log('Elemento actualizado correctamente');
        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
            } else {
                console.error('Ocurrió un error desconocido', err);
            }
        }
    }
    public static async deleteItem(id:string | undefined) : Promise<void>{
        try{
            await deleteDoc(
                doc(firestore,this.dataCollection,id as string)
            );
        }
        catch(err){
            if (err instanceof Error) {
                console.error(err.message);
            } else {
                console.error('Ocurrió un error desconocido', err);
            }
        }
    }
}