import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Check reserved tables for specific date & time
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const time = searchParams.get("time");

    if (!date || !time) {
      return NextResponse.json(
        { success: false, message: "날짜(date)와 시간(time) 파라미터가 필요합니다." },
        { status: 400 }
      );
    }

    const activeReservations = await prisma.reservation.findMany({
      where: {
        date,
        time,
        status: { not: "거절" },
      },
      select: {
        tableId: true,
      },
    });

    const reservedTableIds = activeReservations.map((res) => res.tableId);

    return NextResponse.json({
      success: true,
      reservedTableIds,
    });
  } catch (error: any) {
    console.error("Fetch reserved tables error:", error);
    return NextResponse.json(
      { success: false, message: "좌석 점유 조회 중 서버 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}

// POST: Place a new reservation with transaction
export async function POST(request: Request) {
  try {
    const {
      userId,
      userName,
      date,
      time,
      guests,
      tableId,
      items,
      totalPrice,
    } = await request.json();

    if (!userId || !userName || !date || !time || !tableId) {
      return NextResponse.json(
        { success: false, message: "필수 예약 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    const newRes = await prisma.$transaction(async (tx) => {
      // 1. Double check duplicate booking
      const duplicate = await tx.reservation.findFirst({
        where: {
          date,
          time,
          tableId,
          status: { not: "거절" },
        },
      });

      if (duplicate) {
        throw new Error("선택하신 테이블 좌석은 이미 예약 완료되었습니다.");
      }

      // 2. Create reservation parent
      const reservation = await tx.reservation.create({
        data: {
          userId,
          userName,
          date,
          time,
          guests: Number(guests),
          tableId,
          totalPrice: Number(totalPrice),
          status: "대기",
        },
      });

      // 3. Create reservation items (pre-orders)
      if (items && items.length > 0) {
        await tx.reservationItem.createMany({
          data: items.map((item: any) => ({
            reservationId: reservation.id,
            menuId: item.id,
            menuName: item.name,
            price: Number(item.price),
            quantity: Number(item.quantity),
          })),
        });
      }

      return reservation;
    });

    return NextResponse.json({
      success: true,
      message: "예약 신청이 성공적으로 접수되었습니다.",
      reservationId: newRes.id,
    });
  } catch (error: any) {
    console.error("Create reservation error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "예약 신청 중 서버 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}
