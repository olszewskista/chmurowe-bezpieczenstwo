import { auth } from "@/auth";
import CreateForm from "@/components/create-form";

export default async function Create() {
    const session = await auth()
    if (!session) return
    return (
        <section className="flex flex-col justify-center items-center mt-2">
            <h1 className="text-xl uppercase font-bold">Create a blog</h1>
            <CreateForm token={session?.access_token!}/>
        </section>
    );
}
