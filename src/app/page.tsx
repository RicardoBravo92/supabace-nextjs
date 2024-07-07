'use client';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Room from '../../public/roomimage.jpg';

interface Apartment {
  id: string;
  name: string;
  location: string;
  price: number;
  description: string;
  created_at: string;
  rooms: Room[];
}

interface Room {
  id: string;
  apartment_id: string;
  name: string;
  size: number;
  equipment: string;
  image_url: string;
  created_at: string;
}

const Apartments: React.FC = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const supabase = createClient();
  useEffect(() => {
    const fetchApartments = async () => {
      const { data, error } = await supabase
        .from('apartments')
        .select('*, rooms(*)');

      if (data) {
        setApartments(data);
      } else if (error) {
        console.error('Error fetching apartments:', error);
      }
    };

    fetchApartments();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Apartments</h1>
      {apartments.map((apartment) => (
        <div
          key={apartment.id}
          className="border p-6 mb-6 rounded-xl shadow-lg bg-white"
        >
          <h2 className="text-2xl font-bold mb-4 capitalize">
            {apartment.name}
          </h2>
          <p className="text-lg mb-2 capitalize">
            <span className="font-semibold">Location:</span>{' '}
            {apartment.location}
          </p>
          <p className="text-lg mb-2">
            <span className="font-semibold">Price:</span> ${apartment.price}
          </p>
          <p className="text-lg mb-4 bg-blue-100 rounded-lg p-4">
            {apartment.description}
          </p>
          {apartment.rooms && apartment.rooms.length > 0 && (
            <h3 className="text-xl font-bold mt-6 mb-4">Rooms</h3>
          )}
          {apartment.rooms?.map((room) => (
            <div
              key={room.id}
              className="border p-4 mb-4 rounded-lg hover:bg-sky-50 transition"
            >
              <Link
                href={`/room/${room.id}`}
                className="flex flex-row items-center gap-4"
              >
                <Image
                  src={room.image_url || Room}
                  alt={room.name}
                  width={100}
                  height={100}
                  className="rounded-lg object-cover"
                />
                <div>
                  <h4 className="text-lg font-bold mb-1">{room.name}</h4>
                  <p className="text-md mb-1">Size: {room.size}</p>
                  <p className="text-md">Equipment: {room.equipment}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Apartments;
