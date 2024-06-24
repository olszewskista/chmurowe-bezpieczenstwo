import { signOut } from '@/auth';

export function SignOut() {
    return (
        <form
            action={async () => {
                'use server';
                await signOut();
            }}
        >
            <button type="submit" className='text-red-500'>Sign Out</button>
        </form>
    );
}
