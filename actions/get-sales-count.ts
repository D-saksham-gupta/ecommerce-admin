import prismaClient from "@/lib/prismadb";

export const getSalesCount = async (storeId: string) => {
  const salesCount = await prismaClient.order.count({
    where: {
      storeId,
      isPaid: true,
    },
  });

  return salesCount;
};
