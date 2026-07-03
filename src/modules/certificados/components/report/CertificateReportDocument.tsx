/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import unacLogo from '@/assets/unac-logo.png'
import ciunacLogo from '@/assets/logo-ciunac-trans.png'
import elaboradorSignature from '@/assets/elaboradoring.jpg'
import {
    ICertificadoReporteItem,
    ICertificadoReporteResponse,
} from '@/modules/certificados/interfaces/certificado-reporte.interface'

type Props = {
    data: ICertificadoReporteResponse
    reportNumber: string
    generatedAt?: Date
}

type ReportGroup = {
    title: string
    items: ICertificadoReporteItem[]
}

type ReportTableChunk = {
    title: string
    items: ICertificadoReporteItem[]
    startIndex: number
    continued: boolean
    showSubtotal: boolean
    groupTotal: number
}

type ReportPage = {
    showIntro: boolean
    tables: ReportTableChunk[]
}

const styles = StyleSheet.create({
    page: {
        paddingTop: 30,
        paddingRight: 38,
        paddingBottom: 46,
        paddingLeft: 38,
        fontFamily: 'Helvetica',
        fontSize: 9,
        color: '#171717',
    },
    letterhead: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 70,
        marginBottom: 8,
    },
    unacLogo: {
        width: 62,
        height: 62,
        objectFit: 'contain',
    },
    ciunacLogo: {
        width: 105,
        height: 62,
        objectFit: 'contain',
    },
    institution: {
        width: '62%',
        textAlign: 'center',
        lineHeight: 1.35,
    },
    institutionMain: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 12,
    },
    institutionSecondary: {
        marginTop: 2,
        fontFamily: 'Helvetica-Bold',
        fontSize: 10,
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: '#234b78',
        marginBottom: 12,
    },
    reportTitle: {
        marginBottom: 14,
        fontFamily: 'Helvetica-Bold',
        fontSize: 12,
        textAlign: 'center',
        textDecoration: 'underline',
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 5,
        lineHeight: 1.3,
    },
    detailLabel: {
        width: 58,
        fontFamily: 'Helvetica-Bold',
    },
    detailText: {
        flex: 1,
    },
    subject: {
        fontFamily: 'Helvetica-Bold',
    },
    date: {
        marginTop: 7,
        marginBottom: 12,
        textAlign: 'right',
        fontFamily: 'Helvetica-Bold',
    },
    paragraph: {
        marginBottom: 13,
        fontSize: 9.5,
        lineHeight: 1.55,
        textAlign: 'justify',
    },
    compactHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingBottom: 7,
        borderBottomWidth: 1,
        borderBottomColor: '#234b78',
    },
    compactLogo: {
        width: 54,
        height: 30,
        objectFit: 'contain',
    },
    compactTitle: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 9,
        textAlign: 'center',
    },
    groupTitle: {
        paddingVertical: 6,
        paddingHorizontal: 8,
        backgroundColor: '#234b78',
        color: '#ffffff',
        fontFamily: 'Helvetica-Bold',
        fontSize: 9.5,
        textTransform: 'uppercase',
    },
    table: {
        width: '100%',
        borderLeftWidth: 0.7,
        borderTopWidth: 0.7,
        borderColor: '#7c8794',
    },
    row: {
        flexDirection: 'row',
        minHeight: 23,
    },
    headerRow: {
        flexDirection: 'row',
        minHeight: 25,
        backgroundColor: '#e8eef5',
    },
    cell: {
        justifyContent: 'center',
        paddingVertical: 4,
        paddingHorizontal: 3,
        borderRightWidth: 0.7,
        borderBottomWidth: 0.7,
        borderColor: '#7c8794',
    },
    headerCell: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 7.2,
        textAlign: 'center',
    },
    bodyCell: {
        fontSize: 7.1,
        lineHeight: 1.25,
    },
    centered: {
        textAlign: 'center',
    },
    colIndex: { width: '5%' },
    colRegister: { width: '17%' },
    colStudent: { width: '32%' },
    colLanguage: { width: '13%' },
    colLevel: { width: '14%' },
    colVoucher: { width: '19%' },
    totals: {
        marginTop: 7,
        alignItems: 'flex-end',
    },
    subtotal: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 8.5,
    },
    grandTotal: {
        marginTop: 4,
        paddingTop: 4,
        borderTopWidth: 1,
        borderTopColor: '#234b78',
        fontFamily: 'Helvetica-Bold',
        fontSize: 9.5,
    },
    closing: {
        marginTop: 10,
        alignItems: 'center',
    },
    closingText: {
        width: '100%',
        marginBottom: 2,
        fontSize: 9.5,
        lineHeight: 1.45,
        textAlign: 'left',
    },
    signature: {
        width: 180,
        height: 62,
        objectFit: 'contain',
    },
    footer: {
        position: 'absolute',
        left: 38,
        right: 38,
        bottom: 22,
        paddingTop: 5,
        borderTopWidth: 0.5,
        borderTopColor: '#aeb7c1',
        color: '#5d6772',
        fontSize: 7.5,
        textAlign: 'center',
    },
})

