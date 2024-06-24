'use client'
import Link from "next/link"
import { ChangeEvent, FormEvent, MouseEvent, useState } from "react"

export default function SearchBlogs({token, admin}: {token: string, admin:boolean}) {
    const [blogs, setBlogs] = useState([])
    const [search, setSearch] = useState('')

    async function handleChange(e:ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value)
        if (e.target.value === '') {
            setBlogs([])
            return
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search/${e.target.value}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        if (!res.ok) return
        const json = await res.json()
        setBlogs(json)
    }
    async function handleClick(e:MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, name: string) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete/${name}`, {
            method: "DELETE",
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        if (!res.ok) return
        const json = await res.json()
        console.log(json)
        alert(json.status)
    }

    return <>
        <h3 className="text-xl uppercase font-bold">Seach blogs</h3>
        <form onSubmit={e => e.preventDefault()}>
            {/* <label className='mr-2' htmlFor="name">Name</label> */}
            <input type="text" name="name" id="name" value={search} onChange={handleChange}/>
        </form>
        <ul>
            {blogs && blogs.map((item, i) => {
                    console.log(item)
                    return <li key={i} className="flex gap-4 justify-center">
                        <Link className='p-2 text-blue-500' href={`/blogs/${(item as any).name}`}>item {(item as any).name}</Link>
                        {admin && <button className="text-red-500" onClick={(e) => handleClick(e, (item as any).name)}>Delete</button>}
                        </li>
                })}
        </ul>
    </>
}