import prismaClient from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { label, imageUrl } = body;
    const { storeId } = await params;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }
    if (!imageUrl) {
      return new NextResponse("Image is required", { status: 400 });
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

    const billboard = await prismaClient.billboard.create({
      data: {
        label,
        imageUrl,
        storeId,
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[Billboard_POST]", error);
    return new NextResponse("Internal erroe", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { storeId } = await params;

    if (!storeId) {
      return new NextResponse("Image is required", { status: 400 });
    }

    const billboards = await prismaClient.billboard.findMany({
      where: {
        storeId,
      },
    });
    return NextResponse.json(billboards);
  } catch (error) {
    console.log("[Billboard_GET]", error);
    return new NextResponse("Internal erroe", { status: 500 });
  }
}
