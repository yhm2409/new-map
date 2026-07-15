import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { loginId, password } = await request.json();

    if (!loginId || !password) {
      return NextResponse.json(
        { success: false, message: "아이디와 비밀번호를 입력해 주세요." },
        { status: 400 }
      );
    }

    let user = await prisma.user.findUnique({
      where: { loginId },
    });

    // Auto-seed default test accounts if they don't exist yet
    if (!user) {
      if (loginId === "user" && password === "password") {
        const hashedPassword = await bcrypt.hash("password", 10);
        user = await prisma.user.create({
          data: {
            loginId: "user",
            name: "테스터",
            password: hashedPassword,
            role: "user",
          },
        });
      } else if (loginId === "admin" && password === "password") {
        const hashedPassword = await bcrypt.hash("password", 10);
        user = await prisma.user.create({
          data: {
            loginId: "admin",
            name: "라롬사장님",
            password: hashedPassword,
            role: "admin",
          },
        });
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: "아이디 또는 비밀번호가 일치하지 않습니다." },
        { status: 400 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "아이디 또는 비밀번호가 일치하지 않습니다." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "성공적으로 로그인되었습니다.",
      user: {
        id: user.id,
        loginId: user.loginId,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "로그인 처리 중 서버 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}
