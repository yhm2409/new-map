import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!status || (status !== "승인" && status !== "거절")) {
      return NextResponse.json(
        { success: false, message: "올바른 상태(승인/거절)를 전송해 주세요." },
        { status: 400 }
      );
    }

    const updated = await prisma.reservation.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      message: `예약 상태가 '${status}' 상태로 정상 업데이트되었습니다.`,
      reservation: updated,
    });
  } catch (error: any) {
    console.error("Update reservation status error:", error);
    return NextResponse.json(
      { success: false, message: "예약 상태 수정 중 서버 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}
