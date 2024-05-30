'use client'

import { useState } from "react";
import RoomInput from "./room-input";
import Room from "../types/room";
import AddNewRoom from "./add-new";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export default function InputPage() {
    const Rooms = [
        {
            width: 2, 
            length: 1, 
            height: 20
        }
    ] as Room[]

    const [rooms, setRooms] = useState<Room[]>(Rooms)

    function addNewRoom() {
        const newRoom = {
            width: 0,
            length: 0,
            height: 0
        } as Room

        setRooms([...rooms, newRoom])
    }
    
    function removeRoom(room: Room) {
        setRooms(
            rooms.filter(r => r != room)
        )
    }

    function updateRoom(event: React.ChangeEvent<HTMLInputElement>, room: Room) {
        const valueToUpdate = event.target.id as "width" | "length" | "height"
        const newValue = parseFloat(event.target.value)

        rooms[rooms.findIndex(r => r == room)][valueToUpdate] = newValue

        setRooms([...rooms])
    }

    const router = useRouter();

    function handleCalculate() {
        const totalSquareMeters = rooms.reduce((total, room) => {
            return total + (room.length * room.width) + (2 * (room.height * room.width)) + (2 * (room.height * room.length))
        }, 0)
        router.push(`/calculate?totalSquareMeters=${totalSquareMeters.toFixed(2)}`)
    }

    return (
        <>
            <div className="flex flex-col justify-items-center">
                <h1 className="font-semibold mx-auto mt-8 text-4xl">Please input your room dimensions below</h1>
                <div className="flex justify-center mt-9">
                    <div className="grid grid-cols-3 gap-4 gap-x">
                        {rooms.map(room => {
                            return (
                                <RoomInput 
                                    key={rooms.indexOf(room)} 
                                    room={room} 
                                    index={rooms.indexOf(room)} 
                                    removeOnClick={removeRoom} 
                                    onChange={updateRoom} 
                                />
                            )
                        })}
                        <AddNewRoom onClick={addNewRoom} />
                    </div>
                </div>
                <Button className="w-[8rem] mt-5 mx-auto" onClick={handleCalculate}>
                    Calculate
                </Button>
            </div>
        </>
    )
}