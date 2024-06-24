import { signIn } from '@/auth';

export function SignIn() {
    return (
        <form
            action={async () => {
                'use server';
                await signIn('keycloak');
            }}
        >
            <button type="submit" className='text-green-500'>Sign in with Keycloak</button>
        </form>
    );
}
