export interface IProfesor {
    id?: string,
    nombres: string,
    apellidos: string,
    genero: string,
    fechaNacimiento: Date,
    celular: string,
    activo: boolean,
    creadoEn?: Date,
    modificadoEn?: Date,
    isNew?: boolean
}