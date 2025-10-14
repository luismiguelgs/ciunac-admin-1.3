import { Timestamp } from "firebase/firestore";
import * as ExcelJS from 'exceljs';
import { Isolicitud } from '@/modules/solicitudes/interfaces/solicitud.interface';
import { IUsuario } from "@/interfaces/usuario.interface";

export function mapId<T extends { _id?: string }>(item: T) {
    return {
        ...item,
        id: item._id,
        _id: undefined
    };
}

export function mapIds<T extends { _id?: string }>(data: T[]) {
    return data.map(item => mapId(item))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatDate(createdValue:any)
{
	if (!createdValue) return ''; // Si no hay valor, devuelve cadena vacía

	let date: Date | null = null;

	// Intenta obtener un objeto Date válido
	if (createdValue instanceof Date && !isNaN(createdValue.getTime())) {
		date = createdValue;
	} else {
		const parsedDate = new Date(createdValue);
		if (!isNaN(parsedDate.getTime())) {
			date = parsedDate;
		}
	}

	// Si tenemos una fecha válida, la formateamos
	if (date) {
		return date.toLocaleString('es-PE', { // Usar locale adecuado
		year: 'numeric', month: '2-digit', day: '2-digit',
		hour: '2-digit', minute: '2-digit', second: '2-digit'
		});
	}

	// Si no se pudo obtener una fecha válida, devuelve el valor original si es string, o vacío
	return typeof createdValue === 'string' ? createdValue : '';
}

export const changeDate = (date:Timestamp, hora=true, formato=false):string|undefined => {
    if(date === null) {
      console.log('hay una fecha nula');
      return
    }
    
    const fecha:Date  = date?.toDate()
    // Obtener diferentes partes de la fecha y hora
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; // Los meses comienzan desde 0, se suma 1
    const anio = fecha.getFullYear();
    const horas = fecha.getHours();
    const minutos = fecha.getMinutes();
    const segundos = fecha.getSeconds();
    // Formatear los valores para que tengan dos dígitos si es necesario
    
    const diaFormateado = String(dia).padStart(2, '0');
    const mesFormateado = String(mes).padStart(2, '0');
    if(hora){
      const horasFormateadas = String(horas).padStart(2, '0');
      const minutosFormateados = String(minutos).padStart(2, '0');
      const segundosFormateados = String(segundos).padStart(2, '0');
      // Generar la cadena con el formato deseado (por ejemplo, dd/mm/aaaa hh:mm:ss)
      const fechaFormateada = `${diaFormateado}/${mesFormateado}/${anio} ${horasFormateadas}:${minutosFormateados}:${segundosFormateados}`;
      return fechaFormateada
    }else{
      // Generar la cadena con el formato deseado (por ejemplo, dd/mm/aaaa hh:mm:ss)
      if(formato){
        const fechaFormateada = `${anio}-${mesFormateado}-${diaFormateado}`;
        return fechaFormateada
      }
      const fechaFormateada = `${diaFormateado}/${mesFormateado}/${anio}`;
      return fechaFormateada
    }
} 
  
export async function exportToExcel(data:Isolicitud[])
{
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('DataSheet');

  const dataF = formatearDatos(data)

  // Agregar datos a la hoja de cálculo
  dataF.forEach(row => {
    worksheet.addRow(row);
  });

  // Generar un blob a partir del libro de Excel
  const buffer = await workbook.xlsx.writeBuffer();
  // Crear un objeto Blob
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  // Crear un enlace de descarga
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'datos.xlsx';

  // Agregar el enlace al documento y hacer clic para iniciar la descarga
  document.body.appendChild(a);
  a.click();

  // Limpiar el enlace después de la descarga
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
const formatearDatos =(data:Isolicitud[]) =>{
	const excelData:string[][] = [['Online','Apellidos','Nombres','DNI','Idioma','Nivel','Pago','Fecha Pago','Recibo','Estado','Fecha Solicitud','Trabajador','Tipo Trabajador']]
	data.forEach((row)=>{
		excelData.push([
      row.manual? 'MANUAL': 'ONLINE',
			row.apellidos?.toUpperCase() || '',
			row.nombres?.toUpperCase() || '', 
			row.dni || '', 
			row.idioma, 
			row.nivel, 
			row.pago, 
      row.fecha_pago || '',
			row.numero_voucher || '', 
			row.estado || '',
      row.creado || '',
      row.trabajador? 'SI': 'NO',
      row.tipo_trabajador || '',
		])
	})
	return excelData
}

export function obtenerPeriodo()
{
    const fechaActual = new Date();
    const mes = fechaActual.getMonth() + 1; // Los meses en JavaScript van de 0 a 11, por lo que sumamos 1 para obtener el mes actual
    const año = fechaActual.getFullYear();

    // Formatear los valores para que tengan dos dígitos si es necesario
    const mesFormateado = String(mes).padStart(2, '0');

    return `${String(año)}${mesFormateado}`
}

export function validateUser(item:IUsuario, setVal:React.Dispatch<React.SetStateAction<{email: boolean; password: boolean; nombre: boolean}>>):boolean{
    let email:boolean
    let password:boolean
    let nombre:boolean

    const emailRegex =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/ 
  
    if(item.email === '' || !emailRegex.test(item.email)){
        email = false
        setVal((prevBasicVal)=>({...prevBasicVal, email:true}))
    }else{
        email = true
        setVal((prevBasicVal)=>({...prevBasicVal, email:false}))
    }
    if(item.password === '' || item.password.length <  6){
        password = false
        setVal((prevBasicVal)=>({...prevBasicVal, password:true}))
    }else{
        password = true
        setVal((prevBasicVal)=>({...prevBasicVal, password:false}))
    }
    if(item.nombre === ''){
        nombre = false
        setVal((prevBasicVal)=>({...prevBasicVal, nombre:true}))
    }else{
        nombre = true
        setVal((prevBasicVal)=>({...prevBasicVal, nombre:false}))
    }

  return email && password && nombre
}

export const capitalizeFirstLetterOfEachWord = (str: string) => {
	if (!str) return '';
	return str
		.split(' ') // Split the string by spaces
		.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
		.join(' '); // Join the words back together with spaces
};

