import React from 'react'
import { ColumnTask } from './Tasks';
import { Isolicitud } from '@/modules/solicitudes/interfaces/solicitud.interface';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities'
import { Box, Typography } from '@mui/material';
import { UniqueIdentifier } from '@dnd-kit/core';
import TaskCard from './TaskCard';

type Props = {
    column: ColumnTask;
    tasks: Isolicitud[]
}
export default function TaskColumn({column,tasks}:Props) 
{
    const tasksIds = React.useMemo(() => {
        return tasks.map((task) => task.id);
    }, [tasks]);
    
    const { setNodeRef, attributes, listeners, transform, transition, isDragging} = useSortable({
        id: column.id,
        data:{
            type: "Column",
            column,
        },
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }
    
    if (isDragging){
        return <Box
            component='div'
            ref={setNodeRef} 
            style={style} 
            sx={{
                backgroundColor: '#BFC9CA',
                opacity: 0.4,
                width:'350px',
                height: '560px',
                maxHeight: '560',
                borderRadius: '0.375rem',
                borderWidth: '2px',
                borderColor: '#ff73e1',
                display: 'flex',
                flexDirection: 'column'
            }}>
        </Box>
    }
    return (
        <Box 
            component='div'
            ref={setNodeRef}
            style={style} 
            sx={{
                backgroundColor: '#BFC9CA',
                width:'350px',
                height: '560px',
                maxHeight: '560px',
                borderRadius: '0.375rem',
                display: 'flex',
                flexDirection: 'column'
            }}>
            {/*******  Column title ***************/}
            <Box 
                component='div'
                {...attributes}
                {...listeners}
                sx={{
                    backgroundColor: '#626567',
                    fontSize: '1rem',
                    cursor: 'grab',
                    color: 'white',
                    minHeight: '60px',
                    borderRadius: '0.375rem',
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    fontWeight: 'bold',
                    borderWidth: "2px",
                    borderColor: '#BFC9CA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Typography component='div' sx={{
                        display:'flex',
                        ml: 2,
                        mt: '2px',
                        mb: '2px'}}>
                            {column.title}
                    </Typography>
            </Box>
            {/*******  Column task container ***************/}
            <Box sx={{
                display: 'flex',
                flexGrow: 1,
                flexDirection: 'column',
                padding: '0.5rem',
                mt: 1,
                overflowX: 'hidden',
                overflowY: 'auto'
            }}>
                <SortableContext items={tasksIds as UniqueIdentifier[]}>
                {
                    tasks.map(task=>(
                        <TaskCard
                            key={task.id} 
                            task={task} 
                        />
                    ))
                }
                </SortableContext>
            </Box>
        </Box>
    )
}
