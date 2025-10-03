import packageJson from '../../package.json';

export const VERSION = packageJson.version
export const DRAWER_WIDTH = 240

export const MESES = [
    {value:'ENERO', label:'Enero'},
    {value:'FEBRERO', label:'Febrero'},
    {value:'MARZO', label:'Marzo'},
    {value:'ABRIL', label:'Abril'},
    {value:'MAYO', label:'Mayo'},
    {value:'JUNIO', label:'Junio'},
    {value:'JULIO', label:'Julio'},
    {value:'AGOSTO', label:'Agosto'},
    {value:'SEPTIEMBRE', label:'Septiembre'},
    {value:'OCTUBRE', label:'Octubre'},
    {value:'NOVIEMBRE', label:'Noviembre'},
    {value:'DICIEMBRE', label:'Diciembre'},
]

export const ESTADO = [
    {value:'1',label:'NUEVO'},
    {value:'2',label:'PROCESO'},
    {value:'3',label:'TERMINADO'},
    {value:'4',label:'PAGADO'},
    {value:'5',label:'RECHAZADO'},
]
export const ESTADO_EXAMEN = [
    {value:'PROGRAMADO',label:'Programado'},
    {value:'ASIGNADO',label:'Asignado'},
    {value:'TERMINADO',label:'Terminado'},
]
export const NIVEL = [
    {value:'1',label:'BÁSICO'},
    {value:'2',label:'INTERMEDIO'},
    {value:'3',label:'AVANZADO'},
]

export const GENERO = [
    {value: 'M', label: 'MASCULINO'},
    {value: 'F', label: 'FEMENINO'},
]

export const PROGRAMAS = [
    {id:'INGLES-BASICO',label:'INGLÉS BÁSICO', niveles:9, horas:360},
    {id:'INGLES-INTERMEDIO',label:'INGLÉS INTERMEDIO', niveles:9, horas:360},
    {id:'INGLES-AVANZADO',label:'INGLÉS AVANZADO', niveles:9,horas:360},
    {id:'PORTUGUES-BASICO',label:'PORTUGUÉS BÁSICO', niveles:5,horas:200},
    {id:'PORTUGUES-INTERMEDIO',label:'PORTUGUÉS INTERMEDIO', niveles:4, horas:160},
    {id:'PORTUGUES-AVANZADO',label:'PORTUGUÉS AVANZADO', niveles:3, horas:120},
    {id:'ITALIANO-BASICO',label:'ITALIANO BÁSICO', niveles:5, horas:200},
    {id:'ITALIANO-INTERMEDIO',label:'ITALIANO INTERMEDIO', niveles:4, horas:160},
    {id:'ITALIANO-AVANZADO',label:'ITALIANO AVANZADO', niveles:3, horas:120},
    {id:'FRANCES-BASICO',label:'FRANCÉS BÁSICO', niveles:5, horas:200},
    {id:'FRANCES-INTERMEDIO',label:'FRANCÉS INTERMEDIO', niveles:4, horas:160},
    {id:'FRANCES-AVANZADO',label:'FRANCÉS AVANZADO', niveles:3, horas:120},
    {id:'QUECHUA-BASICO',label:'QUECHUA BÁSICO', niveles:5, horas:200},
    {id:'QUECHUA-INTERMEDIO',label:'QUECHUA INTERMEDIO', niveles:4, horas:160},
    {id:'QUECHUA-AVANZADO',label:'QUECHUA AVANZADO', niveles:3, horas:120},
]

export const ESCUELAS = [
    {value:'ENFERMERIA',label:'E.PROFESIONAL DE ENFERMERIA', facultad: 'FCS'},
    {value:'ADMINISTRACION',label:'E.PROFESIONAL DE ADMINISTRACIÓN', facultad: 'FCA'},
    {value:'CONTABILIDAD',label:'E. PROFESIONAL DE CONTABILIDAD', facultad: 'FCC'},
    {value:'ECONOMIA',label:'E.PROFESIONAL DE ECONOMÍA', facultad: 'FCE'},
    {value:'ELECTRICA',label:'E.PROFESIONAL DE INGENIERÍA ELÉCTRICA', facultad: 'FIEE'},
    {value:'ELECTRONICA',label:'E.PROFESIONAL DE INGENIERÍA ELECTRÓNICA', facultad: 'FIEE'},
    {value:'INDUSTRIAL',label:'E.PROFESIONAL DE INGENIERÍA INDUSTRIAL', facultad: 'FIIS'},
    {value:'SISTEMAS',label:'E.PROFESIONAL DE INGENIERÍA DE SISTEMAS', facultad: 'FIIS'},
    {value:'MECANICA',label:'E.PROFESIONAL DE INGENIERÍA MECÁNICA', facultad: 'FIME'},
    {value:'ENERGIA',label:'E.PROFESIONAL DE INGENIERÍA EN ENERGÍA', facultad: 'FIME'},
    {value:'AMBIENTAL',label:'E.PROFESIONAL DE INGENIERÍA AMBIENTAL Y RECURSOS NATURALES', facultad: 'FIARN'},
    {value:'FISICA',label:'E.PROFESIONAL DE FÍSICA', facultad: 'FCNM'},
    {value:'MATEMATICA',label:'E.PROFESIONAL DE MATEMÁTICA', facultad: 'FCNM'},
    {value:'DATOS',label:'E.PROFESIONAL DE CIENCIA DE DATOS', facultad: 'FCNM'},
    {value:'QUIMICA',label:'E.PROFESIONAL DE INGENIERÍA QUÍMICA', facultad: 'FIQ'},
    {value:'PESQUERA',label:'E.PROFESIONAL DE INGENIERÍA PESQUERA', facultad: 'FIPA'},
    {value:'ALIMENTOS',label:'E.PROFESIONAL DE INGENIERÍA DE ALIMENTOS', facultad: 'FIPA'},
    {value: 'EDUCACION_FISICA', label: 'E.PROFESIONAL DE EDUCACIÓN FÍSICA', facultad: 'FCED'},    
]