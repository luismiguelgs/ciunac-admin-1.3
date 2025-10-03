import React from 'react';
import { Isolicitud } from '../modules/solicitudes/interfaces/solicitud.interface';
import { firestore } from '@/lib/firebase';
import { collection, doc, updateDoc, serverTimestamp, addDoc, deleteDoc, getDoc, onSnapshot, Timestamp, query, where, orderBy, Query, getDocs} from 'firebase/firestore'
import { changeDate, obtenerPeriodo } from '@/lib/utils';

export default class SolicitudesService
{
    private static dataCollection = 'solicitudes'
    private static db = collection(firestore, this.dataCollection);

    public static async newItem(obj:Isolicitud)
    {
        if(obj.creado === '' || obj.creado === undefined){
            obj.creado = serverTimestamp()
        }else{
            obj.creado = this.dateToTimestamp(obj.creado)
        }

        if(!obj.alumno_id){
            obj.alumno_id = ''
        }

        const data = {
            ...obj,
            estado:'NUEVO',
            pago:Number(obj.pago),
            manual:true,
            periodo: obtenerPeriodo(),
            creado: obj.creado,
            modificado: serverTimestamp()
        }
		try{	
			await addDoc(this.db, data)
		}catch(err){
			if (err instanceof Error) {
                // Si el error tiene un mensaje, lo manejamos
                console.log(err.message);
            } else {
                // Si no es un Error, manejamos un caso genérico
                console.log('Ocurrió un error desconocido', err);
            }
		}
  	}
    public static fetchItemQuery( setData:React.Dispatch<React.SetStateAction<Isolicitud[]>>, searchParams:string | null,  tipoSolicitud:'BECA'| 'EXAMEN' | 'CONSTANCIAS' | 'CERTIFICADO' ="CERTIFICADO")
    {
        let itemQuery: Query
        const condicionesBecas = ['BECA']
        const condicionesExamen = ['EXAMEN_DE_UBICACION'];
        const condicionesCertificados = ['CERTIFICADO_DE_ESTUDIO', 'DUPLICADO_DE_CERTIFICADO','CERTIFICADO_DIGITAL','CERTIFICADO_DIGITAL_COPIA'];
        const condicionesConstancias = ['CONSTANCIA_DE_MATRICULA', 'CONSTANCIA_DE_NOTAS'];

        switch(tipoSolicitud){
            case 'EXAMEN': 
                itemQuery = query(this.db, 
                    where('estado',"==",searchParams), 
                    where('solicitud',"in",condicionesExamen), 
                    orderBy('creado','asc')
                );
                break;
        
            case 'CONSTANCIAS': 
                itemQuery = query(this.db,
                    where('estado',"==",searchParams),
                    where('solicitud',"in",condicionesConstancias),
                    orderBy('creado','asc')
                ); 
                break; 
                    
            case 'CERTIFICADO': 
                itemQuery = query(this.db,
                    where('estado',"==",searchParams),
                    where('solicitud',"in",condicionesCertificados),
                    orderBy('creado','asc')
                ); 
                break; 
            case 'BECA':
                itemQuery = query(this.db,
                    where('estado',"==",searchParams),
                    where('solicitud',"in",condicionesBecas),
                    orderBy('creado','asc')
                );
                break;
            default:
                throw new Error('Tipo de solicitud no válido');
        }

        onSnapshot(itemQuery, (data)=>{
    
            setData(data.docs.map((item) => {
                const raw = item.data();
                return {
                    ...raw,
                    id: item.id,
                    creado : raw.creado && typeof raw.creado.toDate === 'function' ? raw.creado.toDate() : raw.creado,
                    modificado: raw.modificado && typeof raw.modificado.toDate === 'function' ? raw.modificado.toDate() : raw.modificado,
                } as Isolicitud;
            }));
        });
    }
    public static async fetchItemsWODate():Promise<Isolicitud[]>{
        const querySnapshot = await getDocs(this.db)
        const data = querySnapshot.docs.map((item)=>{
            const raw = item.data();
            return { 
                ...raw, 
                id: item.id,
                creado: raw.creado && typeof raw.creado.toDate === 'function' ? raw.creado.toDate() : raw.creado,
                modificado: raw.modificado && typeof raw.modificado.toDate === 'function' ? raw.modificado.toDate() : raw.modificado,
            } as Isolicitud
        })
        
        return data
    }
    public static async getItem(id:string) 
    {
        const docRef = doc(firestore, this.dataCollection, id)
		const snapShot = await getDoc(docRef)
		return {
			...snapShot.data(),
			id: snapShot.id
		}
    }
    public static updateItem(obj:Isolicitud)
    {
        const dataToUpdate = doc(firestore, this.dataCollection, obj.id as string);
        delete obj.id
        updateDoc(dataToUpdate,{
        ...obj,
        pago:Number(obj.pago),
        modificado: serverTimestamp()
        }).then(()=>{console.log('update');}).catch((err)=>console.log(err.message));
    }
    public static async fetchItemQueryPeriod(mes:number, año:number): Promise<Isolicitud[]>{
    
        const primerDiaMes = new Date(año, mes,1)
        const primerDiaSiguienteMes = new Date(año, mes+1,1)
        const ultimoDiaMes = new Date(primerDiaSiguienteMes.getTime() - 1)
    
        const itemQuery = query(this.db, 
            where('creado',">=",new Date(primerDiaMes.toISOString().split('T')[0])),
            where('solicitud',"!=",'EXAMEN_DE_UBICACION'),
            where('creado',"<=",new Date(ultimoDiaMes.toISOString().split('T')[0])), 
            orderBy('creado','asc'))
        
        try{
            const querySnapshot = await getDocs(itemQuery)
            const result: Isolicitud[] = []
            querySnapshot.forEach((doc)=>{
                result.push({...doc.data(), id:doc.id, creado: changeDate(doc.data().creado, true) } as Isolicitud)
            })
            return result
        } catch(error){
            console.error("Error al obtener documentos", error)
            throw error
        }
    }
    public static fetchItemQueryDate(setData:React.Dispatch<React.SetStateAction<Isolicitud[]>>,fechaInicial:string, fechaFinal:string,ubicacion=false)
    {
        let itemQuery: Query
        if(ubicacion){
            itemQuery = query(this.db, 
                where('solicitud',"==",'EXAMEN_DE_UBICACION'), 
                where('creado',">=",new Date(fechaInicial)),
                where('creado',"<=",new Date(fechaFinal)), 
                /*orderBy('creado','asc')*/
            )
        }else{
            itemQuery =  query(this.db, 
                where('solicitud',"!=",'EXAMEN_DE_UBICACION'),
                where('creado',">=",new Date(fechaInicial)),
                where('creado',"<=",new Date(fechaFinal))
            )
        }
    
        onSnapshot(itemQuery, (data)=>{
            setData(data.docs.map((item)=>{
                return { ...item.data(), id:item.id, creado:changeDate(item.data().creado,true) } as Isolicitud
            }));
        });
    }
    public static updateComentario = (id:string, comentario:string) =>{
        const dataToUpdate = doc(firestore, this.dataCollection, id);
        console.log(comentario, id)
        updateDoc(dataToUpdate,{
          observaciones:comentario,
          modificado: serverTimestamp()
        }).then(()=>{console.log('updateObs');}).catch((err)=>console.log(err.message));
    }
    public static updateStatus = (id:string, status:string) =>{
        const dataToUpdate = doc(firestore, this.dataCollection, id);
        updateDoc(dataToUpdate,{
          estado:status,
          modificado: serverTimestamp()
        }).then(()=>{console.log('updateStatus');}).catch((err)=>console.log(err.message));  
    }
    public static async deleteItem (id:string | undefined)
    {
        try{
          await deleteDoc(doc(firestore,this.dataCollection,id as string));
        }
        catch(err){
            if (err instanceof Error) {
                console.error(err.message);
            } else {
                console.error('Ocurrió un error desconocido', err);
            }
        }
    }
    public static updateImagen = (id:string) =>{
        const dataToUpdate = doc(firestore, this.dataCollection, id);
        updateDoc(dataToUpdate,{
          voucher: 'borrado',
          modificado: serverTimestamp()
        }).then(()=>{console.log('updateStatus');}).catch((err)=>console.log(err.message));  
    }
    public static async fetchAllItems():Promise<Isolicitud[]>
    {
        const itemQuery = query(
            this.db, 
            where('solicitud',"==",'EXAMEN_DE_UBICACION'), 
            orderBy('creado','asc')
        )

        const querySnapshot = await getDocs(itemQuery)
        const data = querySnapshot.docs.map((item)=>{
            return { ...item.data(), id:item.id, creado: changeDate(item.data().creado,false), modificado: changeDate(item.data().modificado,false)} as Isolicitud
        })
        return data
    }

	private static dateToTimestamp(date:string)
	{
		const partesFecha = date.split("-");
		const anio = parseInt(partesFecha[0], 10);
		const mes = parseInt(partesFecha[1], 10) - 1; // Meses en JavaScript son de 0 a 11
		const dia = parseInt(partesFecha[2], 10);

		const fechaObj = new Date(anio,mes,dia)
		return Timestamp.fromDate(fechaObj)
	}
}









