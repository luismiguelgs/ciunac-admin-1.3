'use client'
import React from 'react'
import Grid from '@mui/material/Grid2'
import NewButton from '@/components/NewButton'
import { Box, Checkbox, Chip } from '@mui/material'
import MyDataGrid from '@/components/MUI/MyDataGrid'
import { MyDialog } from '@/components/MUI'
import { GridActionsCellItem, GridColDef, GridRowId, GridValueFormatter } from '@mui/x-data-grid'
import { ICertificado } from '@/modules/certificados/interfaces/certificado.interface'
import { useRouter } from 'next/navigation'
import CertificadosService from '@/modules/certificados/services/certificados.service'
import PrintIcon from '@mui/icons-material/Print';
import { PDFViewer, pdf } from '@react-pdf/renderer'
import CertificateFormat from './formats/CertificateFormat'
import CertificateFormatVirtual from './formats/CertificateFormatVirtual'
import DownloadIcon from '@mui/icons-material/Download';
import dayjs from 'dayjs'
import SolicitudesService from '@/modules/solicitudes/services/solicitud.service'
import 'dayjs/locale/es';
dayjs.locale('es');

type Props = {
	rows: ICertificado[],
	setRows: React.Dispatch<React.SetStateAction<ICertificado[]>>
	printed: boolean
}

