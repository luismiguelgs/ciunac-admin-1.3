'use client'
import React from 'react'
import Grid from '@mui/material/Grid2'
import NewButton from '@/components/NewButton'
import { Box, Checkbox, Chip } from '@mui/material'
import MyDataGrid from '@/components/MUI/MyDataGrid'
import { MyDialog } from '@/components/MUI'
import { GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid'
import { Icertificado } from '@/modules/certificados/interfaces/certificado.interface'
import { useRouter } from 'next/navigation'
import CertificadosService, { Collection } from '@/modules/certificados/services/certificados.service'
import { NIVEL } from '@/lib/constants'
import PrintIcon from '@mui/icons-material/Print';
import { PDFViewer, pdf } from '@react-pdf/renderer'
import CertificateFormat from './(formats)/CertificateFormat'
import CertificateFormatVirtual from './(formats)/CertificateFormatVirtual'
import DownloadIcon from '@mui/icons-material/Download';
import dayjs from 'dayjs'
import SolicitudesService from '@/services/solicitudes.service'
import useSubjects from '@/hooks/useSubjects'
import 'dayjs/locale/es';
dayjs.locale('es');

type Props = {
	rows: Icertificado[],
	setRows: React.Dispatch<React.SetStateAction<Icertificado[]>>
	printed: boolean
}

export default function CertificateList({rows, setRows, printed}:Props) 
{
	//Hooks ************************************************************
	const { data } = useSubjects()
    const subjects = data;
    const navigate = useRouter()
    const [ openDialog, setOpenDialog ] = React.useState<boolean>(false)
    const [ openPrint, setOpenPrint ] = React.useState<boolean>(false)
    const [ selectData, setSelectData ] = React.useState<Icertificado | undefined>()
    const [ID, setID] = React.useState<GridRowId | null>(null);

    
	//Funcions **********************************************************
    const handleCheckboxChange = async (id:GridRowId, checked:boolean) => {
        setRows((prevRows) =>
            prevRows.map((row) =>
                row.id === id ? { ...row, impreso: checked } : row
            )
        );
        await CertificadosService.updateStatus(Collection.Certificados,id as string, checked)
        const info = rows.find((row) => row.id === id)
        if(checked)
            await SolicitudesService.updateStatus(info?.id_solicitud as string, 'ENTREGADO')
        else
            await SolicitudesService.updateStatus(info?.id_solicitud as string, 'ELABORADO')
    }
    const handleConfirmDelete = async () => {
        if (ID) {
            //borrar su detalle
            const data = await CertificadosService.fetchItemsDetail(ID as string)
            for(const element of data){
                await CertificadosService.deleteItem(Collection.CertificadosDetalle, element.id as string)
            }
            //borrar el item
            await CertificadosService.deleteItem(Collection.Certificados,ID as string);
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
    const buildFileName = (row: Icertificado) => {
        const alumno = (row.alumno || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9-_ ]/g, '').replace(/\s+/g, '_');
        const idioma = (row.idioma || '').toString();
        const nivel = (row.nivel || '').toString();
        const folio = (row.numero_registro || '').toString();
        const fecha = dayjs(row.fecha_emision).format('YYYYMMDD');
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
        const isDigital = row.tipo !== 'fisico';
        const doc = isDigital ? (
            <CertificateFormatVirtual
                duplicado={row.duplicado as boolean}
                curricula_antigua={row.curricula_antigua as boolean}
                certificado_anterior={row.certificado_anterior}
                id={row.id as string}
                formato={row.idioma === 'INGLES' && row.nivel === 'BASICO' ? 1 : 0}
                fecha_emision={dayjs(row.fecha_emision).format('D [de] MMMM [de] YYYY')}
                fecha_conclusion={dayjs(row.fecha_conclusion).format('D [de] MMMM [de] YYYY')}
                idioma={subjects?.filter(item=>item.value === row.idioma)[0]?.label}
                nivel={NIVEL.filter(item=>item.value === row.nivel)[0]?.label}
                url={`https://ciunac.unac.edu.pe/validacion-certificado/?url=${row.id}`}
                alumno={row.alumno as string}
                horas={row.horas as number}
                elaborador={row.elaborador}
                numero_folio={row.numero_registro as string}
            />
        ) : (
            <CertificateFormat
                duplicado={row.duplicado as boolean}
                curricula_antigua={row.curricula_antigua as boolean}
                certificado_anterior={row.certificado_anterior}
                id={row.id as string}
                formato={row.idioma === 'INGLES' && row.nivel === 'BASICO' ? 1 : 0}
                fecha_emision={dayjs(row.fecha_emision).format('D [de] MMMM [de] YYYY')}
                fecha_conclusion={dayjs(row.fecha_conclusion).format('D [de] MMMM [de] YYYY')}
                idioma={subjects?.filter(item=>item.value === row.idioma)[0]?.label}
                nivel={NIVEL.filter(item=>item.value === row.nivel)[0]?.label}
                url={`https://ciunac.unac.edu.pe/validacion-certificado/?url=${row.id}`}
                alumno={row.alumno as string}
                horas={row.horas as number}
                elaborador={row.elaborador}
                numero_folio={row.numero_registro as string}
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
    
	//Columnas ***************
    const columns: GridColDef[] = [
        { field: 'numero_registro', headerName: 'N°REGISTRO', width: 150 },
        {
            field: 'tipo',
            headerName: 'MODALIDAD',
            width: 120,
            renderCell: (params) =>{
                switch(params.value){
                    case 'virtual':
                        return <Chip label='DIGITAL' color="secondary" />
                    case 'digital':
                        return <Chip label='DIGITAL' color="secondary" />
                    case 'fisico':
                        return <Chip label='FISICO' color="primary" />
                    default:
                        return <Chip label={params.value} />
                }
                
            }
        },
        { field: 'alumno', headerName: 'ALUMNO', width: 230 },
        { field: 'fecha_emision', headerName: 'FECHA EMISIÓN', type: 'date', width: 140 },
        { field: 'idioma', headerName: 'IDIOMA', type: 'singleSelect', valueOptions: subjects, width: 130 },
        { field: 'nivel', headerName: 'NIVEL', type: 'singleSelect', valueOptions: NIVEL, width:130},
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
                        
                        if (row?.tipo !== 'fisico' ) {
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
                            curricula_antigua={selectData?.curricula_antigua as boolean}
                            certificado_anterior={selectData?.certificado_anterior}
                            id={selectData?.id as string}
                            formato={selectData?.idioma === 'INGLES' && selectData.nivel === 'BASICO' ? 1 : 0}
                            fecha_emision={dayjs(selectData?.fecha_emision).format('D [de] MMMM [de] YYYY' )}
                            fecha_conclusion={dayjs(selectData?.fecha_conclusion).format('D [de] MMMM [de] YYYY' )} 
                            idioma={subjects?.filter(item=>item.value === selectData?.idioma)[0]?.label}
                            nivel={NIVEL.filter(item=>item.value === selectData?.nivel)[0]?.label} 
                            url={`https://ciunac.unac.edu.pe/validacion-certificado/?url=${selectData?.id}`}
                            alumno={selectData?.alumno as string} 
                            horas={selectData?.horas as number}
                            elaborador={selectData?.elaborador}
                            numero_folio={selectData?.numero_registro as string}/>
                    </PDFViewer>
                </>}
            />
		</Grid>
	)
}
