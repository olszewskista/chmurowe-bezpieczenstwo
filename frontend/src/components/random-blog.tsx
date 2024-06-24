'use client'

import { redirect, useRouter } from "next/navigation";
import { MouseEvent } from "react";

export default function RandomBlog({token}: {token: string}) {
    const router = useRouter()
    async function handleClick(e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/random_name`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        console.log('dfdfd')
        if (!res.ok) return
        const json = await res.json()
        router.push(`/blogs/${json}`)
    }
    return <>
        <h3>Random blog</h3>
        <button onClick={handleClick}>Click</button>
    </>;
}
