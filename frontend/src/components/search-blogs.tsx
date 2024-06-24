'use client'
import Link from "next/link"
import { ChangeEvent, FormEvent, useState } from "react"

export default function SearchBlogs({token}: {token: string}) {
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

    return <>
        <h3>Seach blogs</h3>
        <form onSubmit={e => e.preventDefault()}>
            <label htmlFor="">Name</label>
            <input type="text" name="name" id="name" value={search} onChange={handleChange}/>
        </form>
        <ul>
            {blogs && blogs.map((item, i) => {
                    console.log(item)
                    return <li key={i}>
                        <Link href={`/blogs/${(item as any).name}`}>item {(item as any).name}</Link>
                        </li>
                })}
        </ul>
    </>
}