import prismaClient from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { colorId: string } }
) {
  try {
    const { colorId } = await params;
    if (!colorId) {
      return new NextResponse("Color id is required", { status: 400 });
    }
    const color = await prismaClient.color.findUnique({
      where: {
        id: colorId,
      },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log(`[Color GET]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = await auth();
    const { colorId, storeId } = await params;
    const body = await req.json();
    const { name, value } = await body;
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name is rquired", { status: 400 });
    }
    if (!value) {
      return new NextResponse("Value is rquired", { status: 400 });
    }
    if (!colorId) {
      return new NextResponse("Color id is required", { status: 400 });
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
    const color = await prismaClient.color.updateMany({
      where: {
        id: colorId,
      },
      data: {
        name,
        value,
      },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log(`[Color Patch]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = await auth();
    const { colorId, storeId } = await params;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.colorId) {
      return new NextResponse("Color id is required", { status: 400 });
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
    const color = await prismaClient.color.deleteMany({
      where: {
        id: colorId,
      },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log(`[Color DELETE]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
