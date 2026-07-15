import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "사용자 ID(userId)가 필요합니다." },
        { status: 400 }
      );
    }

    const myReservations = await prisma.reservation.findMany({
      where: {
        userId,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Map DB schema to Frontend component format
    const formatted = myReservations.map((res) => ({
      id: res.id,
      userId: res.userId,
      userName: res.userName,
      date: res.date,
      time: res.time,
      guests: res.guests,
      tableId: res.tableId,
      items: res.items.map((item) => ({
        id: item.menuId,
        name: item.menuName,
        price: item.price,
        quantity: item.quantity,
      })),
      totalPrice: res.totalPrice,
      status: res.status as "대기" | "승인" | "거절",
      createdAt: res.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      reservations: formatted,
    });
  } catch (error: any) {
    console.error("Fetch my reservations error:", error);
    return NextResponse.json(
      { success: false, message: "나의 예약 현황 조회 중 서버 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}
