export default interface ICronogramaExam {
    id?: number;
    moduloId: number;
    fecha: Date;
    activo: boolean;
    creadoEn?: Date;
    modificadoEn?: Date;
    modulo?:{
        id: number;
        nombre: string;
    }
    isNew?: boolean;
}
