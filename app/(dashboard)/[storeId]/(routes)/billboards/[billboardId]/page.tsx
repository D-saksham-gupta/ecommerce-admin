import prismaClient from "@/lib/prismadb";
import { BillboardForm } from "./components/billboard-form";

type tParams = Promise<{ slug: string[] }>;

const BillboardPage = async ({
  params,
}: {
  params: { billboardId: string };
}) => {
  const { billboardId } = await params;
  const billboard = await prismaClient.billboard.findUnique({
    where: {
      id: billboardId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardPage;
