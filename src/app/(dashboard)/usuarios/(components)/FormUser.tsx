import { MySelect } from '@/components/MUI'
import { IUsuario } from '../../../../interfaces/usuario.interface'
import { TextField } from '@mui/material'
import { useMask } from '@react-input/mask'
import React from 'react'

type Validation = {
    email:boolean,
    nombre: boolean,
    password: boolean
}

type Props = {
    opt:string,
    item: IUsuario,
    setItem: React.Dispatch<React.SetStateAction<IUsuario>>
    validation: Validation
}
const data = [
    {label: 'Administrador', value:'ADMIN'},
    {label: 'Usuario', value:'USER'},
]

export default function FormUser({opt, item, setItem,validation}:Props) 
{
    const nombreRef = useMask({ mask: '________________________________________', replacement: { _: /^[a-zA-Z \u00C0-\u00FF]*$/ } })
    
    const handleChange = (event:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
        const {name, value} = event.target
        setItem((prevFormData:IUsuario)=>({...prevFormData, [name]:value}))
    }
    return (
        <React.Fragment>
            {
                opt === 'NUEVO' ? (
                    <div>
                    <TextField
                        autoFocus
                        value={item.email}
                        name='email'
                        error={validation.email}
                        label="Email"
                        onChange={(e)=>handleChange(e)}
                        type="text"
                        fullWidth
                        variant="outlined"
                        helperText={validation.email && 'Ingresar un email válido'}
                        sx={{mt:1, mb:1}}
                    />
                    <TextField
                        autoFocus
                        value={item.password}
                        name='password'
                        label="Password"
                        error={validation.password}
                        onChange={(e)=>handleChange(e)}
                        type="password"
                        fullWidth
                        variant="outlined"
                        sx={{mt:1, mb:1}}
                        helperText={ validation.password && 'Ingresar como mínimo 6 caracteres'}
                    />
                    </div>
                ) : null
            }
            <TextField
                name="nombre"
                value={item.nombre}
                label="Nombre"
                inputRef={nombreRef}
                error={validation.nombre}
                onChange={(e)=>handleChange(e)}
                fullWidth
                variant="outlined"
                helperText={ validation.nombre && 'Ingresar un nombre válido'}
                sx={{mt:1, mb:1}}
            />
            <MySelect 
                data={data}
                handleChange={(e)=>handleChange(e)}
                label='Rol'
                name='role'
                value={item.role}
                sx={{mt:1, mb:1}}
            />
        </React.Fragment>
    )
}
