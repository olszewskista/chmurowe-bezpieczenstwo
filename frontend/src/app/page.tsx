import { auth } from '@/auth';
import RandomBlog from '@/components/random-blog';
import SearchBlogs from '@/components/search-blogs';

export default async function Home() {
    const session = await auth();
    if (!session) return <></>;
    if (!session.user) return <></>;
    console.log(session.access_token);
    return (
        <section className='flex justify-center mt-8 gap-8'>
            <div className='flex flex-col'>
                <RandomBlog token={session.access_token} />
            </div>
            <div className='text-center'>
                <SearchBlogs token={session.access_token} admin={false} />
            </div>
        </section>
    );
}
