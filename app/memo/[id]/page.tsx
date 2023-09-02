import { MemoTest } from "@/components/MemoTest";

export default function Memo({ params }: { params: { id: number } }) {
    return (
        <main className='flex min-h-screen flex-col items-center justify-center p-24 gap-16'>
            <MemoTest id={params.id} />
        </main>
    )}