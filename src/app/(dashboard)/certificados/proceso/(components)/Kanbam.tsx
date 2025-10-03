import { Isolicitud } from '@/modules/solicitudes/interfaces/solicitud.interface'
import React from 'react'
import { ColumnTask, defaultCols } from './Tasks'
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { Box } from '@mui/material'
import SolicitudesService from '@/services/solicitudes.service'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import TaskColumn from './TaskColumn'
type Props = {
    data: Isolicitud[]
}
export default function Kanbam({data}:Props) 
{
    const [columns, setColumns] = React.useState<ColumnTask[]>(defaultCols)
    const columnsId = React.useMemo(()=> columns.map((col)=> col.id), [columns])
    const [tasks, setTasks] = React.useState<Isolicitud[]>(data)
    const [ , setActiveColumn] = React.useState<ColumnTask | null>(null)
    const [ , setActiveTask] = React.useState<Isolicitud | null>(null);

    React.useEffect(()=>{
        setTasks(data)
    },[data])

    const sensors = useSensors(useSensor(PointerSensor,{activationConstraint:{
        distance : 10, 
    }}))

    return (
        <Box sx={{
            mt: 1,
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'flex',
            width:'100%',
            alignItems: 'center',
            justifyContent: 'center',
            overflowX: 'auto',
            overflowY: 'hidden',
            paddingLeft: '2px',
            paddingRight: '2px'
        }}>
            <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} sensors={sensors} onDragOver={onDragOver}>
                <Box sx={{display:'flex', flexWrap:'wrap', gap:'0.5rem', justifyContent:'center'}}>
                    <Box sx={{display:'flex', flexWrap:'wrap', gap:'0.5rem'}}>
                        <SortableContext items={columnsId}>
                        {
                            columns.map((column) => (
                                <TaskColumn
                                    key={column.id} 
                                    column={column} 
                                    tasks ={tasks.filter(task => task.estado === column.id)} />
                            ))
                        }
                        </SortableContext>
                    </Box>
                </Box>
            </DndContext>
        </Box>
    )
    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Column") {
          setActiveColumn(event.active.data.current.column);
          return;
        }
    
        if (event.active.data.current?.type === "Task") {
          setActiveTask(event.active.data.current.task);
          return;
        }
    }
    function onDragEnd(event: DragEndEvent) {
        setActiveColumn(null);
        setActiveTask(null);
    
        const { active, over } = event;
        if (!over) return;
    
        const activeId = active.id;
        const overId = over.id;

        //Verificar si se suelta en una columna o encima de una tarea
        if (over.data.current?.type === "Column"){
            //actualizar el estado segun el id de la columna
            SolicitudesService.updateStatus(activeId as string,overId as string)
        }else{
            //actualizar el estado segun el estado de la tarea
            SolicitudesService.updateStatus(activeId as string, over.data.current?.task.estado )
        }
        if (activeId === overId) return;
    
        const isActiveAColumn = active.data.current?.type === "Column";

        if (!isActiveAColumn) return;
    
        setColumns((columns) => {
          const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
    
          const overColumnIndex = columns.findIndex((col) => col.id === overId);
    
          return arrayMove(columns, activeColumnIndex, overColumnIndex);
        });
    }
    function onDragOver(event: DragOverEvent) 
    {
        const { active, over } = event;
        if (!over) return;
    
        const activeId = active.id;
        const overId = over.id;
    
        if (activeId === overId) return;
    
        const isActiveATask = active.data.current?.type === "Task";
        const isOverATask = over.data.current?.type === "Task";
    
        if (!isActiveATask) return;
    
        // Im dropping a Task over another Task
        if (isActiveATask && isOverATask) {
          setTasks((tasks) => {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);
            const overIndex = tasks.findIndex((t) => t.id === overId);
    
            if (tasks[activeIndex].estado != tasks[overIndex].estado) {
              // Fix introduced after video recording
              tasks[activeIndex].estado = tasks[overIndex].estado;
              return arrayMove(tasks, activeIndex, overIndex - 1);
            }
            //console.log("DROPPING TASK OVER TASK", { overId });
            return arrayMove(tasks, activeIndex, overIndex);
          });
        }
    
        const isOverAColumn = over.data.current?.type === "Column";
    
        // Im dropping a Task over a column
        if (isActiveATask && isOverAColumn) {
          setTasks((tasks) => {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);
    
            tasks[activeIndex].estado = overId.toString();
            //console.log("DROPPING TASK OVER COLUMN", { overId });
            
            return arrayMove(tasks, activeIndex, activeIndex);
          });
        }
        //console.log('CAMBIAR ESTADO',{activeId, active, over});
    }
}
