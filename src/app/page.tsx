'use client';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import RoomPlaceholder from '../../public/roomimage.jpg';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

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

const Apartments = () => {
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

  if (!apartments) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2 bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Apartments</h1>
        {apartments.map((apartment) => (
          <div
            key={apartment.id}
            className="border p-6 mb-6 rounded-xl shadow-lg bg-zinc-50"
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
              <div className="bg-gray-100 pb-4">
                <h3 className="text-xl font-bold mt-6 mb-4 pl-3">Rooms</h3>
                <Carousel
                  showThumbs={false}
                  infiniteLoop={true}
                  showStatus={false}
                >
                  {apartment.rooms.map((room) => (
                    <div
                      key={room.id}
                      className="mx-auto border rounded-lg shadow-md bg-white overflow-hidden w-full md:w-1/2 lg:w-1/3"
                    >
                      <Link href={`/room/${room.id}`} className="block">
                        <Image
                          src={room.image_url || RoomPlaceholder}
                          alt={room.name}
                          width={500}
                          height={300}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h4 className="text-lg font-bold mb-2 capitalize">
                            {room.name}
                          </h4>
                          <p className="text-md mb-1 ">
                            Size: {room.size} sq ft
                          </p>
                          <p className="text-md">Equipment: {room.equipment}</p>
                        </div>
                      </Link>
                    </div>
                  ))}
                </Carousel>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Apartments;
