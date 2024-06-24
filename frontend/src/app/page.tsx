import { auth } from '@/auth';
import FetchHelper from '@/components/fetch-helper';
import RandomBlog from '@/components/random-blog';
import SearchBlogs from '@/components/search-blogs';


export default async function Home() {
    const session = await auth()
    if (!session) return <></>
    if (!session.user) return <></>
    console.log(session.access_token)
    return <section>
      <div>
        <RandomBlog token={session.access_token} />
      </div>
      <div>
        <SearchBlogs token={session.access_token}/>
      </div>
      <FetchHelper token={session.access_token}/>
    </section>;
}
