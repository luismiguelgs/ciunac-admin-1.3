'use client'
import React from 'react'
import useConstancias from '@/modules/constancias/hooks/useConstancias'
import ConstanciasList from '@/modules/constancias/components/ConstanciasList'
import { Skeleton } from '@mui/material'

export default function ConstanciasPage() 
{
    const {data, setData} = useConstancias(false)

    const ConstanciasListSkeleton = () => {
        return (
            <div>
                <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={400} />
            </div>
        )
    }

    return (
        <React.Suspense fallback={<ConstanciasListSkeleton />}>
            <ConstanciasList rows={data} setRows={setData} printed={false} />
        </React.Suspense>
        
    )
}