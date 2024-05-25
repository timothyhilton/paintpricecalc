import {
    Card,
} from "@/components/ui/card"

export default function AddNewRoom({onClick}: {onClick: React.MouseEventHandler<HTMLDivElement>}) {
    return (
        <Card className="w-[20rem] content-center hover:bg-slate-50 text-center" onClick={onClick}>
            <div className="text-9xl mb-6 select-none">+</div>
        </Card>
    )
}