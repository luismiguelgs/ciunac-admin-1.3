'use client'
import { StyleSheet, Document, Page, View, Text, Font, Image } from '@react-pdf/renderer'
import QRCode from 'qrcode'
import selloDirector from '@/assets/firma.jpg'
//import selloCoordinadora from '@/assets/coordinadora.jpg'
import selloCoordinadora from '@/assets/sello.jpg'
//import selloElaborador from '@/assets/elaboradortemporal.jpg'
import selloElaborador from '@/assets/elaboradoring.jpg'
import { ICertificadoNota } from '@/modules/certificados/interfaces/certificado.interface'
import React from 'react'
import { capitalizeFirstLetterOfEachWord } from '@/lib/utils'

Font.register({ family: 'Dancing Script', src: '/fonts/DancingScript-VariableFont_wght.ttf' })
Font.register({ family: 'PinyonScript', src: '/fonts/PinyonScript-Regular.ttf' })
Font.register({ family: 'Roboto-Bold', src: '/fonts/Roboto-Bold.ttf' })

export const generateSessionPDFQrCode = async (
	baseUrl: string,
): Promise<string> => {
	return await QRCode.toDataURL(
		baseUrl
	)
}

const styles = StyleSheet.create({
	page: {
		paddingTop: 45,
		paddingBottom: 45,
	},
	text2: {
		fontSize: 18,
		fontFamily: 'Dancing Script',
		lineHeight: 1.5
	},
	alumno: {
		fontSize: 24,
		fontFamily: 'PinyonScript',
		textAlign: 'center',
		marginHorizontal: 'auto',
	},
	text3: {
		fontSize: 18,
		fontFamily: 'Roboto-Bold',
		marginLeft: 6,
		marginRight: 6
	},
	imageSello: {
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
	},
	doubleText: {
		fontFamily: 'Roboto-Bold', // Fuente Roboto-Bold
		fontSize: 20, // Tamaño de fuente
		textAlign: 'center',
		alignSelf: 'center',
		textTransform: 'uppercase', // Convierte el texto a mayúsculas
	}
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
	curricula_antigua?: boolean,
	notas: ICertificadoNota[] | undefined
}
export default function CertificateFormat({ certificado_anterior, curricula_antigua,
	duplicado = true, formato, url, idioma = 'IDIOMA', nivel, fecha_emision, fecha_conclusion, notas, alumno, horas, numero_folio, elaborador = '' }: Props) {
	const QRCode = generateSessionPDFQrCode(url)

	const sortedData = notas?.sort((a, b) => {
		const aNumber = parseInt(a.ciclo.match(/\d+$/)?.[0] || '0');
		const bNumber = parseInt(b.ciclo.match(/\d+$/)?.[0] || '0');
		return aNumber - bNumber;
	});

	const rows = [...sortedData as Array<ICertificadoNota>];
	const rowsToAdd = 9 - rows.length;
	for (let i = 0; i < rowsToAdd; i++) {
		rows.push({ ciclo: '', periodo: '', modalidad: '', nota: 0 });
	}

	return (
		<Document>
			{/********************** PAGE 1 ********************/}
			<Page size="A4" style={[styles.page, { paddingHorizontal: 75 }]}>
				<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 2, marginTop: 10 }}>
					<View>
						<Text style={{ fontSize: 20, fontFamily: 'Dancing Script', marginTop: 120 }} fixed>El director del Centro de Idiomas</Text>
					</View>
					<View>
						<Image style={{ width: 120, marginTop: 70 }} src={QRCode} />
					</View>
				</View>

				<Text style={{ fontSize: 70, textAlign: 'center', fontFamily: 'PinyonScript', marginTop: 40, marginBottom: 40 }} fixed>Certifica</Text>
				<View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 2 }}>
					<Text style={styles.text2}>Que</Text>
					<View style={{ flexGrow: 1, borderBottomWidth: 1, borderBottomColor: 'black', borderBottomStyle: 'solid', marginLeft: 5, marginRight: 5 }}>
						<Text style={styles.alumno}>{capitalizeFirstLetterOfEachWord(alumno)}</Text>
					</View>
				</View>
				{
					curricula_antigua ? (
						<View>
							<Text style={[styles.text2, { textAlign: 'justify' }]} hyphenationCallback={(word) => [word]}>
								ha concluido satisfactoriamente el <Text style={styles.text3}>{` NIVEL ${nivel} `}</Text>
								de la currícula antigua del idioma  <Text style={styles.text3}>{idioma}</Text>, en nuestra Casa
								Superior de Estudios con un total de <Text style={styles.text3}>{240}</Text>  horas.
								Se le expide el presente, a solicitud de la parte interesada para los fines pertinentes.
							</Text>
						</View>
					) : (
						<View>
							{
								formato === 1 ?
									(
										<Text style={[styles.text2, { textAlign: 'justify' }]} hyphenationCallback={(word) => [word]}>
											ha concluido satisfactoriamente el <Text style={styles.text3}>{` NIVEL ${nivel} `}</Text>
											del idioma <Text style={styles.text3}>{idioma}</Text>, de acuerdo al <Text style={{ fontFamily: 'Roboto-Bold' }}>MARCO COMÚN EUROPEO DE
												REFERENCIA PARA LAS LENGUAS</Text>, en el nivel <Text style={styles.text3}>A2</Text>, en nuestra Casa
											Superior de Estudios con un total de <Text style={styles.text3}>{horas}</Text>  horas.
											Se le expide el presente, a solicitud de la parte interesada para los fines pertinentes.
										</Text>
									) : (
										<>
											<Text style={[styles.text2, { textAlign: 'justify' }]} hyphenationCallback={(word) => [word]}>
												ha concluido satisfactoriamente el <Text style={styles.text3}>{` NIVEL ${nivel} `}</Text>
												del idioma <Text style={styles.text3}>{idioma}</Text>, en nuestra casa
												Superior de Estudios con un total de <Text style={styles.text3}>{horas}</Text>{' '}horas.
											</Text>
											<Text style={[styles.text2, { textAlign: 'justify' }]}>
												Se le expide el presente, a solicitud de la parte interesada para los fines pertinentes.
											</Text>
											<View style={{ marginTop: 10 }}></View>
										</>
									)
							}
						</View>
					)
				}

				<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 2, marginTop: 7 }}>
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
					<View>
						<Text style={styles.text2}>
							Callao, <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
								{fecha_emision}</Text>
						</Text>
						<Image style={{ marginBottom: 10, marginHorizontal: 20, width: 150, marginTop: 30 }} src={selloDirector.src} />
					</View>
				</View>
				<View style={{ marginTop: 10 }}>
					<Text style={styles.text2}>
						N° de Registro: <Text style={styles.text3}>{numero_folio}</Text>
					</Text>
				</View>
			</Page>
			{/********************** PAGE 2 ********************/}
			<Page size="A4" style={[styles.page, { paddingHorizontal: 65 }]}>
				<Text style={{ fontSize: 30, textAlign: 'center', fontFamily: 'Roboto-Bold', marginTop: 10, marginBottom: 20 }}>NIVEL {nivel}</Text>
				<View style={styles.table}>
					<View style={styles.tableRow}>
						<View style={[styles.tableColHeader, { width: '38%' }]}>
							<Text style={styles.tableCellHeader}>CURSO</Text>
						</View>
						<View style={[styles.tableColHeader, { width: '38%' }]}>
							<Text style={styles.tableCellHeader}>CICLO</Text>
						</View>
						<View style={[styles.tableColHeader, { width: '24%' }]}>
							<Text style={styles.tableCellHeader}>NOTAS</Text>
						</View>
					</View>
				</View>
				<View style={{ marginBottom: 5 }}>
					{rows.map((item, index) => (
						<View style={styles.tableRow} key={index}>
							<View style={[styles.tableCol, { width: '38%' }]}>
								<Text style={styles.tableCell}>{item.ciclo}</Text>
							</View>
							<View style={[styles.tableCol, { width: '38%' }]}>
								{item.modalidad !== '' && <Text style={styles.tableCell}>{`${item.periodo} (${item.modalidad})`}</Text>}
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
										<Text style={[styles.tableCell, { textAlign: 'center' }]}>CURRICULA ANTIGUA</Text>
									</View>
								)}
							</View>
							<View style={[styles.tableCol, { width: '24%' }]}>
								{item.nota !== 0 && <Text style={styles.tableCell}>{item.nota}</Text>}
							</View>
						</View>
					))}

				</View>
				<Text style={{ fontSize: 14, textAlign: 'center', fontFamily: 'Dancing Script', marginTop: 5, marginBottom: 20 }}>Curso Concluido : {fecha_conclusion}</Text>
				<View style={styles.table}>
					<View style={styles.tableRow}>
						<View style={[styles.tableCol, { width: '33.33%' }]}>
							<Image style={styles.imageSello} src={selloElaborador.src} />
						</View>
						<View style={[styles.tableCol, { width: '33.33%' }]}>
							<Image style={styles.imageSello} src={selloCoordinadora.src} />
						</View>
						<View style={[styles.tableCol, { width: '33.33%' }]}>
							<Image style={styles.imageSello} src={selloDirector.src} />
						</View>
					</View>
				</View>
				<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: 25 }}>
					<View style={{ fontSize: 10 }}>
						<Text style={{ fontSize: 12, fontWeight: 'bold', fontFamily: 'Roboto-Bold' }}>IMPORTANTE:</Text>
						<Text>La nota mínima aprobatoria es de 75 puntos</Text>
						<View style={{ marginTop: 10 }}>
							<Text>*EX.U. EXAMEN DE UBICACIÓN.</Text>
							<Text>*C.I. CICLO INTENSIVO.</Text>
							<Text>*C.R. CICLO REGULAR.</Text>
						</View>
					</View>
					<View style={{ position: 'absolute', alignItems: 'center', fontSize: 9, bottom: -10, right: -20, width: '50%', paddingTop: 20 }}>
						{
							duplicado && (
								<View style={[styles.doubleView]}>
									<Text style={styles.doubleText}>DUPLICADO</Text>
									<Text>DEL CERTIFICADO N° {certificado_anterior}</Text>
								</View>
							)
						}
						<Text>{alumno}</Text>
						<Text>Registrado en el libro de Certificados</Text>
						<Text>Nivel {nivel} bajo el N° {numero_folio}</Text>
						<Text>Elaborado por: {elaborador}</Text>
						<Text>Callao, {fecha_emision}</Text>
					</View>
				</View>
			</Page>
		</Document>
	)
}
