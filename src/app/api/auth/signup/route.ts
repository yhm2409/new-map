import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { loginId, name, password } = await request.json();

    if (!loginId || !name || !password) {
      return NextResponse.json(
        { success: false, message: "모든 필드를 입력해 주세요." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { loginId },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "이미 사용 중인 아이디입니다." },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user. The first user becomes admin automatically for testing, others are user.
    const userCount = await prisma.user.count();
    const role = userCount === 0 || loginId === "admin" ? "admin" : "user";

    const newUser = await prisma.user.create({
      data: {
        loginId,
        name,
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json({
      success: true,
      message: "회원가입이 완료되었습니다. 로그인해 주세요.",
      user: {
        id: newUser.id,
        loginId: newUser.loginId,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, message: "회원가입 처리 중 서버 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}
