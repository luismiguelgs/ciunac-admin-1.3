'use client'

import React from 'react'
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
} from '@mui/material'

type Props = {
    open: boolean
    loading: boolean
    error: string | null
    year: string
    onClose: () => void
    onSubmit: (reportNumber: string) => void
}

export default function ReportNumberDialog({ open, loading, error, year, onClose, onSubmit }: Props) {
    const [value, setValue] = React.useState('')
    const [validationError, setValidationError] = React.useState<string | null>(null)

    React.useEffect(() => {
        if (!open) {
            setValue('')
            setValidationError(null)
        }
    }, [open])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const parsedValue = Number(value)

        if (!/^\d{1,3}$/.test(value) || parsedValue < 1 || parsedValue > 999) {
            setValidationError('Ingrese un número de informe entre 1 y 999.')
            return
        }

        setValidationError(null)
        onSubmit(value.padStart(3, '0'))
    }

    return (
        <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="xs">
            <form onSubmit={handleSubmit}>
                <DialogTitle>Generar informe de certificados</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Ingrese el correlativo. El informe se generará como INFORME N° {value.padStart(3, '0') || '000'}-{year}-CAGDLCP.
                    </Typography>
                    <TextField
                        autoFocus
                        fullWidth
                        required
                        label="Número de informe"
                        value={value}
                        disabled={loading}
                        error={Boolean(validationError)}
                        helperText={validationError ?? 'Ejemplo: 14 se convertirá en 014.'}
                        onChange={(event) => setValue(event.target.value.replace(/\D/g, '').slice(0, 3))}
                        slotProps={{
                            htmlInput: {
                                inputMode: 'numeric',
                                pattern: '[0-9]*',
                                maxLength: 3,
                            },
                        }}
                    />
                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={loading}>Cancelar</Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? 'Consultando...' : 'Generar informe'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
