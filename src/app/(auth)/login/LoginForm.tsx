'use client'
import { MyDialog } from '@/components/MUI'
import { Box, Button, Checkbox, FormControlLabel, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'

import * as yup from 'yup'

const validationSchema = yup.object<{ email: string, password: string, remember: boolean }>({
    email: yup.string().required('Email requerido'),
    password: yup.string().required('Password requerido'),
    remember: yup.boolean()
})

export default function LoginForm() {
    const router = useRouter()
    const [error, setError] = React.useState<string>('') //Error Message
    const [open, setOpen] = React.useState<boolean>(false) //Alert

    const formik = useFormik<{ email: string, password: string, remember: boolean }>({
        initialValues: {
            email: '',
            password: '',
            remember: false
        },
        validationSchema,
        onSubmit: async (values) => {
            //alert(JSON.stringify(values,null, 2))

            const res = await signIn('credentials', {
                email: values.email,
                password: values.password,
                remember: values.remember,
                redirect: false
            })
            if (res?.error) {
                setError(res.error)
                setOpen(true)
            } else {
                router.push('/')
                router.refresh()
            }
        }
    })

    return (
        <React.Fragment>
            <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    value={formik.values.email}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    label="Email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    onChange={formik.handleChange}
                    helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    type="password"
                    value={formik.values.password}
                    autoComplete="current-password"
                    onChange={formik.handleChange}
                    helperText={formik.touched.password && formik.errors.password}
                />
                <FormControlLabel
                    control={<Checkbox checked={formik.values.remember} onChange={formik.handleChange} color="primary" name='remember' />}
                    label="Recuerdame"
                />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Login
                </Button>
            </Box>
            <MyDialog
                content={error}
                open={open}
                setOpen={setOpen}
                title='Error'
                type='SIMPLE'
            />
        </React.Fragment>
    )
}
