'use client'
import { Button } from '@mui/material'
import React from 'react'
import PreviewIcon from '@mui/icons-material/Preview';
import { MyDialog } from '@/components/MUI'
import { PDFViewer } from '@react-pdf/renderer'
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { IConstancia } from '../interfaces/constancia.interface';
import MatriculaFormat from '../formats/MatriculaFormat'
import NotasFormat from '../formats/NotasFormat';
dayjs.locale('es');

type Props = {
    id: string,
    contancia: IConstancia,
}

export default function ButtonSeeContancia({ id,contancia }: Props)
{
    //HOOKS *************************************************
    const [open, setOpen] = React.useState<boolean>(false)

    return (
        <React.Fragment>
            <Button
                fullWidth
                onClick={()=>setOpen(true)}
                variant="contained"
                color="error"
                disabled={id === 'nuevo'}
                startIcon={<PreviewIcon />}>
                    Ver Constancia
            </Button>
            {
                contancia.tipo === 'MATRICULA' ? (
                    <MyDialog 
                        open={open}
                        type='SIMPLE'
                        title='CONSTANCIA DE MATRÍCULA'
                        setOpen={setOpen}
                        content={<>
                            <PDFViewer width={800} height={500}>
                                <MatriculaFormat 
                                    estudiante={contancia.estudiante}
                                    dni={contancia.dni}
                                    curso={contancia.idioma}
                                    nivel={contancia.nivel}
                                    ciclo={contancia.ciclo}
                                    modalidad={contancia.modalidad as string}
                                    horario={contancia.horario as string}
                                    fecha={dayjs(contancia.creado_en).format('D [de] MMMM [del] YYYY' )}
                                />
                            </PDFViewer>
                        </>}>
                    </MyDialog>
                ): (
                    <MyDialog
                        open={open}
                        type='SIMPLE'
                        title='CONSTANCIA DE NOTAS'
                        setOpen={setOpen}
                        content={<>
                            <PDFViewer width={800} height={500}>
                                <NotasFormat 
                                    estudiante={contancia.estudiante}
                                    dni={contancia.dni}
                                    curso={contancia.idioma}
                                    nivel={contancia.nivel}
                                    ciclo={contancia.ciclo}
                                    fecha={dayjs(contancia.creado_en).format('D [de] MMMM [del] YYYY' )}
                                    detalle={contancia.detalle}
                                />
                            </PDFViewer>
                        </>}>
                    </MyDialog>
                )
            }
        </React.Fragment>
    )
}