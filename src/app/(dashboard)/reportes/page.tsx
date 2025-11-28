import React from 'react'
import MyTabs, { PanelTab } from '@/components/MUI/MyTabs';
import { Box } from '@mui/material';
import ReportCertificate from '@/modules/reportes/ReportCertificate';
import ReportExam from '../../../modules/reportes/ReportExam';

export default function ReportsPage() 
{
  
    const panels:PanelTab[] = [
    {
        label: 'Certificados',
        content: <ReportCertificate />
    },
    {
        label: 'Examen de Ubicación',
        content: <ReportExam />
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
