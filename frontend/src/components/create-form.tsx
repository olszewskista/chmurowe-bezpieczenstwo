'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';

export default function CreateForm({token}: {token: string}) {
    const [name, setName] = useState('');
    const router = useRouter()
    console.log(name)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(process.env.NEXT_PUBLIC_BACKEND_URL)
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create/${name}`, {
            headers: {
                'Authorization': "Bearer " + token
            },
            method: 'POST'
        })
        if (!res.ok) return
        router.push('/blogs/' + name)
        // const json = await res.json()

        // console.log(json)

    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="name" className='mr-2'>Name</label>
            <input 
                type="text" 
                id="name" 
                name="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className='mr-2'
            />
            <button type="submit">Submit</button>
        </form>
    );
}
