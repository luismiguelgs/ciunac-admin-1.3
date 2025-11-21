'use client'
import { Button } from '@mui/material'
import React from 'react'
import PreviewIcon from '@mui/icons-material/Preview';
import { MyDialog } from '@/components/MUI'
import { PDFViewer } from '@react-pdf/renderer'
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { Iconstancia, IconstanciaDetalle } from '../../../../modules/constancias/interfaces/constancia.interface';
import MatriculaFormat from './(formats)/MatriculaFormat'
import { NIVEL } from '@/lib/constants'
import useSubjects from '@/hooks/useSubjects'
import NotasFormat from './(formats)/NotasFormat';
dayjs.locale('es');

type Props = {
    id: string,
    contancia: Iconstancia,
    constanciaDetalle?: IconstanciaDetalle[],
}

export default function ButtonSeeContancia({ id,contancia, constanciaDetalle }: Props)
{
    //HOOKS *************************************************
    const [open, setOpen] = React.useState<boolean>(false)
    const {data} = useSubjects()

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
                contancia.tipo === 'CONSTANCIA_MATRICULA' ? (
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
                                    curso={data?.filter(item=>item.value === contancia.idioma)[0]?.label as string}
                                    nivel={NIVEL.filter(item=>item.value === contancia.nivel)[0]?.label}
                                    ciclo={contancia.ciclo}
                                    modalidad={contancia.modalidad as string}
                                    horario={contancia.horario as string}
                                    fecha={dayjs(contancia.createAt).format('D [de] MMMM [del] YYYY' )}
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
                                    curso={data?.filter(item=>item.value === contancia.idioma)[0]?.label as string}
                                    nivel={NIVEL.filter(item=>item.value === contancia.nivel)[0]?.label}
                                    ciclo={contancia.ciclo}
                                    fecha={dayjs(contancia.createAt).format('D [de] MMMM [del] YYYY' )}
                                    detalle={constanciaDetalle}
                                />
                            </PDFViewer>
                        </>}>
                    </MyDialog>
                )
            }
        </React.Fragment>
    )
}