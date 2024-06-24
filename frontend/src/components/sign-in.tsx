import { signIn } from '@/auth';

export function SignIn() {
    return (
        <form
            action={async () => {
                'use server';
                await signIn('keycloak');
            }}
        >
            <button type="submit">Sign in with Keycloak</button>
        </form>
    );
}
