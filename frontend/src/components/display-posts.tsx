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
        <>
            {blog && blog.posts.map((item, i) => {
                return (
                    <div key={i} className="mb-2">
                        <h3>{item.title}</h3>
                        <div>{item.content}</div>
                        <div className="flex">
                            <div>{blog.author}</div>
                            <div>{item.date}</div>
                        </div>
                    </div>
                );
            })}
        </>
    );
}
