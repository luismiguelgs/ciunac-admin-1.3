import { ICertificado, ICertificadoNota } from '@/modules/certificados/interfaces/certificado.interface'
import { Button } from '@mui/material'
import React from 'react'
import PreviewIcon from '@mui/icons-material/Preview';
import { MyDialog } from '@/components/MUI'
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer'
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { NIVEL } from '@/lib/constants'
import CertificateFormat from './formats/CertificateFormat'
import CertificateFormatVirtual from './formats/CertificateFormatVirtual'
dayjs.locale('es');

type Props = {
    id: string,
    data: ICertificado | undefined,
    notas?: ICertificadoNota[],
    virtual?: boolean
}


export default function ButtonSeeCertificate({ id, data, notas, virtual=false }: Props) 
{
    //HOOKS *************************************************
    const [open, setOpen] = React.useState<boolean>(false)

    // Helper to build a clean, readable filename
    const buildFileName = React.useCallback(() => {
        const alumno = (data?.estudiante || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9-_ ]/g, '').replace(/\s+/g, '_');
        const idioma = (data?.idioma || '').toString();
        const nivel = (data?.nivel || '').toString();
        const folio = (data?.numeroRegistro || '').toString();
        const fecha = dayjs(data?.fechaEmision).format('YYYYMMDD');
        const parts = [
            'Certificado',
            alumno || 'Alumno',
            idioma || 'Idioma',
            nivel || 'Nivel',
            folio || id
        ].filter(Boolean);
        return `${parts.join('_')}_${fecha}.pdf`;
    }, [data?.estudiante, data?.idioma, data?.nivel, data?.numeroRegistro, data?.fechaEmision, id]);
    return (
        <React.Fragment>
            <Button
                fullWidth 
                onClick={()=>setOpen(true)}
                variant="contained" 
                color="error" 
                disabled={id === 'nuevo'}
                startIcon={<PreviewIcon />}>
                    Ver Certificado
            </Button>
            {
                virtual ? (
                    <MyDialog 
                    open={open}
                    type='SIMPLE'
                    title='CERTIFICADO'
                    setOpen={setOpen}
                    content={<>
                        <div style={{ marginBottom: 8 }}>
                            <PDFDownloadLink
                                document={
                                    <CertificateFormatVirtual
                                        duplicado={data?.duplicado as boolean}
                                        curricula_antigua={data?.curriculaAnterior as boolean}
                                        certificado_anterior={data?.certificadoOriginal}
                                        id={id}
                                        formato={data?.idioma === 'INGLES' && data?.nivel === 'BASICO' ? 1 : 0}
                                        fecha_emision={dayjs(data?.fechaEmision).format('D [de] MMMM [de] YYYY' )}
                                        fecha_conclusion={dayjs(data?.fechaConcluido).format('D [de] MMMM [de] YYYY' )}
                                        idioma={data?.idioma}
                                        nivel={String(data?.nivel)}
                                        url={`https://ciunac.unac.edu.pe/validacion-certificado/?url=${id}`}
                                        alumno={String(data?.estudiante)}
                                        horas={Number(data?.cantidadHoras)}
                                        elaborador={String(data?.elaboradoPor)}
                                        numero_folio={String(data?.numeroRegistro)}
                                        notas={data?.notas}
                                    />
                                }
                                fileName={buildFileName()}
                            >
                                <Button variant="outlined" color="primary">Descargar PDF</Button>
                            </PDFDownloadLink>
                        </div>
                        <PDFViewer width={800} height={500}>
                            <CertificateFormatVirtual
                                        duplicado={data?.duplicado as boolean}
                                        curricula_antigua={data?.curriculaAnterior as boolean}
                                        certificado_anterior={data?.certificadoOriginal}
                                        id={id}
                                        formato={data?.idioma === 'INGLES' && data?.nivel === 'BASICO' ? 1 : 0}
                                        fecha_emision={dayjs(data?.fechaEmision).format('D [de] MMMM [de] YYYY' )}
                                        fecha_conclusion={dayjs(data?.fechaConcluido).format('D [de] MMMM [de] YYYY' )} 
                                        idioma={data?.idioma}
                                        nivel={String(data?.nivel)} 
                                        url={`https://ciunac.unac.edu.pe/validacion-certificado/?url=${id}`}
                                        alumno={String(data?.estudiante)} 
                                        horas={Number(data?.cantidadHoras)}
                                        elaborador={String(data?.elaboradoPor)}
                                        numero_folio={String(data?.numeroRegistro)}
                                        notas={data?.notas}
                            />
                        </PDFViewer>  
                    </>}
                />
                ):(
                    <MyDialog 
                    open={open}
                    type='SIMPLE'
                    title='CERTIFICADO'
                    setOpen={setOpen}
                    content={<>
                        <div style={{ marginBottom: 8 }}>
                            <PDFDownloadLink
                                document={
                                    <CertificateFormat
                                        duplicado={data?.duplicado as boolean}
                                        curricula_antigua={data?.curriculaAnterior as boolean}
                                        certificado_anterior={data?.certificadoOriginal}
                                        id={id}
                                        formato={data?.idioma === 'INGLES' && data?.nivel === 'BASICO' ? 1 : 0}
                                        fecha_emision={dayjs(data?.fechaEmision).format('D [de] MMMM [de] YYYY' )}
                                        fecha_conclusion={dayjs(data?.fechaConcluido).format('D [de] MMMM [de] YYYY' )}
                                        idioma={data?.idioma}
                                        nivel={String(data?.nivel)}
                                        url={`https://ciunac.unac.edu.pe/validacion-certificado/?url=${id}`}
                                        alumno={String(data?.estudiante)}
                                        horas={Number(data?.cantidadHoras)}
                                        elaborador={String(data?.elaboradoPor)}
                                        numero_folio={String(data?.numeroRegistro)}
                                        notas={data?.notas}
                                    />
                                }
                                fileName={buildFileName()}
                            >
                                <Button variant="outlined" color="primary">Descargar PDF</Button>
                            </PDFDownloadLink>
                        </div>
                        <PDFViewer width={800} height={500}>
                            <CertificateFormat
                                    duplicado={data?.duplicado as boolean}
                                    curricula_antigua={data?.curriculaAnterior as boolean}
                                    certificado_anterior={data?.certificadoOriginal}
                                    id={id}
                                    formato={data?.idioma === 'INGLES' && data?.nivel === 'BASICO' ? 1 : 0}
                                    fecha_emision={dayjs(data?.fechaEmision).format('D [de] MMMM [de] YYYY' )}
                                    fecha_conclusion={dayjs(data?.fechaConcluido).format('D [de] MMMM [de] YYYY' )} 
                                    idioma={data?.idioma}
                                    nivel={String(data?.nivel)} 
                                    url={`https://ciunac.unac.edu.pe/validacion-certificado/?url=${id}`}
                                    alumno={String(data?.estudiante)} 
                                    horas={Number(data?.cantidadHoras)}
                                    elaborador={String(data?.elaboradoPor)}
                                    numero_folio={String(data?.numeroRegistro)}
                                    notas={data?.notas}            
                                />
                        </PDFViewer>  
                    </>}
                />
                )
            }
            
        </React.Fragment>
    )
}
