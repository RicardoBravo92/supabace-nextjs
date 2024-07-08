'use client';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import RoomPlaceholder from '../../../../public/roomimage.jpg';

interface Room {
  id?: string;
  apartment_id: string;
  name: string;
  size: number;
  equipment: string;
  image_url: string;
  created_at?: string;
}

const RoomDetail = () => {
  const supabase = createClient();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (id) {
      const fetchRoom = async () => {
        const { data: roomData, error: roomError } = await supabase
          .from('rooms')
          .select('*')
          .eq('id', id)
          .single();

        if (roomError) {
          toast.error('Error fetching room details');
          console.error(roomError);
          return;
        }

        if (roomData) {
          setRoom(roomData);
        }
      };

      fetchRoom();
    }
  }, [id, supabase]);

  if (!room) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <ToastContainer />
      <div className="border p-4 flex flex-col md:flex-row gap-4 shadow-lg rounded-lg bg-white max-w-4xl">
        <Image
          src={room.image_url || RoomPlaceholder}
          alt={room.name}
          width={500}
          height={500}
          className="mb-4 md:mb-0 md:w-1/2 object-cover rounded-lg"
        />
        <div className="md:w-1/2 flex flex-col justify-center p-4">
          <h4 className="text-2xl font-bold mb-4 capitalize">{room.name}</h4>
          <p className="text-lg mb-2">
            <span className="font-semibold">Size:</span> {room.size} sq ft
          </p>
          <p className="text-lg mb-2">
            <span className="font-semibold">Equipment:</span> {room.equipment}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
