
import { Box } from "@mui/material"
import Participants from "./Participants"
import ExamenesUbicacionService from "@/modules/examen-ubicacion/services/examenes-ubicacion.service"

async function getParticipants() {
    return await ExamenesUbicacionService.fetchItemsDetail()
}
async function getExams() {
    return await ExamenesUbicacionService.fetchItems()
}


export default async function ParticipantPage() 
{
    const participants = await getParticipants()
    const exams = await getExams()

    return (
        <Box>
            <Participants data={participants} exams={exams}/>
        </Box>
    )
}
