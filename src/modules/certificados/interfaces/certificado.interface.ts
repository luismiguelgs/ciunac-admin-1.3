export interface ICertificado{
    _id?:string,
    id?:string,
    tipo: 'VIRTUAL' | 'FISICO'
    periodo: string
    estudiante: string,
    numeroDocumento: string,
    idioma: string,
    idiomaId?: number,
    nivel: string,
    nivelId?: number,
    cantidadHoras: number,
    solicitudId: number,
    fechaEmision: Date,
    numeroRegistro: string,
    fechaConcluido: Date,
    curriculaAnterior?: boolean,
    impreso?: boolean,
    duplicado?: boolean,
    certificadoOriginal?: string,
    url?: string,
    aceptado?: boolean,
    fechaAceptacion?: Date,
    elaboradoPor?: string,
    creadoEn?: Date,
    modificadoEn?: Date
    notas: ICertificadoNota[]
}
export interface ICertificadoNota{
    id?: string,
    ciclo: string,
    periodo: string,
    modalidad: "C.R." | "C.I." | "EX.U." | ""
    nota: number,
    isNew?: boolean
}