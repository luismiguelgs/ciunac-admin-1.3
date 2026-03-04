import { View, Text, StyleSheet, Font } from "@react-pdf/renderer";
import React from "react";

Font.register({ family: 'Roboto-Bold', src: '/fonts/Roboto-Bold.ttf' })
Font.register({ family: 'Dancing Script', src: '/fonts/DancingScript-VariableFont_wght.ttf' })

const styles = StyleSheet.create({
    text2: {
        fontSize: 18,
        fontFamily: 'Dancing Script',
        lineHeight: 1.5
    },
    text3: {
        fontSize: 18,
        fontFamily: 'Roboto-Bold',
        marginLeft: 6,
        marginRight: 6
    },
});

export default function BodyView({ idioma, nivel, horas }: { idioma: string; nivel: string; horas: number }) {
    const cefrLevel = (() => {
        const lang = idioma?.toUpperCase() || '';
        const level = nivel?.toUpperCase() || '';

        if (lang === 'INGLÉS') {
            if (level.includes('BÁSICO')) return 'A2';
            if (level.includes('INTERMEDIO')) return 'B2 (Usuarios Independiente Inicial)';
            if (level.includes('AVANZADO')) return 'C1';
        }

        if (['PORTUGUÉS', 'ITALIANO', 'FRANCÉS'].includes(lang)) {
            if (level.includes('BÁSICO')) return 'A2';
            if (level.includes('INTERMEDIO')) return 'B1';
            if (level.includes('AVANZADO')) return 'B2';
        }

        return null;
    })();

    return (
        <React.Fragment>
            <View>
                {
                    cefrLevel ?
                        (
                            <Text style={[styles.text2, { textAlign: 'justify' }]} hyphenationCallback={(word) => [word]}>
                                ha concluido satisfactoriamente el <Text style={styles.text3}>{` NIVEL ${nivel} `}</Text>
                                del idioma <Text style={styles.text3}>{idioma}</Text>, de acuerdo al <Text style={{ fontFamily: 'Roboto-Bold' }}>MARCO COMÚN EUROPEO DE
                                    REFERENCIA PARA LAS LENGUAS</Text>, en el nivel <Text style={styles.text3}>{cefrLevel}</Text>, en nuestra Casa
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
        </React.Fragment>
    )
}