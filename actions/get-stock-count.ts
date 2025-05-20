import prismaClient from "@/lib/prismadb";

export const getStockCount = async (storeId: string) => {
  const salesCount = await prismaClient.product.count({
    where: {
      storeId,
      isArchived: true,
    },
  });

  return salesCount;
};
