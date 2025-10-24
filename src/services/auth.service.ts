import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, UserCredential} from 'firebase/auth';
import { firestore } from '@/lib/firebase';
import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore';
import { IUsuario } from '../interfaces/usuario.interface';
import React from 'react';
import { FirebaseError } from 'firebase/app';

type LogInResponse = {
    user: UserCredential['user'] | null; // El tipo del usuario autenticado
    error?: string | null; // Si hay un error, lo guardamos como un string
};

export default class AuthService
{
    private static dataCollection = 'usuarios'
    private static db = collection(firestore, this.dataCollection)
    
    public static async logIn(email:string, password:string) : Promise<LogInResponse>
    {
        const auth = getAuth()

        try{
            const response = await signInWithEmailAndPassword(auth, email, password)
            return {user: response.user, error: null};
        }catch(err){
            if (err instanceof FirebaseError) {
                // Si es un error de Firebase, retornamos el mensaje de error
                return { user: null, error: err.message };
            } else {
                // Si es otro tipo de error, retornamos un error genérico
                return { user: null, error: 'Error desconocido' };
            }
        }
    }
    /*
    public static logIn(email:string, password:string, setAuth:React.Dispatch<React.SetStateAction<boolean>>,
        setError:React.Dispatch<React.SetStateAction<string>>,setOpen:React.Dispatch<React.SetStateAction<boolean>>){
        const auth = getAuth()
        signInWithEmailAndPassword(auth, email, password)
            .then((response)=>{
                setOpen(false)
                console.log(response.user);
                setAuth(true)
            })
            .catch((err)=>{
                console.log(err.message);
                setError(err.message as string)
                setOpen(true)
            })
    }
    */
    public static logOut(setAuth:React.Dispatch<React.SetStateAction<boolean>>)
    {
        const auth = getAuth();
        signOut(auth).then(() => {
            setAuth(false)
        }).catch((error) => {
            console.error(error);
        });

    }
    public static async createUser(email:string, password:string, data:IUsuario)
    {
        const auth = getAuth()
        createUserWithEmailAndPassword(auth, email, password)
            .then((response)=>{
                console.log(response.user);
                this.newItem(data, response.user.uid)
            })
            .catch((err)=>{
                alert(err.message);
            })
    }
    private static async newItem(obj:IUsuario, uid:string)
    {
        const data = {
            uid: uid,
            email: obj.email,
            nombre: obj.nombre,
            role: obj.role,
            creado: serverTimestamp(),
            modificado: serverTimestamp()
        }
        try{
            await addDoc(this.db, data)
        }catch(err){
            if (err instanceof Error) {
                console.error('Error al actualizar el elemento:', err.message);
            } else {
                console.error('Error desconocido al actualizar el elemento:', err);
            }
        }
    }
    public static async fetchItems():Promise<IUsuario[]>
    {
        const snapShot = await getDocs(this.db)
        const data = snapShot.docs.map((item)=>{
            return {...item.data(), id: item.id} as IUsuario
        })
        return data
        /*
        onSnapshot(this.db, (data)=>{
            setData(data.docs.map((item)=>{
              return { ...item.data(), id:item.id } as IUsuario
            }));
        });
        */
    }
    public static updateItem(id:string, obj:IUsuario)
    {
        const dataToUpdate = doc(firestore, this.dataCollection, id);
        updateDoc(dataToUpdate,{
            nombre: obj.nombre,
            role: obj.role,
            modificado: serverTimestamp()
        }).then(()=>{console.log('update');}).catch((err)=>console.log(err.message));
    }
    public static async deleteItem(id:string | undefined)
    {
        try{
            await deleteDoc(doc(firestore,this.dataCollection,id as string));
        }
        catch(err){
            if (err instanceof Error) {
                console.error('Error al actualizar el elemento:', err.message);
            } else {
                console.error('Error desconocido al actualizar el elemento:', err);
            }
        }
    }
}