const getDateParts = (date: Date) => {
    const parts = new Intl.DateTimeFormat('es-PE', {
        timeZone: 'America/Lima',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).formatToParts(date)

    return {
        day: parts.find((part) => part.type === 'day')?.value ?? '',
        month: parts.find((part) => part.type === 'month')?.value.toLocaleLowerCase('es-PE') ?? '',
        year: parts.find((part) => part.type === 'year')?.value ?? '',
    }
}

export const getCertificateReportYear = (date = new Date()) => getDateParts(date).year

const getGroups = (data: ICertificadoReporteResponse): ReportGroup[] => [
    { title: 'Certificados básicos digitales', items: data.basico?.digitales ?? [] },
    { title: 'Certificados básicos físicos', items: data.basico?.fisicos ?? [] },
    { title: 'Certificados intermedios y avanzados digitales', items: data.intermedioAvanzado?.digitales ?? [] },
    { title: 'Certificados intermedios y avanzados físicos', items: data.intermedioAvanzado?.fisicos ?? [] },
].filter((group) => group.items.length > 0)

const paginateGroups = (groups: ReportGroup[]): ReportPage[] => {
    const tableOverhead = 3
    const pages: ReportPage[] = [{ showIntro: true, tables: [] }]
    let currentPage = pages[0]
    let remainingCapacity = 19

    groups.forEach((group) => {
        let offset = 0

        while (offset < group.items.length) {
            if (remainingCapacity <= tableOverhead) {
                currentPage = { showIntro: false, tables: [] }
                pages.push(currentPage)
                remainingCapacity = 26
            }

            const pageSize = Math.min(group.items.length - offset, remainingCapacity - tableOverhead)
            const items = group.items.slice(offset, offset + pageSize)
            const nextOffset = offset + items.length

            currentPage.tables.push({
                title: group.title,
                items,
                startIndex: offset,
                continued: offset > 0,
                showSubtotal: nextOffset >= group.items.length,
                groupTotal: group.items.length,
            })

            remainingCapacity -= items.length + tableOverhead
            offset = nextOffset

            if (offset < group.items.length) {
                currentPage = { showIntro: false, tables: [] }
                pages.push(currentPage)
                remainingCapacity = 26
            }
        }
    })

    return pages
}
const getImageSource = (image: { src: string } | string) => typeof image === 'string' ? image : image.src


const Letterhead = () => (
    <>
        <View style={styles.letterhead}>
            <Image src={getImageSource(unacLogo)} style={styles.unacLogo} />
            <View style={styles.institution}>
                <Text style={styles.institutionMain}>UNIVERSIDAD NACIONAL DEL CALLAO</Text>
                <Text style={styles.institutionSecondary}>CENTRO DE IDIOMAS</Text>
            </View>
            <Image src={getImageSource(ciunacLogo)} style={styles.ciunacLogo} />
        </View>
        <View style={styles.divider} />
    </>
)

const CompactHeader = ({ title }: { title: string }) => (
    <View style={styles.compactHeader}>
        <Image src={getImageSource(unacLogo)} style={styles.compactLogo} />
        <Text style={styles.compactTitle}>{title}</Text>
        <Image src={getImageSource(ciunacLogo)} style={styles.compactLogo} />
    </View>
)

const DetailRow = ({ label, children, bold = false }: { label: string, children: React.ReactNode, bold?: boolean }) => (
    <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={[styles.detailText, bold ? styles.subject : {}]}>{children}</Text>
    </View>
)

const ReportTable = ({ title, items, startIndex, continued }: {
    title: string
    items: ICertificadoReporteItem[]
    startIndex: number
    continued: boolean
}) => (
    <View>
        <Text style={styles.groupTitle}>{title}{continued ? ' (continuación)' : ''}</Text>
        <View style={styles.table}>
            <View style={styles.headerRow} wrap={false}>
                <View style={[styles.cell, styles.colIndex]}><Text style={styles.headerCell}>N°</Text></View>
                <View style={[styles.cell, styles.colRegister]}><Text style={styles.headerCell}>N° REGISTRO</Text></View>
                <View style={[styles.cell, styles.colStudent]}><Text style={styles.headerCell}>ALUMNO</Text></View>
                <View style={[styles.cell, styles.colLanguage]}><Text style={styles.headerCell}>IDIOMA</Text></View>
                <View style={[styles.cell, styles.colLevel]}><Text style={styles.headerCell}>NIVEL</Text></View>
                <View style={[styles.cell, styles.colVoucher]}><Text style={styles.headerCell}>N° VOUCHER</Text></View>
            </View>
            {items.map((item, index) => (
                <View key={`${item.numeroRegistro}-${startIndex + index}`} style={styles.row} wrap={false}>
                    <View style={[styles.cell, styles.colIndex]}><Text style={[styles.bodyCell, styles.centered]}>{startIndex + index + 1}</Text></View>
                    <View style={[styles.cell, styles.colRegister]}><Text style={[styles.bodyCell, styles.centered]}>{item.numeroRegistro?.trim()}</Text></View>
                    <View style={[styles.cell, styles.colStudent]}><Text style={styles.bodyCell}>{item.alumno}</Text></View>
                    <View style={[styles.cell, styles.colLanguage]}><Text style={[styles.bodyCell, styles.centered]}>{item.idioma}</Text></View>
                    <View style={[styles.cell, styles.colLevel]}><Text style={[styles.bodyCell, styles.centered]}>{item.nivel}</Text></View>
                    <View style={[styles.cell, styles.colVoucher]}><Text style={[styles.bodyCell, styles.centered]}>{item.numeroVoucher}</Text></View>
                </View>
            ))}
        </View>
    </View>
)

export default function CertificateReportDocument({ data, reportNumber, generatedAt = new Date() }: Props) {
    const date = getDateParts(generatedAt)
    const reportTitle = `INFORME N° ${reportNumber}-${date.year}-CAGDLCP`
    const groups = getGroups(data)
    const pages = paginateGroups(groups)
    const grandTotal = groups.reduce((total, group) => total + group.items.length, 0)

    return (
        <Document title={reportTitle} author="Centro de Idiomas - UNAC" subject="Relación de certificados para firma">
            {pages.map((reportPage, pageIndex) => {
                const isLastPage = pageIndex === pages.length - 1

                return (
                    <Page key={pageIndex} size="A4" style={styles.page} wrap>
                        {reportPage.showIntro ? (
                            <>
                                <Letterhead />
                                <Text style={styles.reportTitle}>{reportTitle}</Text>
                                <DetailRow label="PARA:">DR. NÉSTOR GOMERO OSTOS - DIRECTOR DEL CENTRO DE IDIOMAS</DetailRow>
                                <DetailRow label="DE:">CARLOS ANDRÉS GONZALES DE LA COTERA PALACIOS - ASISTENTE ADMINISTRATIVO</DetailRow>
                                <DetailRow label="ASUNTO:" bold>INFORME SOBRE LA FIRMA DEL DIRECTOR EN LOS CERTIFICADOS DEL CENTRO DE IDIOMAS</DetailRow>
                                <Text style={styles.date}>{`CALLAO ${date.day} de ${date.month} ${date.year}`}</Text>
                                <Text style={styles.paragraph}>
                                    Es grato dirigirme al despacho de su honorable cargo para expresarle mi fraternal saludo; asimismo, para informarle la relación numérica de los certificados de idiomas ejecutados con la rúbrica del director Néstor Gomero Ostos. A continuación, se detalla de la siguiente manera.
                                </Text>
                            </>
                        ) : (
                            <CompactHeader title={reportTitle} />
                        )}

                        {reportPage.tables.map((table, tableIndex) => (
                            <View key={`${table.title}-${table.startIndex}`} style={{ marginTop: tableIndex === 0 ? 0 : 12 }}>
                                <ReportTable
                                    title={table.title}
                                    items={table.items}
                                    startIndex={table.startIndex}
                                    continued={table.continued}
                                />
                                {table.showSubtotal && (
                                    <View style={styles.totals}>
                                        <Text style={styles.subtotal}>{`Subtotal: ${table.groupTotal} certificado${table.groupTotal === 1 ? '' : 's'}`}</Text>
                                    </View>
                                )}
                            </View>
                        ))}

                        {isLastPage && (
                            <>
                                <View style={styles.totals}>
                                    <Text style={styles.grandTotal}>{`TOTAL GENERAL: ${grandTotal} CERTIFICADOS`}</Text>
                                </View>
                                <View style={styles.closing} wrap={false}>
                                    <Text style={styles.closingText}>Es cuanto tengo que informar a usted.</Text>
                                    <Text style={styles.closingText}>Atentamente,</Text>
                                    <Image src={getImageSource(elaboradorSignature)} style={styles.signature} />
                                </View>
                            </>
                        )}

                        <Text
                            style={styles.footer}
                            fixed
                            render={({ pageNumber, totalPages }) => `${reportTitle}  |  Página ${pageNumber} de ${totalPages}`}
                        />
                    </Page>
                )
            })}
        </Document>
    )
}
