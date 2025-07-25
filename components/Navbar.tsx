import { UserButton } from "@clerk/nextjs";
import { MainNav } from "./main-nav";
import StoreSwitcher from "./store-switcher";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prismaClient from "@/lib/prismadb";
import { ModeToggle } from "./theme-toggle";

const Navbar = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await prismaClient.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="border-b bg-white dark:bg-gray-950">
      <div className="flex h-16 items-center px-2 sm:px-4">
        {/* Store Switcher - Responsive width */}
        <div className="flex-shrink-0 min-w-0 w-auto">
          <div className="max-w-[120px] sm:max-w-[160px] md:max-w-[200px]">
            <StoreSwitcher items={stores} />
          </div>
        </div>

        {/* Desktop Navigation - Hidden on mobile, responsive margins */}
        <div className="hidden md:flex mx-2 lg:mx-6 flex-1 min-w-0">
          <MainNav className="flex-wrap" />
        </div>

        {/* Right side items - Responsive spacing */}
        <div className="ml-auto flex items-center space-x-1 sm:space-x-2 md:space-x-4">
          {/* Mode Toggle - Hidden on small screens */}
          <div className="hidden sm:block">
            <ModeToggle />
          </div>

          {/* User Button - Always visible, responsive size */}
          <div className="flex-shrink-0">
            <div className="scale-90 sm:scale-100">
              <UserButton afterSignOutUrl="/sign-in" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar - Only visible on mobile */}
      <div className="md:hidden border-t bg-white dark:bg-gray-950">
        <div className="px-2 py-2">
          <MainNav className="flex flex-wrap gap-1 justify-center" />
        </div>

        {/* Mobile Mode Toggle - Show if hidden above */}
        <div className="sm:hidden px-4 py-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Theme
            </span>
            <ModeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

// import { UserButton } from "@clerk/nextjs";
// import { MainNav } from "./main-nav";
// import StoreSwitcher from "./store-switcher";
// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// import prismaClient from "@/lib/prismadb";
// import { ModeToggle } from "./theme-toggle";

// const Navbar = async () => {
//   const { userId } = await auth();
//   if (!userId) {
//     redirect("/sign-in");
//   }
//   const stores = await prismaClient.store.findMany({
//     where: {
//       userId,
//     },
//   });
//   return (
//     <div className="border-b">
//       <div className="flex h-16 items-center px-4">
//         <StoreSwitcher items={stores} />
//         <MainNav className="mx-6" />
//         <div className="ml-auto flex items-center space-x-4">
//           <ModeToggle />
//           <UserButton fallback="/" />
//         </div>
//       </div>
//     </div>
//   );
// };
// export default Navbar;
