'use client';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { redirect } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

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

const Onboarding = () => {
  const supabase = createClient();
  const { token, removeToken } = useAuthStore();
  if (!token) {
    removeToken();
    redirect('/login');
  }

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
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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
      const file = e.target.files[0];
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
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
        const newName = Date.now() + image.name;
        const { data, error } = await supabase.storage
          .from('room-images')
          .upload(newName, image);

        if (data) {
          const url =
            process.env.NEXT_PUBLIC_SUPABASE_URL +
            '/storage/v1/object/public/room-images/' +
            data.path;
          image_url = url;
        }
        if (error) throw error;
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
        setPreviewImage(null);
        toast.success('Room added successfully');
      }
    } catch (error) {
      toast.error('Error adding room');
      console.error(error);
    }
  };

  const handleSelectApartment = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setRoom((prev) => ({ ...prev, apartment_id: value }));
  };

  const fetchApartments = async () => {
    const { data, error } = await supabase.from('apartments').select('*');
    if (error) {
      toast.error('Error fetching apartments');
      return;
    }
    if (data) {
      setApartments(data);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <ToastContainer />
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Landlord Onboarding
        </h1>
        <form
          onSubmit={handleApartmentSubmit}
          className="mb-6 bg-white p-6 rounded shadow-md"
        >
          <h2 className="text-xl mb-2">Add Apartment</h2>
          <label
            htmlFor="Name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Apartment Name"
            value={apartmentData.name}
            onChange={handleApartmentChange}
            className="block border p-2 mb-2 w-full"
            required
          />
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={apartmentData.location}
            onChange={handleApartmentChange}
            className="block border p-2 mb-2 w-full"
            required
          />
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price
          </label>

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
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
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
            className="bg-blue-500 text-white py-2 px-4 hover:bg-blue-400 rounded w-full"
          >
            Add Apartment
          </button>
        </form>

        {apartments && (
          <form
            onSubmit={handleRoomSubmit}
            className="bg-white p-6 rounded shadow-md"
          >
            <h2 className="text-xl mb-2">Add Room</h2>
            <label
              htmlFor="apartment_id"
              className="block text-sm font-medium text-gray-700"
            >
              Apartment
            </label>
            <select
              name="apartment_id"
              value={room.apartment_id}
              className="block border p-2 mb-2 w-full"
              required
              onChange={handleSelectApartment}
            >
              <option value="">Select Apartment</option>
              {apartments.map((apartment) => (
                <option key={apartment.id} value={apartment.id}>
                  {apartment.name}
                </option>
              ))}
            </select>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Room Name"
              value={room.name}
              onChange={handleRoomChange}
              className="block border p-2 mb-2 w-full"
              required
            />
            <label
              htmlFor="size"
              className="block text-sm font-medium text-gray-700"
            >
              Size (sqm)
            </label>

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
            <label
              htmlFor="equipment"
              className="block text-sm font-medium text-gray-700"
            >
              Equipment
            </label>
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
              required
            />
            {previewImage && (
              <div className="mb-4">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-auto"
                />
              </div>
            )}
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 hover:bg-blue-400 rounded w-full"
            >
              Add Room
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
