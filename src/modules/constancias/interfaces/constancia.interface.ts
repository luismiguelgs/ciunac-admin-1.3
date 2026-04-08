export interface IConstancia {
    _id?: string;
    id?: string;
    tipo: 'MATRICULA' | 'NOTAS';
    estudiante: string;
    dni: string;
    idioma: string;
    idiomaId?: number;
    nivel: string;
    nivelId?: number;
    ciclo: string;
    impreso: boolean;
    solicitud_id: number;
    horario?: string;
    url?: string;
    modalidad?: 'REGULAR' | 'INTENSIVO';
    creado_en?: Date;
    modificado_en?: Date;
    createAt?: string;
    detalle?: IConstanciaDetalle[];
}

export interface IConstanciaDetalle {
    id?: string;
    idioma: string;
    nivel: string;
    ciclo: string;
    modalidad: 'REGULAR' | 'INTENSIVO',
    mes: string;
    año: string;
    aprobado: boolean;
    nota: number;
    isNew?: boolean;
}