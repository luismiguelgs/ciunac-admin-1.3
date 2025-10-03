import Grid from '@mui/material/Grid2';
import { auth } from '@/auth';
import { Typography } from '@mui/material';
import Graphs from './(components)/Graphs';

export default async function Page() 
{
    const session = await auth();

    return (
        <Grid container spacing={2}>
            <Grid size={{xs: 12}}>
                <Typography variant='subtitle2' gutterBottom>Bienvenido, {session?.user?.email}</Typography>
            </Grid>
            <Graphs />
        </Grid>
    );
}