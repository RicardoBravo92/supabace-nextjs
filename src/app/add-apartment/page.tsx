'use client';
import { createClient } from '@/utils/supabase/client';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Apartment {
  id?: string;
  name: string;
  location: string;
  price: number;
  description: string;
  created_at?: string;
}

interface Room {
  id?: string;
  apartment_id: string;
  name: string;
  size: number;
  equipment: string;
  image_url: string;
  created_at?: string;
}

const Onboarding: React.FC = () => {
  const supabase = createClient();

  const [apartmentData, setApartment] = useState<Apartment>({
    name: '',
    location: '',
    price: 0,
    description: '',
  });
  const [room, setRoom] = useState<Room>({
    apartment_id: '',
    name: '',
    size: 0,
    equipment: '',
    image_url: '',
  });
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [image, setImage] = useState<File | null>(null);

  const handleApartmentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setApartment((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoomChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setRoom((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleApartmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !apartmentData.name ||
      !apartmentData.location ||
      !apartmentData.price ||
      !apartmentData.description
    ) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('apartments')
        .insert([{ ...apartmentData }])
        .select();

      if (error) throw error;

      if (data) {
        setRoom((prev) => ({ ...prev, apartment_id: data[0].id }));
        setApartment({
          name: '',
          location: '',
          price: 0,
          description: '',
        });
        toast.success('Apartment added successfully');
      }
    } catch (error) {
      toast.error('Error adding apartment');
      console.error(error);
    }
  };

  const handleRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room.apartment_id || !room.name || !room.size || !room.equipment) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      let image_url = '';

      if (image) {
        const { data, error } = await supabase.storage
          .from('room-images')
          .upload(`room-${Date.now()}-${image.name}`, image);

        if (error) throw error;
        console.log(data);

        // if (data) {
        //   const { publicURL, error: urlError } = supabase.storage
        //     .from('room-images')
        //     .getPublicUrl(data.path);

        //   if (urlError) throw urlError;

        //   image_url = publicURL || '';
        // }
      }

      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .insert([{ ...room, image_url }])
        .select();

      if (roomError) throw roomError;

      if (roomData) {
        setRoom({
          apartment_id: '',
          name: '',
          size: 0,
          equipment: '',
          image_url: '',
        });
        setImage(null);
        toast.success('Room added successfully');
      }
    } catch (error) {
      toast.error('Error adding room');
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchApartments = async () => {
      const { data, error } = await supabase.from('apartments').select('*');
      if (error) {
        toast.error('Error fetching apartments');
        console.error(error);
        return;
      }
      if (data) {
        setApartments(data);
      }
    };
    fetchApartments();
  }, [supabase]);

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Landlord Onboarding</h1>

      <form onSubmit={handleApartmentSubmit} className="mb-6">
        <h2 className="text-xl mb-2">Add Apartment</h2>
        <input
          type="text"
          name="name"
          placeholder="Apartment Name"
          value={apartmentData.name}
          onChange={handleApartmentChange}
          className="block border p-2 mb-2 w-full"
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={apartmentData.location}
          onChange={handleApartmentChange}
          className="block border p-2 mb-2 w-full"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={apartmentData.price}
          onChange={handleApartmentChange}
          className="block border p-2 mb-2 w-full"
          required
          min={0}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={apartmentData.description}
          onChange={handleApartmentChange}
          className="block border p-2 mb-2 w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 hover:bg-blue-400"
        >
          Add Apartment
        </button>
      </form>

      <form onSubmit={handleRoomSubmit}>
        <h2 className="text-xl mb-2">Add Room</h2>
        <select
          name="apartment_id"
          value={room.apartment_id}
          className="block border p-2 mb-2 w-full"
          required
          onChange={handleRoomChange}
        >
          <option value="">Select Apartment</option>
          {apartments.map((apartment) => (
            <option key={apartment.id} value={apartment.id}>
              {apartment.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="name"
          placeholder="Room Name"
          value={room.name}
          onChange={handleRoomChange}
          className="block border p-2 mb-2 w-full"
          required
        />
        <input
          type="number"
          name="size"
          placeholder="Size (sqm)"
          value={room.size}
          onChange={handleRoomChange}
          className="block border p-2 mb-2 w-full"
          required
          min={0}
        />
        <textarea
          name="equipment"
          placeholder="Equipment"
          value={room.equipment}
          onChange={handleRoomChange}
          className="block border p-2 mb-2 w-full"
          required
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="block border p-2 mb-2 w-full"
        />
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 hover:bg-green-400"
        >
          Add Room
        </button>
      </form>
    </div>
  );
};

export default Onboarding;
