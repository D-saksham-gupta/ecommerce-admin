"use client";

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { ImagePlus, Trash } from "lucide-react";
// import Image from "next/image";
// import { CldUploadWidget } from "next-cloudinary";

// interface ImageUploadProps {
//   disabled?: boolean;
//   onChange: (value: string) => void;
//   onRemove: (value: string) => void;
//   value: string[];
// }

// const ImageUpload: React.FC<ImageUploadProps> = ({
//   disabled,
//   onChange,
//   onRemove,
//   value,
// }) => {
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   const onUpload = (result: any) => {
//     console.log("Cloudinary result:", result);
//     if (result?.info?.secure_url) {
//       onChange(result.info.secure_url);
//     }
//   };

//   if (!isMounted) {
//     return null;
//   }
//   return (
//     <div>
//       <div className="mb-4 flex items-center gap-4 relative">
//         {value.map((url) => (
//           <div
//             key={url}
//             className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
//           >
//             <div className="z-10 absolute top-2 right-2">
//               <Button
//                 type="button"
//                 variant="destructive"
//                 size="icon"
//                 onClick={() => {
//                   onRemove(url);
//                 }}
//               >
//                 <Trash className="h-4 w-4" />
//               </Button>
//             </div>
//             <Image fill className="object-cover" alt="Image" src={url} />
//           </div>
//         ))}
//       </div>
//       <CldUploadWidget uploadPreset="chikan">
//         {({ open, widget }) => {
//           const onClick = () => {
//             open();
//           };
//           useEffect(() => {
//             if (!widget) return;
//             widget.on("success", (result: any) => {
//               console.log("Cloudinary result:", result);
//               if (result?.info?.secure_url) {
//                 onChange(result.info.secure_url);
//               }
//             });
//           }, [widget]);
//           return (
//             <Button
//               type="button"
//               variant="secondary"
//               disabled={disabled}
//               onClick={onClick}
//             >
//               <ImagePlus className="h-4 w-4 mr-2" />
//               Upload an image
//             </Button>
//           );
//         }}
//       </CldUploadWidget>
//     </div>
//   );
// };
// export default ImageUpload;
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string[]) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Ensure the widget script is available
  useEffect(() => {
    if (typeof window !== "undefined" && !(window as any).cloudinary) {
      // Load Cloudinary widget if not loaded yet
      const script = document.createElement("script");
      script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleUpload = () => {
    const myWidget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: "drizerlbf", // Replace with your actual Cloudinary cloud name
        uploadPreset: "chikan",
      },
      (error: any, result: any) => {
        if (!error && result.event === "success") {
          console.log("Upload success:", result);
          onChange(result.info.secure_url); // Use the URL returned by Cloudinary
        }
      }
    );

    myWidget.open(); // Open the Cloudinary upload widget
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="w-[200px] h-[200px] rounded-md relative overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => onRemove(url)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Image" src={url} />
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="secondary"
        disabled={disabled}
        onClick={handleUpload}
      >
        <ImagePlus className="h-4 w-4 mr-2" />
        Upload images
      </Button>
    </div>
  );
};

export default ImageUpload;

// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { ImagePlus, Trash } from "lucide-react";
// import Image from "next/image";
// import { CldUploadWidget } from "next-cloudinary";

// interface ImageUploadProps {
//   disabled?: boolean;
//   onChange: (value: string[]) => void;
//   onRemove: (value: string) => void;
//   value: string[];
// }

// const ImageUpload: React.FC<ImageUploadProps> = ({
//   disabled,
//   onChange,
//   onRemove,
//   value,
// }) => {
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   const onUpload = (result: any) => {
//     if (Array.isArray(result)) {
//       const urls = result.map((r) => r.info.secure_url);
//       onChange([...value, ...urls]);
//     } else if (result?.info?.secure_url) {
//       onChange([...value, result.info.secure_url]);
//     }
//   };

//   if (!isMounted) {
//     return null;
//   }

//   return (
//     <div>
//       <div className="mb-4 flex items-center gap-4">
//         {value.map((url) => (

//           <div
//             key={url}
//             className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
//           >
//             <div className="z-10 absolute top-2 right-2">
//               <Button
//                 type="button"
//                 onClick={() => onRemove(url)}
//                 variant="destructive"
//                 size="icon"
//               >
//                 <Trash className="w-4 h-4" />
//               </Button>
//             </div>
//             <Image fill className="object-cover" alt="Image" src={url} />
//           </div>
//         ))}
//       </div>
//       <CldUploadWidget
//         onUpload={onUpload}
//         uploadPreset="chikan"
//         options={{
//           multiple: true,
//         }}
//       >
//         {({ open }) => {
//           const onClick = () => {
//             open();
//           };

//           return (
//             <Button
//               type="button"
//               disabled={disabled}
//               variant={"secondary"}
//               onClick={onClick}
//             >
//               <ImagePlus className="h-4 w-4 mr-2" />
//               Upload Images
//             </Button>
//           );
//         }}
//       </CldUploadWidget>
//     </div>
//   );
// };

// export default ImageUpload;
