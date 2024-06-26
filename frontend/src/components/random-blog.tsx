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
        if (!res.ok) {
            alert(await res.text())
            return
        }
        const json = await res.json()
        console.log(json)
        router.push(`/blogs/${json}`)
    }
    return <>
        <h3 className="text-xl uppercase font-bold">Random blog</h3>
        <button className='text-blue-500 p-2' onClick={handleClick}>Click</button>
    </>;
}
