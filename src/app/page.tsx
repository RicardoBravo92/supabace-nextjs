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
  const [filteredApartments, setFilteredApartments] = useState<Apartment[]>([]);
  const [location, setLocation] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [apartmentsPerPage] = useState(5);
  const supabase = createClient();

  useEffect(() => {
    const fetchApartments = async () => {
      const { data, error } = await supabase
        .from('apartments')
        .select('*, rooms(*)');

      if (data) {
        setApartments(data);
        setFilteredApartments(data);
      } else if (error) {
        console.error('Error fetching apartments:', error);
      }
    };

    fetchApartments();
  }, []);

  const handleSearch = () => {
    const filtered = apartments.filter((apartment) => {
      const matchesLocation = location
        ? apartment.location.toLowerCase().includes(location.toLowerCase())
        : true;
      const matchesPrice = maxPrice
        ? apartment.price <= parseFloat(maxPrice)
        : true;
      return matchesLocation && matchesPrice;
    });
    setFilteredApartments(filtered);
    setCurrentPage(1);
  };

  const indexOfLastApartment = currentPage * apartmentsPerPage;
  const indexOfFirstApartment = indexOfLastApartment - apartmentsPerPage;
  const currentApartments = filteredApartments.slice(
    indexOfFirstApartment,
    indexOfLastApartment,
  );

  const totalPages = Math.ceil(filteredApartments.length / apartmentsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2 bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Apartments</h1>
        <div className="mb-6 flex flex-col items-center">
          <input
            type="text"
            placeholder="Search by location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="block border p-2 mb-2 w-full"
          />
          <input
            type="number"
            placeholder="Max price"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="block border p-2 mb-2 w-full"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white py-2 px-4 hover:bg-blue-400 rounded w-full"
          >
            Search
          </button>
        </div>
        {currentApartments.map((apartment) => (
          <div
            key={apartment.id}
            className="border p-6 mb-6 rounded-xl shadow-lg bg-zinc-50"
          >
            <h2 className="text-2xl font-bold mb-4 capitalize text-center">
              {apartment.name}
            </h2>
            <p className="text-lg mb-2 capitalize text-center">
              <span className="font-semibold">Location:</span>{' '}
              {apartment.location}
            </p>
            <p className="text-lg mb-2 text-center">
              <span className="font-semibold">Price:</span> ${apartment.price}
            </p>
            <p className="text-lg mb-4 bg-blue-100 rounded-lg p-4 text-center">
              {apartment.description}
            </p>
            {apartment.rooms && apartment.rooms.length > 0 && (
              <div className="bg-gray-100 pb-4">
                <h3 className="text-xl font-bold mt-6 mb-4 pl-3 text-center">
                  Rooms
                </h3>
                <Carousel
                  showThumbs={false}
                  infiniteLoop={true}
                  showStatus={false}
                >
                  {apartment.rooms.map((room) => (
                    <div
                      key={room.id}
                      className="mx-auto border rounded-lg shadow-md bg-white hover:bg-slate-200 overflow-hidden w-full"
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
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === index + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Apartments;
