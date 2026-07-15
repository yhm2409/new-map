"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { X, Lock, User, KeyRound } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, signup } = useApp();
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!id || !password || (!isLoginTab && !name)) {
      setErrorMsg("모든 항목을 빠짐없이 입력해 주세요.");
      return;
    }

    if (isLoginTab) {
      const res = await login(id, password);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          onClose();
          setId("");
          setPassword("");
        }, 1000);
      } else {
        setErrorMsg(res.message);
      }
    } else {
      const res = await signup(id, name, password);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          setIsLoginTab(true);
          setName("");
          setPassword("");
          setErrorMsg("");
          setSuccessMsg("");
        }, 1500);
      } else {
        setErrorMsg(res.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px] p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-[26px] bg-white p-8 toss-card-shadow transition-all duration-300 border border-[#f2f4f6]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-[#8b95a1] hover:text-[#4e5968] transition-colors duration-200 cursor-pointer"
          aria-label="닫기"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="mb-8 text-left">
          <h2 className="text-2xl font-bold tracking-tight text-[#191f28] flex items-center gap-1.5">
            <span className="text-[#3182f6] font-extrabold">toss</span>
            <span className="font-medium text-[#4e5968] text-xl">L'Étoile</span>
          </h2>
          <p className="mt-2.5 text-[13px] text-[#4e5968] leading-relaxed">
            {isLoginTab 
              ? "간편하게 로그인하고 파인 다이닝 예약을 진행하세요." 
              : "토스 간편 예약 멤버십에 오신 것을 환영합니다."}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="mb-6 flex rounded-xl bg-[#f2f4f6] p-1 border border-transparent">
          <button
            onClick={() => {
              setIsLoginTab(true);
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`w-1/2 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer ${
              isLoginTab
                ? "bg-white text-[#3182f6] shadow-sm font-bold"
                : "text-[#8b95a1] hover:text-[#4e5968]"
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => {
              setIsLoginTab(false);
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`w-1/2 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer ${
              !isLoginTab
                ? "bg-white text-[#3182f6] shadow-sm font-bold"
                : "text-[#8b95a1] hover:text-[#4e5968]"
            }`}
          >
            회원가입
          </button>
        </div>

        {/* Status Messages */}
        {errorMsg && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-xs text-red-500 font-medium">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-xs text-emerald-600 font-medium">
            {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#4e5968] mb-1.5 pl-1">
              아이디
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#8b95a1]">
                <User className="h-4.5 w-4.5" />
              </span>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="아이디를 입력하세요 (예: user)"
                className="w-full rounded-xl border border-transparent bg-[#f2f4f6] py-3.5 pl-11 pr-4 text-sm text-[#191f28] placeholder-[#8b95a1] focus:bg-white focus:border-[#3182f6] focus:outline-none focus:ring-2 focus:ring-[#3182f6]/10 transition-all duration-200"
                required
              />
            </div>
          </div>

          {!isLoginTab && (
            <div>
              <label className="block text-xs font-semibold text-[#4e5968] mb-1.5 pl-1">
                이름
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#8b95a1]">
                  <User className="h-4.5 w-4.5" />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="성함을 입력하세요"
                  className="w-full rounded-xl border border-transparent bg-[#f2f4f6] py-3.5 pl-11 pr-4 text-sm text-[#191f28] placeholder-[#8b95a1] focus:bg-white focus:border-[#3182f6] focus:outline-none focus:ring-2 focus:ring-[#3182f6]/10 transition-all duration-200"
                  required={!isLoginTab}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#4e5968] mb-1.5 pl-1">
              비밀번호
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#8b95a1]">
                <Lock className="h-4.5 w-4.5" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요 (예: password)"
                className="w-full rounded-xl border border-transparent bg-[#f2f4f6] py-3.5 pl-11 pr-4 text-sm text-[#191f28] placeholder-[#8b95a1] focus:bg-white focus:border-[#3182f6] focus:outline-none focus:ring-2 focus:ring-[#3182f6]/10 transition-all duration-200"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 rounded-xl bg-[#3182f6] py-4 text-sm font-bold text-white shadow-md hover:bg-[#1b64da] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <KeyRound className="h-4 w-4" />
            {isLoginTab ? "로그인" : "가입하기"}
          </button>
        </form>

        {isLoginTab && (
          <div className="mt-6 text-center text-xs text-[#8b95a1] bg-[#f2f4f6] rounded-xl py-3 font-medium">
            테스트 계정: <span className="text-[#191f28] font-mono font-bold">user</span> / <span className="text-[#191f28] font-mono font-bold">password</span>
          </div>
        )}
      </div>
    </div>
  );
};
