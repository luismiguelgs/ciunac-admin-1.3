import { Box, TextField, Button } from '@mui/material'
import Grid from '@mui/material/Grid2'; // Grid de MUI v5
import React from 'react'
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ISolicitudBeca from '../interfaces/solicitud-beca.interfaces';
import { SolicitudBecasService } from '../services/solicitudes-beca.service';

export default function Observaciones({item}:{item:ISolicitudBeca}) 
{
    const [enabled, setEnabled] = React.useState<boolean>(false)
    const [observaciones, setObservaciones] = React.useState<string>(item.observaciones!)

    const handleEdit = () => {
        setEnabled(!enabled);
    };

    const handleSave = () => {
        // Logic to save the changes
        SolicitudBecasService.updateOpbservaciones(item.id as string, observaciones)
        //alert(JSON.stringify(item))
        setEnabled(false);
    };

    return (
        <Grid container spacing={2}>
            <Grid size={{xs:12, sm:8}}>
                <Box>
                    <TextField
                        id="standard-multiline-flexible"
                        label="Comentarios/Observaciones"
                        multiline
                        minRows={4} // Aumenta el número de filas para más altura
                        maxRows={8} // Aumenta el número de filas para más altura
                        variant="filled"
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        disabled={!enabled}
                        fullWidth
                    />    
                </Box>
            </Grid>
            <Grid size={{xs:12, sm:4}}>
                <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
                    <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={handleEdit} style={{ marginBottom: '10px', width: '100%' }}>
                        Editar
                    </Button>
                    <Button variant="contained" color="secondary" disabled={!enabled} startIcon={<SaveIcon />} onClick={handleSave} style={{ width: '100%' }}>
                        Guardar
                    </Button>
                </Box>
            </Grid>
        </Grid>
    )
}
