export default interface ISolicitudBeca 
{
    nombres: string;
	apellidos: string;
	telefono: string;
	tipoDocumento: string;
	numero_documento: string;
	facultad: string;
	facultadId: number;
	escuela: string;
	escuelaId: number;
	codigo: string;
	email: string;
	periodo: string;
	carta_de_compromiso: string;
	historial_academico: string,
	constancia_matricula: string,
	contancia_tercio: string,
	declaracion_jurada: string,
	estado?: string,
    observaciones?: string,
	_id?: string,
    id?: string,
	creado_en?: string,
	modificado_en?: string,
}