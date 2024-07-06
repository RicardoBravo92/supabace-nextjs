'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);

  return (
    <nav className="bg-gray-800 p-4 top-0">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold">
          <Link href="/">Apartment App</Link>
        </div>

        <div className={`flex flex-col md:flex-row md:space-x-4 'block'`}>
          <div className="space-x-4">
            <Link
              className=" text-white hover:text-slate-500"
              href="/add-apartment"
            >
              Add Apartment
            </Link>
            {/* <Link
                className=" text-white hover:text-slate-500"
                href="/"
                onClick={handleLogout}
              >
                Logout
              </Link> */}
          </div>
          <Link className=" text-white hover:text-slate-500" href="/login">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
