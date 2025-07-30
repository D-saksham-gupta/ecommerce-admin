import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // or http://localhost:3001
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  const { productIds } = await req.json();
  const { storeId } = params;

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product ids are required", {
      status: 400,
      headers: corsHeaders,
    });
  }

  const order = await prismaClient.order.create({
    data: {
      storeId: storeId,
      isPaid: false,
      orderItems: {
        create: productIds.map((productId: string) => ({
          product: {
            connect: {
              id: productId,
            },
          },
        })),
      },
    },
  });

  return new NextResponse(JSON.stringify({ message: "Order Placed" }), {
    status: 200,
    headers: corsHeaders,
  });
}

