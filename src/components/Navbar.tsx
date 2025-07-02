import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useAuthStore } from "@/store/useAuthStore";

const Navbar = () => {
  const signInWithGithub = useAuthStore((state) => state?.signInWithGithub);
  const signOut = useAuthStore((state) => state?.signOut);
  const user = useAuthStore((state) => state?.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const displayName = user?.user_metadata.user_name || user?.email;

  return (
    <nav className="sticky top-0 z-20">
      <div>
        <div className="flex justify-between md:justify-center bg-zinc-700 shadow ">
          {/* Desktop link */}
          <NavigationMenu
            className="py-3 hidden md:flex text-white sticky top-0"
            viewport={false}
          >
            <NavigationMenuList className="flex md:-mr-10">
              <NavigationMenuItem className="mr-6">
                <NavigationMenuLink className="inline " asChild>
                  <Link
                    to={"/"}
                    className="text-lg font-semibold hover:bg-zinc-600  tracking-wide px-3 py-2 rounded-md hover:text-amber-400 transition"
                  >
                    social<span className="text-amber-500">.media</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    className={`px-3 py-2 rounded-md hover:bg-zinc-600 hover:text-amber-300 transition-colors duration-200 ${
                      location.pathname === "/" ||
                      location.pathname.includes("/post")
                        ? "text-amber-300"
                        : ""
                    }`}
                    to={"/"}
                  >
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    className={`px-3 py-2 rounded-md hover:bg-zinc-600 hover:text-amber-300 transition-colors duration-200 ${
                      location.pathname === "/create" ? "text-amber-300" : ""
                    }`}
                    to={"/create"}
                  >
                    Create Post
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    className={`px-3 py-2 rounded-md hover:bg-zinc-600 hover:text-amber-300 transition-colors duration-200 ${
                      location.pathname === "/communities"
                        ? "text-amber-300"
                        : ""
                    }`}
                    to={"/communities"}
                  >
                    Communities
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    className={`px-3 py-2 rounded-md hover:bg-zinc-600 hover:text-amber-300 transition-colors duration-200 ${
                      location.pathname === "/community/create"
                        ? "text-amber-300"
                        : ""
                    }`}
                    to={"/community/create"}
                  >
                    Create Community
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {user ? (
                <div className="ml-6 gap-2 flex justify-center items-center">
                  {user.user_metadata.avatar_url && (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <span>{displayName}</span>
                  <Button
                    onClick={signOut}
                    className="h-8"
                    variant="destructive"
                  >
                    Sign out
                  </Button>
                </div>
              ) : (
                <div className="ml-6 gap-2 flex items-center">
                  <Button
                    onClick={signInWithGithub}
                    className="h-8"
                    variant="default"
                  >
                    Sign in with github
                  </Button>
                </div>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile menu button */}
          <div className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-pink-500 drop-shadow-md pl-6 pt-2.5 md:hidden block ">
            social<span className="text-amber-400">.media</span>
          </div>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="md:hidden mr-10 py-3 text-white"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </SheetTrigger>
            <SheetContent className="bg-zinc-900 text-white flex flex-col gap-4 pt-10 px-6">
              <SheetHeader>
                <SheetTitle className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-pink-500 drop-shadow-md">
                  social<span className="text-amber-400">.media</span>
                </SheetTitle>
              </SheetHeader>
              <NavLink
                onClick={() => setMenuOpen(false)}
                to="/"
                className={({ isActive }) =>
                  `text-lg transition-colors duration-200 ${
                    isActive ? "text-amber-400" : "hover:text-amber-300"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                onClick={() => setMenuOpen(false)}
                to="/create"
                className={({ isActive }) =>
                  `text-lg transition-colors duration-200 ${
                    isActive ? "text-amber-400" : "hover:text-amber-300"
                  }`
                }
              >
                Create Post
              </NavLink>
              <NavLink
                onClick={() => setMenuOpen(false)}
                to="/communities"
                className={({ isActive }) =>
                  `text-lg transition-colors duration-200 ${
                    isActive ? "text-amber-400" : "hover:text-amber-300"
                  }`
                }
              >
                Communities
              </NavLink>
              <NavLink
                onClick={() => setMenuOpen(false)}
                to="/community/create"
                className={({ isActive }) =>
                  `text-lg transition-colors duration-200 ${
                    isActive ? "text-amber-400" : "hover:text-amber-300"
                  }`
                }
              >
                Create Community
              </NavLink>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
