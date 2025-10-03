'use client'
import { StyleSheet, Document, Page, View, Text, Font, Image, Link } from '@react-pdf/renderer'
import QRCode from 'qrcode'
import waterMark from '@/assets/unac-logo.png'
import logoCiunac from '@/assets/logo-ciunac-trans.png'
import logoUnac from '@/assets/unac-logo.png'
import { IcertificadoDetalle } from '@/modules/certificados/interfaces/certificado.interface'
import React from 'react'
import CertificadosService from '@/modules/certificados/services/certificados.service'
import { capitalizeFirstLetterOfEachWord } from '@/lib/utils'
import banderas from '@/assets/banderas.png'

Font.register({family:'Dancing Script', src:'/fonts/DancingScript-VariableFont_wght.ttf'})
Font.register({family: 'PinyonScript', src:'/fonts/PinyonScript-Regular.ttf'})
Font.register({family:'Roboto', src:'https://fonts.gstatic.com/s/roboto/v16/zN7GBFwfMP4uA6AR0HCoLQ.ttf'})
Font.register({family: 'Roboto-Bold', src:'/fonts/Roboto-Bold.ttf'})

export const generateSessionPDFQrCode = async (
    baseUrl: string,
  ): Promise<string> => {
    return await QRCode.toDataURL(
      baseUrl
    )
}

const styles = StyleSheet.create({
	page:{
		paddingTop: 25,
    	paddingBottom: 25,
		paddingHorizontal: 10,
		backgroundColor: '#FCFCF0'
	},
	header:{
		flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
	},
	subtitle: {
        fontSize: 14,
        marginTop: 5,
    },
	waterMark: {
		position: 'absolute',
		top: '35%',
		left: '25%',
		//transform: 'translate(-110%, -80%)',
		opacity: 0.1,
		width: 280,
		height: 400,
		zIndex: -1,	
	},
	text2:{
		fontSize: 18,
		fontFamily: 'Dancing Script',
		lineHeight: 1.5
	},
	alumno:{
		fontSize: 24,
		fontFamily: 'PinyonScript',
		textAlign: 'center',
		marginHorizontal: 'auto',
	},
	text3:{
		fontSize: 18,
		fontFamily: 'Roboto-Bold',
		marginLeft:6,
		marginRight:6
	},
	imageSello:{
		width: 140
	},
	table: {
		width: 'auto',
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#bfbfbf',
	},
	tableRow: {
		flexDirection: 'row',
	},
	tableColHeader: {
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#bfbfbf',
		padding: 3,
	},
	tableCol: {
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#bfbfbf',
		padding: 3,
	},
	tableCellHeader: {
		fontSize: 26,
		fontFamily: 'Roboto-Bold',
		margin: 'auto',
		marginTop: 5,
	},
	tableCell: {
		fontFamily: 'Roboto-Bold',
		margin: 'auto',
		marginTop: 5,
		paddingTop: 5,
		paddingBottom: 5,
		fontSize: 13,
	},
	doubleView: {
		borderWidth: 2, // Grosor del borde
        borderColor: 'black', // Color del borde
        padding: 5, // Espaciado interno
        margin: 10, // Espaciado externo
        textAlign: 'center', // Centrado del texto
        width: 'auto', // Ajusta el ancho al contenido
        alignSelf: 'center', // Centrado horizontal
		marginLeft: 55,
	},
	doubleText: {
		fontFamily: 'Roboto-Bold', // Fuente Roboto-Bold
        fontSize: 20, // Tamaño de fuente
		textAlign: 'center',
		alignSelf: 'center',
        textTransform: 'uppercase', // Convierte el texto a mayúsculas
	},
	banner: {
		position: 'absolute',
		bottom: 5,
		left: 0,
		right: 0,
		flexDirection: 'row',
		alignItems: 'flex-end',
	},
	bannerImage: {
		height: 14,
	},
})

