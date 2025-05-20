import { ShoppingBag } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Image */}
        <div className="hidden lg:block relative">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-600/90 to-black/90 mix-blend-multiply z-10" />
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            alt="Fashion Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="flex items-center">
              <ShoppingBag className="h-16 w-16 text-white" />
              <span className="ml-4 text-5xl font-light tracking-wider text-white">
                Chikan Stop
              </span>
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="flex flex-col p-8 lg:p-16">{children}</div>
      </div>
    </div>
  );
}
