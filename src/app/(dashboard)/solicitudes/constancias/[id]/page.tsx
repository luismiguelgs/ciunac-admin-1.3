import RequestDetail from "@/modules/solicitudes/constancias/RequestDetail"

export default function RequestsConstanciasDetail({params}:{params:{id:string}}) 
{
    const id = params.id
    return <RequestDetail id={id} />		
}

