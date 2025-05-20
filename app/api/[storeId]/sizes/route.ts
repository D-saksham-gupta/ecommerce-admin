import prismaClient from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name, value } = body;
    const { storeId } = await params;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }
    if (!storeId) {
      return new NextResponse("Store is required", { status: 400 });
    }
    const storebyUserId = await prismaClient.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });
    if (!storebyUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const size = await prismaClient.size.create({
      data: {
        name,
        value,
        storeId,
      },
    });
    return NextResponse.json(size);
  } catch (error) {
    console.log("[Size_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { storeId } = await params;

    if (!storeId) {
      return new NextResponse("StoreId is required", { status: 400 });
    }

    const sizes = await prismaClient.size.findMany({
      where: {
        storeId,
      },
    });
    return NextResponse.json(sizes);
  } catch (error) {
    console.log("[Sizes_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
