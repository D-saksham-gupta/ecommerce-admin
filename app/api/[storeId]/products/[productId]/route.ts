import prismaClient from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }
    const product = await prismaClient.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log(`[Product GET]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { storeId, productId } = await params;

    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!price) new NextResponse("Price is required", { status: 400 });

    if (!categoryId)
      new NextResponse("Category id is required", { status: 400 });

    if (!colorId) new NextResponse("Color id is required", { status: 400 });

    if (!sizeId) new NextResponse("Size id is required", { status: 400 });

    if (!isFeatured) new NextResponse("Featured is required", { status: 400 });

    if (!isArchived) new NextResponse("Archived is required", { status: 400 });

    if (!images || !images.length) {
      return new NextResponse("Image is required", { status: 400 });
    }

    if (!productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const storeByUserId = await prismaClient.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await prismaClient.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        images: {
          deleteMany: {},
        },
        price,
        isFeatured,
        isArchived,
        categoryId,
        sizeId,
        colorId,
        storeId: storeId,
      },
    });

    const product = await prismaClient.product.update({
      where: {
        id: productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (err) {
    console.log("[PRODUCT_PATCH]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = await auth();
    const { productId, storeId } = await params;

    if (!userId) {
      return new NextResponse("Unauthenticates", { status: 401 });
    }

    if (!productId) {
      return new NextResponse("Product id is required", { status: 400 });
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
    const product = await prismaClient.product.deleteMany({
      where: {
        id: productId,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log(`[Product DELETE]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
