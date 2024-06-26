'use client';
import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';

export default function CreateForm({token}: {token: string}) {
    const [name, setName] = useState('');
    const router = useRouter()

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(process.env.NEXT_PUBLIC_BACKEND_URL)
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create/${name}`, {
            headers: {
                'Authorization': "Bearer " + token
            },
            method: 'POST'
        })
        if (!res.ok) {
            alert(await res.text())
            return
        }
        router.push('/blogs/' + name)
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col items-center gap-2 mt-4'>
            <input 
                type="text" 
                id="name" 
                name="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className='mr-2'
            />
            <button type="submit" className='text-blue-500'>Submit</button>
        </form>
    );
}
