import { Icertificado, IcertificadoDetalle } from '@/modules/certificados/interfaces/certificado.interface'
import { IBaseData } from '@/modules/opciones/interfaces/types.interface'
import { Button } from '@mui/material'
import { FormikProps } from 'formik'
import React from 'react'
import PreviewIcon from '@mui/icons-material/Preview';
import { MyDialog } from '@/components/MUI'
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer'
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { NIVEL } from '@/lib/constants'
import CertificateFormat from './(formats)/CertificateFormat'
import CertificateFormatVirtual from './(formats)/CertificateFormatVirtual'
dayjs.locale('es');

type Props = {
    id: string,
    formik: FormikProps<Icertificado>,
    data?: IcertificadoDetalle[],
    cursos: IBaseData[] | undefined,
    virtual?: boolean
}


export default function ButtonSeeCertificate({ id, formik, cursos, virtual=false }: Props) 
{
    //HOOKS *************************************************
    const [open, setOpen] = React.useState<boolean>(false)

    // Helper to build a clean, readable filename
    const buildFileName = React.useCallback(() => {
        const alumno = (formik.values.alumno || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9-_ ]/g, '').replace(/\s+/g, '_');
        const idioma = (formik.values.idioma || '').toString();
        const nivel = (formik.values.nivel || '').toString();
        const folio = (formik.values.numero_registro || '').toString();
        const fecha = dayjs(formik.values.fecha_emision).format('YYYYMMDD');
        const parts = [
            'Certificado',
            alumno || 'Alumno',
            idioma || 'Idioma',
            nivel || 'Nivel',
            folio || id
        ].filter(Boolean);
        return `${parts.join('_')}_${fecha}.pdf`;
    }, [formik.values.alumno, formik.values.idioma, formik.values.nivel, formik.values.numero_registro, formik.values.fecha_emision, id]);
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
                                        duplicado={formik.values.duplicado as boolean}
                                        curricula_antigua={formik.values.curricula_antigua as boolean}
                                        certificado_anterior={formik.values.certificado_anterior}
                                        id={id}
                                        formato={formik.values.idioma === 'INGLES' && formik.values.nivel === 'BASICO' ? 1 : 0}
                                        fecha_emision={dayjs(formik.values.fecha_emision).format('D [de] MMMM [de] YYYY' )}
                                        fecha_conclusion={dayjs(formik.values.fecha_conclusion).format('D [de] MMMM [de] YYYY' )}
                                        idioma={cursos?.filter(item=>item.value === formik.values.idioma)[0]?.label}
                                        nivel={NIVEL.filter(item=>item.value === formik.values.nivel)[0]?.label}
                                        url={`https://ciunac.unac.edu.pe/validacion-certificado/?url=${id}`}
                                        alumno={formik.values.alumno}
                                        horas={formik.values.horas}
                                        elaborador={formik.values.elaborador}
                                        numero_folio={formik.values.numero_registro}
                                    />
                                }
                                fileName={buildFileName()}
                            >
                                <Button variant="outlined" color="primary">Descargar PDF</Button>
                            </PDFDownloadLink>
                        </div>
                        <PDFViewer width={800} height={500}>
                            <CertificateFormatVirtual
                                            duplicado={formik.values.duplicado as boolean}
                                            curricula_antigua={formik.values.curricula_antigua as boolean}
                                            certificado_anterior={formik.values.certificado_anterior}
                                            id={id}
                                            formato={formik.values.idioma === 'INGLES' && formik.values.nivel === 'BASICO' ? 1 : 0}
                                            fecha_emision={dayjs(formik.values.fecha_emision).format('D [de] MMMM [de] YYYY' )}
                                            fecha_conclusion={dayjs(formik.values.fecha_conclusion).format('D [de] MMMM [de] YYYY' )} 
                                            idioma={cursos?.filter(item=>item.value === formik.values.idioma)[0]?.label}
                                            nivel={NIVEL.filter(item=>item.value === formik.values.nivel)[0]?.label} 
                                            url={`https://ciunac.unac.edu.pe/validacion-certificado/?url=${id}`}
                                            alumno={formik.values.alumno} 
                                            horas={formik.values.horas}
                                            elaborador={formik.values.elaborador}
                                            numero_folio={formik.values.numero_registro}/>
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
                                        duplicado={formik.values.duplicado as boolean}
                                        curricula_antigua={formik.values.curricula_antigua as boolean}
                                        certificado_anterior={formik.values.certificado_anterior}
                                        id={id}
                                        formato={formik.values.idioma === 'INGLES' && formik.values.nivel === 'BASICO' ? 1 : 0}
                                        fecha_emision={dayjs(formik.values.fecha_emision).format('D [de] MMMM [de] YYYY' )}
                                        fecha_conclusion={dayjs(formik.values.fecha_conclusion).format('D [de] MMMM [de] YYYY' )}
                                        idioma={cursos?.filter(item=>item.value === formik.values.idioma)[0]?.label}
                                        nivel={NIVEL.filter(item=>item.value === formik.values.nivel)[0]?.label}
                                        url={`https://ciunac.unac.edu.pe/validacion-certificado/?url=${id}`}
                                        alumno={formik.values.alumno}
                                        horas={formik.values.horas}
                                        elaborador={formik.values.elaborador}
                                        numero_folio={formik.values.numero_registro}
                                    />
                                }
                                fileName={buildFileName()}
                            >
                                <Button variant="outlined" color="primary">Descargar PDF</Button>
                            </PDFDownloadLink>
                        </div>
                        <PDFViewer width={800} height={500}>
                            <CertificateFormat
                                            duplicado={formik.values.duplicado as boolean}
                                            curricula_antigua={formik.values.curricula_antigua as boolean}
                                            certificado_anterior={formik.values.certificado_anterior}
                                            id={id}
                                            formato={formik.values.idioma === 'INGLES' && formik.values.nivel === 'BASICO' ? 1 : 0}
                                            fecha_emision={dayjs(formik.values.fecha_emision).format('D [de] MMMM [de] YYYY' )}
                                            fecha_conclusion={dayjs(formik.values.fecha_conclusion).format('D [de] MMMM [de] YYYY' )} 
                                            idioma={cursos?.filter(item=>item.value === formik.values.idioma)[0]?.label}
                                            nivel={NIVEL.filter(item=>item.value === formik.values.nivel)[0]?.label} 
                                            url={`https://ciunac.unac.edu.pe/validacion-certificado/?url=${id}`}
                                            alumno={formik.values.alumno} 
                                            horas={formik.values.horas}
                                            elaborador={formik.values.elaborador}
                                            numero_folio={formik.values.numero_registro}/>
                        </PDFViewer>  
                    </>}
                />
                )
            }
            
        </React.Fragment>
    )
}
