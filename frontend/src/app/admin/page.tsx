import { auth } from "@/auth";
import SearchBlogs from "@/components/search-blogs";

export default async function AdminPage() {
    const session = await auth()

    if (!session) return
    if (!session.roles.find(item => item === 'admin')) return

    return <section className="flex justify-center mt-2 flex-col items-center">
        <SearchBlogs token={session.access_token} admin/>
    </section>
}