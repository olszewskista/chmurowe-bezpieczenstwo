import { auth } from '../auth';

export default async function DisplaySession() {
    
    const session = await auth();
    console.log(session);
    
    if (!session) return null

    if (!session.user) return null;

    return (
        <div>
            {session.user.name}
        </div>
    );
}
