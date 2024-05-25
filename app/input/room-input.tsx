'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import Room from "../types/room"
import { Button } from "@/components/ui/button"

export default function RoomInput({index, room, removeOnClick, onChange}: {index: number, room: Room, removeOnClick: Function, onChange: Function}) {

    const squareMeters = (room.length * room.width) + (2 * (room.height * room.width)) + (2 * (room.height * room.length))

    return (
        <Card className="w-[20rem]">
            <CardHeader className="flex flex-row justify-between mt-[-0.7rem] mx-[-0.4rem]">
                <CardTitle className="mt-[0.9rem] mx-[0.4rem]">Room {index + 1}</CardTitle>
                <div>
                    <Button variant="outline" onClick={() => removeOnClick(room)}>
                        <div className="mx-[-0.15rem]">
                            <svg height="11" width="11" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 490 490"><path d="M456.851 0 245 212.564 33.149 0 .708 32.337l211.961 212.667L.708 457.678 33.149 490 245 277.443 456.851 490l32.441-32.322-211.961-212.674L489.292 32.337z"/></svg>
                        </div>
                    </Button>
                </div>
            </CardHeader>
            <div className="border-b mt-[-0.3rem] mx-2"></div>
            <CardContent>
                <div className="mt-4 space-y-1">
                    <div className="flex flex-row justify-between">
                        <p className="font-semibold">Length</p>
                        <input type="number" id="length" onChange={(event) => onChange(event, room)} className="ml-2 border rounded" value={room.length}></input>
                    </div>
                    <div className="flex flex-row justify-between">
                        <p className="font-semibold">Width</p>
                        <input type="number" id="width" onChange={(event) => onChange(event, room)} className="ml-2 border rounded" value={room.width}></input>
                    </div>
                    <div className="flex flex-row justify-between">
                        <p className="font-semibold">Height</p>
                        <input type="number" id="height" onChange={(event) => onChange(event, room)} className="ml-2 border rounded" value={room.height}></input>
                    </div>
                </div>
            </CardContent>
            <div className="border-b mt-[-0.3rem] mx-2"></div>
            <div className="mx-3 my-3">
                <div>{squareMeters.toFixed(2)} square meters</div>
                <div>~{(squareMeters / 10).toFixed(2)} litres</div>
            </div>
        </Card>
    )
}