export default function CertificateList({rows, setRows, printed}:Props) 
{
	//Hooks ************************************************************
	//const { data } = useSubjects()
    //const subjects = data;
    const navigate = useRouter()
    const [ openDialog, setOpenDialog ] = React.useState<boolean>(false)
    const [ openPrint, setOpenPrint ] = React.useState<boolean>(false)
    const [ selectData, setSelectData ] = React.useState<ICertificado | undefined>()
    const [ID, setID] = React.useState<GridRowId | null>(null);

    
	//Funcions **********************************************************
    const handleCheckboxChange = async (id:GridRowId, checked:boolean) => {
        setRows((prevRows) =>
            prevRows.map((row) =>
                row.id === id ? { ...row, impreso: checked } : row
            )
        );
        await CertificadosService.updateStatus(id as string, checked)
        const info = rows.find((row) => row.id === id)
        if(checked)
            await SolicitudesService.updateStatus(Number(info?.solicitudId), 3)
        else
            await SolicitudesService.updateStatus(Number(info?.solicitudId), 2)
    }
    const handleAccept = async (id:GridRowId, checked:boolean) => {
        setRows((prevRows) =>
            prevRows.map((row) =>
                row.id === id ? { ...row, aceptado: checked } : row
            )
        );
        await CertificadosService.updateAccept(id as string, checked)
    }

    const handleConfirmDelete = async () => {
        if (ID) {
            await CertificadosService.deleteItem(String(ID));
            setRows(rows.filter((row) => row.id !== ID));
            setID(null);
            setOpenDialog(false);
        }
    };
    const handleDetails = (id:GridRowId) => {
        setID(id)
		if(printed){
			navigate.push(`./${id}`)
		}else{
			navigate.push(`./certificados/${id}`)
		}
    }
    const handleDelete = async (id:GridRowId) => {
        setID(id)
        setOpenDialog(true)
    }
    const handlePrint = async (id:GridRowId) => {
        const info = rows.find((row) => row.id === id)
        setSelectData(info)
        setOpenPrint(true)
        //alert(JSON.stringify(selectData))
    }
    const buildFileName = (row: ICertificado) => {
        const alumno = (row.estudiante || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9-_ ]/g, '').replace(/\s+/g, '_');
        const idioma = (row.idioma || '').toString();
        const nivel = (row.nivel || '').toString();
        const folio = (row.numeroRegistro || '').toString();
        const fecha = dayjs(row.fechaEmision).format('YYYYMMDD');
        const parts = [
            'Certificado',
            alumno || 'Alumno',
            idioma || 'Idioma',
            nivel || 'Nivel',
            folio || (row.id as string)
        ].filter(Boolean);
        return `${parts.join('_')}_${fecha}.pdf`;
    }
    const handleDownload = async (id: GridRowId) => {
        const row = rows.find(r => r.id === id);
        if (!row) return;
        const isDigital = row.tipo !== 'FISICO';
        const doc = isDigital ? (
            <CertificateFormatVirtual
                duplicado={row.duplicado as boolean}
                curricula_antigua={row.curriculaAnterior as boolean}
                certificado_anterior={row.certificadoOriginal}
                id={row.id as string}
                formato={row.idioma === 'INGLES' && row.nivel === 'BASICO' ? 1 : 0}
                fecha_emision={dayjs(row.fechaEmision).format('D [de] MMMM [de] YYYY')}
                fecha_conclusion={dayjs(row.fechaConcluido).format('D [de] MMMM [de] YYYY')}
                idioma={row.idioma}
                nivel={row.nivel}
                url={`https://ciunac.unac.edu.pe/validacion-certificado/?url=${row.id}`}
                alumno={row.estudiante as string}
                horas={row.cantidadHoras as number}
                elaborador={row.elaboradoPor}
                numero_folio={row.numeroRegistro as string}
                notas={row.notas}
            />
        ) : (
            <CertificateFormat
                duplicado={row.duplicado as boolean}
                curricula_antigua={row.curriculaAnterior as boolean}
                certificado_anterior={row.certificadoOriginal}
                id={row.id as string}
                formato={row.idioma === 'INGLES' && row.nivel === 'BASICO' ? 1 : 0}
                fecha_emision={dayjs(row.fechaEmision).format('D [de] MMMM [de] YYYY')}
                fecha_conclusion={dayjs(row.fechaConcluido).format('D [de] MMMM [de] YYYY')}
                idioma={row.idioma}
                nivel={row.nivel}
                url={`https://ciunac.unac.edu.pe/validacion-certificado/?url=${row.id}`}
                alumno={row.estudiante as string}
                horas={row.cantidadHoras as number}
                elaborador={row.elaboradoPor}
                numero_folio={row.numeroRegistro as string}
                notas={row.notas}
            />
        );
        const blob = await pdf(doc).toBlob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = buildFileName(row);
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    const formatFecha: GridValueFormatter = (value: string | Date | null| undefined) => {
        if (!value) return '';
        return new Date(value).toLocaleDateString('es-PE', {year: 'numeric', month: '2-digit', day: '2-digit'})
    }
    
	//Columnas ***************
    const columns: GridColDef[] = [
        { field: 'numeroRegistro', headerName: 'N°REGISTRO', width: 120 },
        {
            field: 'tipo',
            headerName: 'MODALIDAD',
            width: 110,
            renderCell: (params) =>{
                switch(params.value){
                    case 'VIRTUAL':
                        return <Chip label='DIGITAL' color="secondary" />
                    case 'DIGITAL':
                        return <Chip label='DIGITAL' color="secondary" />
                    case 'FISICO':
                        return <Chip label='FISICO' color="primary" />
                    default:
                        return <Chip label={params.value} />
                }
                
            }
        },
        { field: 'estudiante', headerName: 'ALUMNO', width: 230 },
        { 
            field: 'fechaEmision', 
            headerName: 'FECHA EMISIÓN', 
            type: 'date',
            valueFormatter: formatFecha,
            width: 130 
        },
        { field: 'idioma', headerName: 'IDIOMA', width: 130 },
        { field: 'nivel', headerName: 'NIVEL', width:120},
        {
            field: 'impreso',
            headerName: 'IMPRESO',
            width: 100,
            renderCell: (params) => {
                return <Checkbox 
                    checked={params.value as boolean}
                    onChange={(e)=>{handleCheckboxChange(params.id as GridRowId, e.target.checked)}} 
                    inputProps={{'aria-label': 'Checkbox Impreso'}}
                />
            }
        },
        {
            field: 'aceptado',
            headerName: 'ENTREGADO',
            width: 100,
            renderCell: (params) => {
                return <Checkbox 
                    checked={params.value as boolean}
                    onChange={(e)=>{handleAccept(params.id as GridRowId, e.target.checked)}} 
                    inputProps={{'aria-label': 'Checkbox Impreso'}}
                />
            }
        }
    ]

	return (
		<Grid container spacing={2}>
			<Grid size={{xs: 12, md:6}}>
				<NewButton text="Nuevo Certificado" url='./certificados/nuevo'/>
			</Grid>
			<Grid size={{xs: 12, md:6}}>
				<Box id='filter-panel' />
			</Grid>
			<Grid size={{xs: 12}} minHeight={300}>
			{
				printed ? <MyDataGrid
					data={rows} 
					cols={columns}
					handleDetails={handleDetails}
					handleDelete={handleDelete}
				/> :
				<MyDataGrid
					data={rows}
					cols={columns}
					handleDetails={handleDetails}
					handleDelete={handleDelete}
                    extraActions={(id:GridRowId) => {
                        const row = rows.find(r => r.id === id);
                        
                        if (row?.tipo !== 'FISICO' ) {
                            return [
                                <GridActionsCellItem
                                    key='download'
                                    icon={<DownloadIcon />}
                                    label='Descargar'
                                    onClick={() => handleDownload(id)}
                                />
                            ]
                        }
                        return [
                            <GridActionsCellItem
                                key='print'
                                icon={<PrintIcon />}
                                label='Imprimir'
                                onClick={() => handlePrint(id)}
                            />
                        ]
                    }}
				/>
			}
			</Grid>
			<MyDialog 
				type='ALERT'
				title='Borrar Registro'
				content='¿Desea borrar el registro?'
				open={openDialog}
				setOpen={setOpenDialog}
				actionFunc={handleConfirmDelete}
			/>
            <MyDialog
                open={openPrint}
                type='SIMPLE'
                title='CERTIFICADO'
                setOpen={setOpenPrint}
                content={<>
                    <PDFViewer width={800} height={500}>
                        <CertificateFormat
                            duplicado={selectData?.duplicado as boolean}
                            curricula_antigua={selectData?.curriculaAnterior as boolean}
                            certificado_anterior={selectData?.certificadoOriginal}
                            id={selectData?.id as string}
                            formato={selectData?.idioma === 'INGLÉS' && selectData.nivel === 'BÁSICO' ? 1 : 0}
                            fecha_emision={dayjs(selectData?.fechaEmision).format('D [de] MMMM [de] YYYY' )}
                            fecha_conclusion={dayjs(selectData?.fechaConcluido).format('D [de] MMMM [de] YYYY' )} 
                            idioma={selectData?.idioma}
                            nivel={String(selectData?.nivel)} 
                            url={`https://ciunac.unac.edu.pe/validacion-certificado/?url=${selectData?.id}`}
                            alumno={selectData?.estudiante as string} 
                            horas={selectData?.cantidadHoras as number}
                            elaborador={selectData?.elaboradoPor}
                            numero_folio={String(selectData?.numeroRegistro)}
                            notas={selectData?.notas}
                        />
                    </PDFViewer>
                </>}
            />
		</Grid>
	)
}
