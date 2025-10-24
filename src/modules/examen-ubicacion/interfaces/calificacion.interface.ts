export default interface ICalificacionUbicacion
{
    id?: number,
    idiomaId?: number,
    nivelId?: number,
    cicloId: number,
    notaMin: number,
    notaMax: number,
    ciclo?: {
        id: number,
        nombre: string,
        numeroCiclo: number,
        idiomaId: number,
        nivelId: number
    }
    isNew?: boolean
}
    