import { auth } from '@/auth';
import CertificateNew from '@/modules/certificados/components/CertificateNew';

export default async function NewCertificatePage() 
{
    const session = await auth();

    return (
        <CertificateNew session={session} />
    )
}
