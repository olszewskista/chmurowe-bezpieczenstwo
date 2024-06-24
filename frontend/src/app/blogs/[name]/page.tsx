import { auth } from '@/auth';
import AddPostForm from '@/components/add-post-form';
import DisplayPosts from '@/components/display-posts';
import { BlogProvider } from '@/context/blog-context';

export default async function Blog({ params }: { params: { name: string } }) {
    const session = await auth();
    // const blog = { title: 'super', posts: [], author: "Bal Las"};
    // const posts = [
    //     { title: 'super', text: 'ale fajen', author: 'balas', date: '28.09' },
    //     { title: 'super', text: 'ale fajen', author: 'balas', date: '28.09' },
    //     { title: 'super', text: 'ale fajen', author: 'balas', date: '28.09' },
    // ];
    if (!session) return
    return (
        <section>
            <h1 className="my-4 text-2xl text-center uppercase font-bold">Welcome to {params.name}</h1>
            <BlogProvider>
                <AddPostForm author={session.user!.name!} token={session.access_token}/>
                <DisplayPosts token={session?.access_token!}/>
            </BlogProvider>
        </section>
    );
}
