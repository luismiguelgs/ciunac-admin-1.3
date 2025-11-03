import { StyleSheet, Document, Page, View, Text, Font, Image } from '@react-pdf/renderer'
import logoCiunac from '../../../../../public/logo-ciunac.jpg'
import { IExamenUbicacion } from '../../interfaces/examen-ubicacion.interface'
import { IDetalleExamenUbicacion } from '../../interfaces/examen-ubicacion.interface'
import dayjs from 'dayjs'

Font.register({family:'Roboto', src:'https://fonts.gstatic.com/s/roboto/v16/zN7GBFwfMP4uA6AR0HCoLQ.ttf'})

const styles = StyleSheet.create({
	page:{
		paddingTop: 35,
    	paddingBottom: 65,
    	paddingHorizontal: 20,
	},
	title:{
		fontSize: 24,
		textAlign: 'center',
		fontFamily: 'Roboto',
		textDecoration: 'underline'
	},
	subtitle:{
		marginTop: 10,
		fontSize: 18,
		textAlign: 'center',
		fontFamily: 'Roboto',
		textDecoration: 'underline'
	},
	profesor:{
		marginTop: 10,
		fontSize: 14,
		textAlign: 'left',
		fontFamily: 'Roboto',
		textDecoration: 'underline'
	},
	section:{
		margin: 10,
		padding: 10,
		flexGrow: 1,
		fontFamily: 'Roboto'
	},
	image:{
		marginBottom: 10,
		marginHorizontal: 10,
		width: 200,
	},
	header: {
		fontSize: 14,
		marginBottom: 10,
		textAlign: 'center',
		color: 'grey',
	},
	table: {
		//display: 'table',
		width: 'auto',
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#bfbfbf',
		margin: '15px 0',
	},
	tableRow: {
		flexDirection: 'row',
	},
	tableColHeader: {
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#bfbfbf',
		backgroundColor: '#e0e0e0',
		padding: 5,
	},
	tableCol: {
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#bfbfbf',
		padding: 5,
	},
	tableColNombre:{
		width:'25%'
	},
	tableColDatos:{
		width:'14%'
	},
	tableColNota:{
		width:'8%'
	},
	tableCellHeader: {
		margin: 'auto',
		marginTop: 5,
		fontSize: 12,
		fontWeight: 'bold',
	},
	tableCell: {
		margin: 'auto',
		marginTop: 5,
		fontSize: 10,
	},
	firma:{
		position: 'absolute',
		width:'30%',
		borderTopWidth: 1,
		borderTopColor: 'grey',
		textAlign: 'center',
		fontSize: 12,
		bottom: 30,
		left:'38%',
		right:0,
		padding: 10,
		color: 'grey'
	}
})

