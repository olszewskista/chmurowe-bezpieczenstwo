import { auth, signOut } from '@/auth';


async function logout() {
    const session = await auth()
    if (!session) return
    console.log(session)
    const url = `${process.env.END_SESSION_URL}?id_token_hint=${session!.id_token}&post_logout_redirect_uri=${encodeURIComponent(process.env.AUTH_URL!)}`;
    try {
        const res = await fetch(url)
        console.log(await res.text())
    } catch(e) {
        console.log(e)
    }
}

export async function SignOut() {

    return (
        <form
            action={async () => {
                'use server';
                await logout()
                await signOut();
            }}
        >
            <button type="submit" className='text-red-500'>Sign Out</button>
        </form>
    );
}
