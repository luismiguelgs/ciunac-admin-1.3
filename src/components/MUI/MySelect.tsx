import { MenuItem, TextField, TextFieldVariants } from '@mui/material'
import React from 'react'

type Props = {
    disabled?:boolean,
    name:string,
    handleChange(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>):void,
    label:string,
    value: string | number
    helperText?: React.ReactNode,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data:any[] | undefined,
    variant?:TextFieldVariants,
    error?:boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sx?:any
    getOptionValue?: (item: any) => string
    getOptionLabel?: (item: any) => string
}

export default function MySelect({variant='outlined', disabled=false,name,handleChange,label, helperText='', data,value,error=false, sx={}, getOptionValue, getOptionLabel}:Props) {
  return (
    <React.Fragment>
        <TextField
            select
            disabled={disabled}
            fullWidth
            variant={variant}
            onChange={e=>handleChange(e)}
            name={name}
            label={label}
            slotProps={{inputLabel: { shrink: true, }}}
            value={value || ''}
            helperText={helperText}
            error={error}
            sx={sx}
        >
        {
            data && data.map((item,index)=>{
                const value = getOptionValue ? getOptionValue(item) : (item?.value ?? item?.id ?? String(index))
                const label = getOptionLabel ? getOptionLabel(item) : (item?.label ?? item?.nombre ?? String(item))
                return(
                    <MenuItem key={index} value={value}>
                        {label}
                    </MenuItem>
                )
            })
        }
        </TextField>
    </React.Fragment>
  )
}
