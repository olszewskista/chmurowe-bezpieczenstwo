import { auth } from "@/auth";
import CreateForm from "@/components/create-form";

export default async function Create() {
    const session = await auth()
    return (
        <section>
            <h1>Create a blog</h1>
            <CreateForm token={session?.access_token!}/>
        </section>
    );
}
