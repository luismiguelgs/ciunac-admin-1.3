import { Isolicitud } from '@/modules/solicitudes/interfaces/solicitud.interface'
import React from 'react'
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

type Props = {
    task:Isolicitud,
}
export default function TaskCard({task}:Props) 
{
    const {setNodeRef, attributes, listeners, transform, transition, isDragging, } = useSortable({
        id: task.id as string,
        data: {
          type: "Task",
          task,
        },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        return (
            <Box
                ref={setNodeRef}
                style={style}
                component='div'
                sx={{
                    opacity: '0.3',
                    p: 0.2,
                    height: '180px',
                    minHeight: '180px',
                    borderRadius: '0.5rem',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: '#ff73e1',
                    cursor: 'grabbing',
                    position: 'relative'
                }}
            />
        );
    }
    return (
        <Box
            ref={setNodeRef}
            component='div'
            style={style}
            {...attributes}
            {...listeners}
            sx={{ m:1, '&:hover': {
                border: '3px solid #ff73e1',
                borderRadius: '0.5rem'
            } }}
            >
            <Card sx={{
                p:0.3,
                cursor: 'grab',
                height: '180px',
                minHeight: '180px',
                position: 'relative'
            }}>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {/*task.id*/} {task.solicitud}
                    </Typography>
                    <Typography variant="subtitle2" sx={{fontWeight:'bold', color:'primary'}}>
                        {task.apellidos} {task.nombres}
                    </Typography>
                    <Typography variant="body2">
                        {task.idioma} - {task.nivel}
                        <br />
                        {task.creado} 
                        <br />
                        {task.id}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" startIcon={<VisibilityIcon />}>Detalles</Button>
                </CardActions>
            </Card>
        </Box>
    )
}