type Props = {
	duplicado: boolean,
	certificado_anterior?: string,
    url: string,
	formato: number,
    idioma: string | undefined,
    fecha_emision: string,
    fecha_conclusion: string,
    nivel: string,
    alumno: string,
    horas: number,
    numero_folio: string,
	id: string,
	elaborador?: string,
	curricula_antigua?: boolean
}
export default function CertificateFormatVirtual({certificado_anterior, curricula_antigua,
	duplicado=true,formato,id,url, idioma='IDIOMA', nivel, fecha_emision, fecha_conclusion, alumno, horas, numero_folio, elaborador=''}:Props) 
{
    const QRCode = generateSessionPDFQrCode(url)
	const [data, setData] = React.useState<IcertificadoDetalle[]>([]);

	React.useEffect(()=>{
        const getDetail = async () =>{
            const res = await CertificadosService.fetchItemsDetail(id as string)   
			setData(res)         
        }
        if(data.length === 0){
            getDetail()
        }
    },[])

	const sortedData = data.sort((a,b)=>{
		const aNumber = parseInt(a.curso.match(/\d+$/)?.[0] || '0');
  		const bNumber = parseInt(b.curso.match(/\d+$/)?.[0] || '0');
		return aNumber - bNumber;
	});
	
	const rows = [...sortedData];
	const rowsToAdd = 9 - rows.length;
	for (let i = 0; i < rowsToAdd; i++) {
		rows.push({curso:'',ciclo:'', modalidad:'', nota:0, id_certificado: '', isNew: false});
	}

    return (
        <Document>
			{/********************** PAGE 1 ********************/}
            <Page size="A4" style={[styles.page, {paddingHorizontal:25}]}>
				<View style={styles.header}>
                    {/* Logo izquierdo */}
                    <Image src={logoUnac.src} style={{width: 80, height: 110}} />
                    {/* Textos en el medio */}
					<View style={{textAlign: 'center', fontFamily: 'Roboto', flex: 1, alignItems: 'center', marginLeft: 20}}>
                        <Text style={{fontSize: 18, fontWeight: 'bold', fontFamily: 'Roboto-Bold'}}>UNIVERSIDAD NACIONAL DEL CALLAO</Text>
                        <Text style={{fontSize: 25, fontWeight: 'bold', fontFamily: 'Roboto-Bold'}}>CENTRO DE IDIOMAS</Text>
                    </View>
                    {/* Logo derecho */}
                    <Image src={logoCiunac.src} style={{width: 100, height: 100}} />
                </View>

				{/* Marca de agua */}
                <Image src={waterMark.src} style={styles.waterMark} />

				{/* Subtítulo */}  			
				<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom:2, marginTop: 1 }}>
					<View>
						<Text style={{fontSize: 20, fontFamily:'Dancing Script', textAlign: 'center', marginTop: 10}} fixed>El director del Centro de Idiomas</Text>
					</View>
				</View>
  				
				<Text style={{fontSize: 70, textAlign: 'center', fontFamily: 'PinyonScript', marginTop: 20, marginBottom: 40}} fixed>Certifica</Text>

				{/* Certificado */}
				<View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom:2, paddingHorizontal:55 }}>
					<Text style={styles.text2}>Que</Text>
					<View style={{ flexGrow: 1, borderBottomWidth: 1, borderBottomColor: 'black', borderBottomStyle: 'solid', marginLeft: 5, marginRight: 5 }}>
						<Text style={styles.alumno}>{capitalizeFirstLetterOfEachWord(alumno)}</Text>
					</View>
				</View>
				<View style={{ paddingHorizontal:55 }}>
					{
						formato === 1 ? 
						(
							<Text style={[styles.text2,{textAlign: 'justify'}]} hyphenationCallback={(word)=>[word]}>
								ha concluido satisfactoriamente el <Text style={styles.text3}>{` NIVEL ${nivel} `}</Text> 
								del curso de  <Text style={styles.text3}>{idioma}</Text>, de acuerdo al <Text style={{fontFamily: 'Roboto-Bold'}}>MARCO COMÚN EUROPEO DE
								REFERENCIA PARA LAS LENGUAS</Text>, en el nivel <Text style={styles.text3}>A2</Text>, en nuestra casa
								Superior de Estudios con un total de <Text style={styles.text3}>{horas}</Text>  horas.
								Se le expide el presente, a solicitud de la parte interesada para los fines pertinentes.
							</Text>
						):(
							<>
							<Text style={[styles.text2,{textAlign:'justify'}]} hyphenationCallback={(word)=>[word]}>
								ha concluido satisfactoriamente el <Text style={styles.text3}>{` NIVEL ${nivel} `}</Text> 
								del idioma <Text style={styles.text3}>{idioma}</Text>, en nuestra casa
								Superior de Estudios con un total de <Text style={styles.text3}>{horas}</Text>{' '}horas.
							</Text>
							<Text style={[styles.text2, { textAlign: 'justify' }]}>
                				Se le expide el presente, a solicitud de la parte interesada para los fines pertinentes.
            				</Text>
							<View style={{marginTop: 10}}></View>
							</>
						)
					}
					
				</View>
				<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom:2, marginTop: 7 }}>
					<View>
						{
							duplicado && (
								<View style={styles.doubleView}>
									<Text style={styles.doubleText}>DUPLICADO</Text>
								</View>
							)
						}
						{/*<Image style={{ width: 120 }} src={QRCode} />*/}
					</View>
					<View style={{paddingRight:55}}>
						<Text style={styles.text2}>
							Callao, <Text style={{ fontSize: 16, fontWeight: 'bold'}}>
								{fecha_emision}</Text>
						</Text>
						{/*<Image style={{marginBottom: 10, marginHorizontal: 20, width: 150, marginTop: 30}} src={selloDirector.src}/>*/}
	  				</View>
				</View>
				{/* Firma reemplazada por QR */}
				<View style={{ alignItems: 'flex-start', marginTop: 25, paddingLeft:55 }}>
					<View style={{ width: 200, alignItems: 'center', marginBottom: 6 }}>
						<Image style={{ width: 100 }} src={QRCode} />
					</View>
				</View>
				{/* Espacio para firma digital */}
				<View style={{marginTop: 10}}>
					{/* N° de Registro */}
					<Text style={[styles.text2,{marginTop: 10, paddingLeft:55, fontSize: 14}]}> 
						N° de Registro: <Text style={[styles.text3,{fontSize: 14}]}>{numero_folio}</Text>
					</Text>
				</View>  
				{/* Banderas inferior - Página 1 */}
				<View style={styles.banner} fixed>
					{Array.from({ length: 7 }).map((_, i) => (
						<Image key={`bandera-p1-${i}`} style={styles.bannerImage} src={banderas.src} />
					))}
				</View>
            </Page>
			{/********************** PAGE 2 ********************/}
            <Page size="A4" style={[styles.page,{paddingHorizontal:65}]}>
            <Text style={{fontSize: 30, textAlign: 'center', fontFamily: 'Roboto-Bold', marginTop: 10, marginBottom: 20}}>NIVEL {nivel}</Text>
                <View style={styles.table}>
					<View style={styles.tableRow}>
						<View style={[styles.tableColHeader, {width: '38%'}]}>
							<Text style={styles.tableCellHeader}>CURSO</Text>
						</View>
						<View style={[styles.tableColHeader, {width: '38%'}]}>
							<Text style={styles.tableCellHeader}>CICLO</Text>
						</View>
						<View style={[styles.tableColHeader, {width: '24%'}]}>
							<Text style={styles.tableCellHeader}>NOTAS</Text>
						</View>
					</View>
                </View>
				<View style={{marginBottom: 5}}>
					{rows.map((item, index)=>(
						<View style={styles.tableRow} key={index}>
							<View style={[styles.tableCol, {width: '38%'}]}>
								<Text style={styles.tableCell}>{item.curso}</Text>
							</View>
							<View style={[styles.tableCol, {width: '38%'}]}>
								{item.modalidad !== '' && <Text style={styles.tableCell}>{`${item.ciclo} (${item.modalidad})`}</Text>}
								{/*curricula_antigua && index === 8 && <Text style={styles.tableCell}>CURRICULA ANTIGUA</Text>*/}
								{curricula_antigua && index === 8 && (
									<View
										style={{
											borderWidth: 2,
											borderColor: 'black',
											//marginTop: 5, // Espaciado superior
											textAlign: 'center', // Centrado del texto
											alignItems: 'center',
											justifyContent: 'center',
											display: 'flex',
										}}
									>
										<Text style={[styles.tableCell, {textAlign: 'center'}]}>CURRICULA ANTIGUA</Text>
									</View>
								)}
							</View>
							<View style={[styles.tableCol, {width: '24%'}]}>
								{item.nota !== 0 && <Text style={styles.tableCell}>{item.nota}</Text>}
							</View>
						</View>
					))}
					
				</View>
				<Text style={{fontSize: 14, textAlign: 'center', fontFamily: 'Dancing Script', marginTop: 5, marginBottom: 20}}>Curso Concluido : {fecha_conclusion}</Text>
				
				<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: 40}}>

				</View>
				<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: 10 }}>
					<View style={{ fontSize: 10 }}>
						<Text style={{fontSize: 12, fontWeight: 'bold', fontFamily : 'Roboto-Bold'}}>IMPORTANTE:</Text>
						<Text>La nota mínima aprobatoria es de 75 puntos</Text>
						<View style={{ marginTop: 10 }}>
							<Text>*EX.U. EXAMEN DE UBICACIÓN.</Text>
							<Text>*C.I. CICLO INTENSIVO.</Text>
							<Text>*C.I. CICLO REGULAR.</Text>
						</View>
					</View>
					<View style={{ position:'absolute', alignItems: 'center', fontSize: 9, bottom: -10, right: -20, width: '50%', paddingTop:20}}>
						{
							duplicado && (
								<View style={[styles.doubleView]}>
									<Text style={styles.doubleText}>DUPLICADO</Text>
									<Text>DEL CERTIFICADO N° {certificado_anterior}</Text>
								</View>
							)
						}
						
						<Text>Registrado en el libro de Certificados</Text>
						<Text>Nivel {nivel} bajo el N° {numero_folio}</Text>
						<Text>Elaborado por: {elaborador}</Text>
						<Text>Callao, {fecha_emision}</Text>
					</View>
				</View>
				<View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: 10 }}>
					<Link src={url} style={{ fontSize: 10, marginTop: 15, color: '#0659A7', textDecoration: 'underline' }}>{url}</Link>
					<Text style={{fontSize: 12, textAlign: 'center', fontFamily: 'Roboto-Bold', marginTop: 15}}>
						Av. Juan Pablo II N° 310 Bellavista - Callao
					</Text>
					<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 5}}>
						{/* Teléfono */}
						<View style={{flexDirection: 'row', alignItems: 'center', marginRight: 12}}>
							<Image src={"https://img.icons8.com/ios-filled/50/000000/phone.png"} style={{ width: 10, height: 10 }} />
							<Text style={{fontSize: 12, fontFamily: 'Roboto-Bold', marginLeft: 4}}>(01) 4291931</Text>
						</View>
						{/* Web */}
						<View style={{flexDirection: 'row', alignItems: 'center', marginRight: 12}}>
							<Image src={"https://img.icons8.com/ios-filled/50/000000/internet.png"} style={{ width: 10, height: 10 }} />
							<Text style={{fontSize: 12, fontFamily: 'Roboto-Bold', marginLeft: 4}}>ciunac.unac.edu.pe</Text>
						</View>
						{/* Correo */}
						<View style={{flexDirection: 'row', alignItems: 'center'}}>
							<Image src={"https://img.icons8.com/ios-filled/50/000000/new-post.png"} style={{ width: 10, height: 10 }} />
							<Text style={{fontSize: 12, fontFamily: 'Roboto-Bold', marginLeft: 4}}>ciunac.certificados@unac.edu.pe</Text>
						</View>
					</View>
				</View>
				{/* Banderas inferior - Página 2 */}
				<View style={styles.banner} fixed>
					{Array.from({ length: 7 }).map((_, i) => (
						<Image key={`bandera-p2-${i}`} style={styles.bannerImage} src={banderas.src} />
					))}
				</View>
            </Page>
        </Document>
    )
}
