'use client'
import { useBlog } from '@/context/blog-context';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function DisplayPosts({token}: {token: string}) {
    const { blog, setBlog } = useBlog();
    const params = useParams();
    useEffect(() => {
        (async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs/${params.name}`, {
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': "Bearer " + token
                }
            })
            if (!res.ok) return
            const json = await res.json()
            setBlog(json)
        })()
    }, [params, token, setBlog]);
    return (
        <ul className='flex flex-col gap-4'>
            {blog && blog.posts.map((item, i) => {
                return (
                    <li key={i} className="mb-2 p-4 bg-neutral-700 rounded-md mx-24">
                        <h3 className='text-center text-xl uppercase font-bold'>{item.title}</h3>
                        <div className='text-wra break-all'>{item.content}</div>
                        <div className="flex justify-between">
                            <div>{blog.author}</div>
                            <div>{item.date}</div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
