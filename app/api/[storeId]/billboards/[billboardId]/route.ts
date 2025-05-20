import prismaClient from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }
    const billboard = await prismaClient.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log(`[Billboard GET]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { label, imageUrl } = await body;
    if (!userId) {
      return new NextResponse("Unauthenticates", { status: 401 });
    }
    if (!label) {
      return new NextResponse("Label rquired", { status: 400 });
    }
    if (!imageUrl) {
      return new NextResponse("Image URL rquired", { status: 400 });
    }
    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const storebyUserId = await prismaClient.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!storebyUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
    const billboard = await prismaClient.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log(`[Billboard Patch]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthenticates", { status: 401 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }
    const storebyUserId = await prismaClient.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!storebyUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
    const billboard = await prismaClient.billboard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log(`[Billboard DELETE]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
