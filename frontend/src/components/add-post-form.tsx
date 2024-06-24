'use client';

import { useBlog } from '@/context/blog-context';
import { useParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function AddPostForm({ token, author }: { token: string, author: string }) {
    const { blog, setBlog } = useBlog();
    console.log(blog);
    const params = useParams();
    console.log(params);
    const [formData, setFormData] = useState({ title: '', content: '' });
    function handleChange(key: string, value: string) {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    }
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/post/${params.name}`,
            {
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: formData.title,
                    content: formData.content,
                }),
            }
        );
        if (!res.ok) return;
        const json = await res.json();
        console.log(json);
        setBlog(json);
    }
    return (
        <>
            {blog && blog.author === author && <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="content">Content</label>
                    <textarea
                        name="content"
                        id="content"
                        cols={30}
                        rows={3}
                        value={formData.content}
                        onChange={(e) =>
                            handleChange('content', e.target.value)
                        }
                    ></textarea>
                </div>
                <button>Submit</button>
            </form>}
        </>
    );
}
