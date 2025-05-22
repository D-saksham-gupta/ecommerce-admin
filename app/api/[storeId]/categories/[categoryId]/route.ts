import prismaClient from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }
    const category = await prismaClient.category.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        billboard: true,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log(`[Category GET]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name, billboardId } = await body;
    if (!userId) {
      return new NextResponse("Unauthenticates", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!billboardId) {
      return new NextResponse("BillboardId is required", { status: 400 });
    }
    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
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
    const category = await prismaClient.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log(`[Category Patch]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = await auth();
    const { categoryId, storeId } = await params;

    if (!userId) {
      return new NextResponse("Unauthenticates", { status: 401 });
    }

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
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
    const category = await prismaClient.category.deleteMany({
      where: {
        id: categoryId,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log(`[Category DELETE]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
