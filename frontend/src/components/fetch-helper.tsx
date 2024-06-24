'use client'

export default function FetchHelper({token}: {token: string}) {
    return <button onClick={async (e) => {
        console.log(token)
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}`, {headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*'
        }, method: 'GET'})
        console.log(res)
        const resdata = await res.json()
        console.log(resdata)
    }}>Fetch!!</button>
}