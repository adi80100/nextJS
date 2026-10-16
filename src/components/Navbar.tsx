
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user as User | undefined;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-[#CBCBCB]">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <Link
          href="/"
          className="text-xl font-bold "
        >
          Mystery Message
        </Link>

        {session ? (
          <div className="flex flex-col md:flex-row items-center gap-3">
            <span className="text-sm text-gray-600">
              Welcome, {user?.username || user?.email}
            </span>

            <Button
              onClick={() => signOut()}
              className="w-full md:w-auto"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full md:w-auto">
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