type Props = {
    data: IExamenUbicacion,
	detalle: IDetalleExamenUbicacion[]
}
export default function ActaFormat({data,detalle }:Props) 
{
	// Número máximo de filas por página
	const rowsPerPage = 14;

	// Dividir los datos en páginas
	const pages = [];
	for (let i = 0; i < detalle.length; i += rowsPerPage) {
	  pages.push(detalle.slice(i, i + rowsPerPage));
	}

	return (
		<Document>
		  {pages.map((pageData, pageIndex) => (
			<Page key={pageIndex} size="A4" style={styles.page}>
			  <Image style={styles.image} src={logoCiunac.src} />
			  <Text style={styles.header} fixed>
				Universidad Nacional del Callao
			  </Text>
			  <Text style={styles.header} fixed>
				Dirección del Centro de Idiomas
			  </Text>
			  <Text style={styles.title} fixed>{`EXAMEN DE UBICACIÓN - ${data.idioma?.nombre}`}</Text>
			  <Text style={styles.subtitle} fixed>
				{dayjs(data.fecha).format('D [de] MMMM [de] YYYY')}
			  </Text>
			  <View style={styles.table}>
				{/* Encabezados de la tabla */}
				<View style={styles.tableRow}>
				  <View style={[styles.tableColHeader, styles.tableColNombre]}>
					<Text style={styles.tableCellHeader}>APELLIDOS</Text>
				  </View>
				  <View style={[styles.tableColHeader, styles.tableColNombre]}>
					<Text style={styles.tableCellHeader}>NOMBRES</Text>
				  </View>
				  <View style={[styles.tableColHeader, styles.tableColDatos]}>
					<Text style={styles.tableCellHeader}>DNI</Text>
				  </View>
				  <View style={[styles.tableColHeader, styles.tableColDatos]}>
					<Text style={styles.tableCellHeader}>NIVEL</Text>
				  </View>
				  <View style={[styles.tableColHeader, styles.tableColDatos]}>
					<Text style={styles.tableCellHeader}>IDIOMA</Text>
				  </View>
				  <View style={[styles.tableColHeader, styles.tableColNota]}>
					<Text style={styles.tableCellHeader}>NOTA</Text>
				  </View>
				</View>
				{/* Datos de la tabla */}
				{pageData.map((item, index) => (
				  <View style={styles.tableRow} key={index}>
					<View style={[styles.tableCol, styles.tableColNombre]}>
					  <Text style={styles.tableCell}>{item.estudiante?.apellidos.toLocaleUpperCase()}</Text>
					</View>
					<View style={[styles.tableCol, styles.tableColNombre]}>
					  <Text style={styles.tableCell}>{item.estudiante?.nombres.toLocaleUpperCase()}</Text>
					</View>
					<View style={[styles.tableCol, styles.tableColDatos]}>
					  <Text style={styles.tableCell}>{item.estudiante?.numeroDocumento}</Text>
					</View>
					<View style={[styles.tableCol, styles.tableColDatos]}>
					  <Text style={styles.tableCell}>{item.nivel?.nombre}</Text>
					</View>
					<View style={[styles.tableCol, styles.tableColDatos]}>
					  <Text style={styles.tableCell}>{item.idioma?.nombre}</Text>
					</View>
					<View style={[styles.tableCol, styles.tableColNota]}>
					  <Text style={styles.tableCell}>{item.nota}</Text>
					</View>
				  </View>
				))}
			  </View>
			  {/* Mostrar información del profesor y firma solo en la última página */}
			  {pageIndex === pages.length - 1 && (
				<>
				  <View style={{ display: 'flex' }}>
					<Text style={styles.profesor}>PROFESOR:</Text>
					<Text style={{ fontSize: 12 }}>{data?.docente?.nombres + ' ' + data?.docente?.apellidos}</Text>
				  </View>
				  <Text style={styles.firma}>FIRMA DEL DOCENTE</Text>
				</>
			  )}
			</Page>
		  ))}
		</Document>
	  );

	/*

	// Número máximo de filas por página
	const rowsPerPage = 15;

	// Dividir los datos en páginas
	const pages = [];
	for (let i = 0; i < data.length; i += rowsPerPage) {
	  pages.push(data.slice(i, i + rowsPerPage));
	}

	return (
	  <Document>
		{pages.map((pageData, pageIndex) => (
		  <Page key={pageIndex} size="A4" style={styles.page}>
			<Image style={styles.image} src={logoCiunac.src} />
			<Text style={styles.header} fixed>
			  Universidad Nacional del Callao
			</Text>
			<Text style={styles.header} fixed>
			  Dirección del Centro de Idiomas
			</Text>
			<Text style={styles.title} fixed>{`EXAMEN DE UBICACIÓN - ${idioma}`}</Text>
			<Text style={styles.subtitle} fixed>
			  {fecha}
			</Text>
			<View style={styles.table}>
			 
			  <View style={styles.tableRow}>
				<View style={[styles.tableColHeader, styles.tableColNombre]}>
				  <Text style={styles.tableCellHeader}>APELLIDOS</Text>
				</View>
				<View style={[styles.tableColHeader, styles.tableColNombre]}>
				  <Text style={styles.tableCellHeader}>NOMBRES</Text>
				</View>
				<View style={[styles.tableColHeader, styles.tableColDatos]}>
				  <Text style={styles.tableCellHeader}>DNI</Text>
				</View>
				<View style={[styles.tableColHeader, styles.tableColDatos]}>
				  <Text style={styles.tableCellHeader}>NIVEL</Text>
				</View>
				<View style={[styles.tableColHeader, styles.tableColDatos]}>
				  <Text style={styles.tableCellHeader}>IDIOMA</Text>
				</View>
				<View style={[styles.tableColHeader, styles.tableColNota]}>
				  <Text style={styles.tableCellHeader}>NOTA</Text>
				</View>
			  </View>
			  
			  {pageData.map((item, index) => (
				<View style={styles.tableRow} key={index}>
				  <View style={[styles.tableCol, styles.tableColNombre]}>
					<Text style={styles.tableCell}>{item.apellidos.toLocaleUpperCase()}</Text>
				  </View>
				  <View style={[styles.tableCol, styles.tableColNombre]}>
					<Text style={styles.tableCell}>{item.nombres.toLocaleUpperCase()}</Text>
				  </View>
				  <View style={[styles.tableCol, styles.tableColDatos]}>
					<Text style={styles.tableCell}>{item.dni}</Text>
				  </View>
				  <View style={[styles.tableCol, styles.tableColDatos]}>
					<Text style={styles.tableCell}>{item.nivel}</Text>
				  </View>
				  <View style={[styles.tableCol, styles.tableColDatos]}>
					<Text style={styles.tableCell}>{item.idioma}</Text>
				  </View>
				  <View style={[styles.tableCol, styles.tableColNota]}>
					<Text style={styles.tableCell}>{item.nota}</Text>
				  </View>
				</View>
			  ))}
			</View>
			
			<View style={{ display: 'flex' }}>
			  <Text style={styles.profesor}>PROFESOR:</Text>
			  <Text style={{ fontSize: 12 }}>{profesor}</Text>
			</View>
			<Text style={styles.firma}>FIRMA DEL DOCENTE</Text>
		  </Page>
		))}
	  </Document>
	);
	*/
}
