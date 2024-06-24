'use client'

import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";

type Blog = {
    name: string,
    author: string,
    posts: [{
        title: string,
        content: string,
        date: string
    }]
}

type BlogProps = {
    blog: Blog | null,
    setBlog: Dispatch<SetStateAction<Blog | null>>
}

const BlogContext = createContext<BlogProps>({
    blog: null,
    setBlog: () => {}
})

export function useBlog() {return useContext(BlogContext)}

export function BlogProvider({children}: {children: React.ReactNode}) {
    const [blog, setBlog] = useState<Blog | null>(null)
    return <BlogContext.Provider value={{blog, setBlog}}>
        {children}
    </BlogContext.Provider>
}