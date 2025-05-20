import prismaClient from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name } = await body;
    if (!userId) {
      return new NextResponse("Unauthenticates", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name rquired", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    const store = await prismaClient.store.updateMany({
      where: {
        id: params.storeId,
      },
      data: {
        name,
      },
    });
    return NextResponse.json(store);
  } catch (error) {
    console.log(`[Store Patch]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = await auth();
    const { storeId } = await params;

    if (!userId) {
      return new NextResponse("Unauthenticates", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    const store = await prismaClient.store.deleteMany({
      where: {
        id: storeId,
      },
    });
    return NextResponse.json(store);
  } catch (error) {
    console.log(`[Store DELETE]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
