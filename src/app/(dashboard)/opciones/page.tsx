import MyTabs, { PanelTab } from '@/components/MUI/MyTabs'
import { Box } from '@mui/material'
import React from 'react'
import OptText from '../../../modules/opciones/components/OptText'
import OpSolicitudes from '@/modules/opciones/components/OpSolicitudes'
import OpIdiomas from '@/modules/opciones/components/OpIdiomas'
import OptFacultades from '@/modules/opciones/components/OpFacultades'
import OpEscuelas from '@/modules/opciones/components/OpEscuelas'

export default function OptionsPage() 
{
	const panels:PanelTab[] = [
        {
          label: 'Solicitudes',
          content: <OpSolicitudes />
        },
        {
          label: 'Textos',
          content: <OptText />
        },
        {
          label: 'Idiomas',
          content: <OpIdiomas />
        },
        {
          label: 'Facultades',
          content: <OptFacultades />
        },
		{
			label: 'Escuelas',
			content: <OpEscuelas />
		}
    ]
	return (
		<React.Fragment>
            <Box sx={{ width: '100%' }}>
                <MyTabs panels={panels} />
            </Box>
        </React.Fragment>
	)
}
