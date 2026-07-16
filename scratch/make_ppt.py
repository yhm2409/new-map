import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from PIL import Image

def build_presentation():
    prs = Presentation()
    
    # slide size: 16:9 와이드 스크린 설정
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    
    # 6번 레이아웃은 완전 빈(Blank) 슬라이드입니다.
    blank_layout = prs.slide_layouts[6]
    
    # 헬퍼 함수: 흰색 배경 강제 설정
    def set_white_bg(slide):
        bg = slide.background
        fill = bg.fill
        fill.solid()
        fill.fore_color.rgb = RGBColor(255, 255, 255)

    # 헬퍼 함수: 슬라이드 제목과 장표 번호 일관되게 렌더링
    def add_slide_header(slide, title_text, slide_number_str):
        # Title text box
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(10.0), Inches(0.8))
        tf = title_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.name = "Malgun Gothic"
        p.font.size = Pt(28)
        p.font.bold = True
        p.font.color.rgb = RGBColor(25, 31, 40) # Toss dark text color
        
        # Slide number indicator (Toss style clean right-aligned)
        num_box = slide.shapes.add_textbox(Inches(11.5), Inches(0.5), Inches(1.0), Inches(0.5))
        ntf = num_box.text_frame
        np = ntf.paragraphs[0]
        np.text = slide_number_str
        np.font.name = "Malgun Gothic"
        np.font.size = Pt(14)
        np.font.bold = True
        np.font.color.rgb = RGBColor(139, 149, 161) # Toss light gray text color

    # ----------------------------------------------------
    # SLIDE 1: 표지 (Title Slide)
    # ----------------------------------------------------
    s1 = prs.slides.add_slide(blank_layout)
    set_white_bg(s1)
    
    # Logo mark
    logo_box = s1.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(4.0), Inches(0.8))
    ltf = logo_box.text_frame
    lp = ltf.paragraphs[0]
    lp.text = "L'AROME Fine Dining"
    lp.font.name = "Malgun Gothic"
    lp.font.size = Pt(24)
    lp.font.bold = True
    lp.font.color.rgb = RGBColor(49, 130, 246) # Toss Blue
    
    # Title / Subtitle box
    title_box = s1.shapes.add_textbox(Inches(1.0), Inches(2.7), Inches(11.3), Inches(3.2))
    tf1 = title_box.text_frame
    tf1.word_wrap = True
    
    p_title = tf1.paragraphs[0]
    p_title.text = "라롬 (L'AROME) 식당 예약 및 AI 상담 플랫폼"
    p_title.font.name = "Malgun Gothic"
    p_title.font.size = Pt(38)
    p_title.font.bold = True
    p_title.font.color.rgb = RGBColor(25, 31, 40)
    
    p_sub = tf1.add_paragraph()
    p_sub.text = "\n식당 메뉴와 시간을 사전에 조율하여 예약하는 스마트 모바일 웹앱 서비스"
    p_sub.font.name = "Malgun Gothic"
    p_sub.font.size = Pt(18)
    p_sub.font.bold = True
    p_sub.font.color.rgb = RGBColor(78, 89, 104)

    # ----------------------------------------------------
    # SLIDE 2: 서비스 소개 (Service Introduction)
    # ----------------------------------------------------
    s2 = prs.slides.add_slide(blank_layout)
    set_white_bg(s2)
    add_slide_header(s2, "1. 서비스 소개", "01")
    
    txBox2 = s2.shapes.add_textbox(Inches(0.8), Inches(1.8), Inches(11.7), Inches(4.8))
    tf2 = txBox2.text_frame
    tf2.word_wrap = True
    
    p_intro_1 = tf2.paragraphs[0]
    p_intro_1.text = "• 식당 메뉴와 시간을 미리 조율하고 예약하는 고객 맞춤형 모바일 플랫폼"
    p_intro_1.font.name = "Malgun Gothic"
    p_intro_1.font.size = Pt(20)
    p_intro_1.font.bold = True
    p_intro_1.font.color.rgb = RGBColor(25, 31, 40)
    
    p_intro_1_sub = tf2.add_paragraph()
    p_intro_1_sub.text = "   - 바쁜 현대인의 예약 대기 리소스를 절약하고 매장 예약 부도(No-Show)를 방지하기 위해 설계되었습니다.\n   - 실시간으로 원하는 일정 및 시간대를 조율하고 맞춤형 코스 요리 메뉴를 사전에 담아 주문합니다."
    p_intro_1_sub.font.name = "Malgun Gothic"
    p_intro_1_sub.font.size = Pt(15)
    p_intro_1_sub.font.color.rgb = RGBColor(78, 89, 104)
    
    p_intro_2 = tf2.add_paragraph()
    p_intro_2.text = "\n• 차별화된 파인다이닝 예약 동선 수립"
    p_intro_2.font.name = "Malgun Gothic"
    p_intro_2.font.size = Pt(20)
    p_intro_2.font.bold = True
    p_intro_2.font.color.rgb = RGBColor(25, 31, 40)
    
    p_intro_2_sub = tf2.add_paragraph()
    p_intro_2_sub.text = "   - 1단계: 방문일정 및 인원 선택 ➡️ 2단계: 2D 테이블 가상 좌석 지정 ➡️ 3단계: 사전 주문 요리 메뉴 선택\n   - 고객이 직접 창가석, 프라이빗 룸 등 식당 테이블을 지도 형태로 확인하고 실시간 예약 가능한 환경을 제공합니다."
    p_intro_2_sub.font.name = "Malgun Gothic"
    p_intro_2_sub.font.size = Pt(15)
    p_intro_2_sub.font.color.rgb = RGBColor(78, 89, 104)

    # ----------------------------------------------------
    # SLIDE 3: UI 및 레퍼런스 (TOSS Reference)
    # ----------------------------------------------------
    s3 = prs.slides.add_slide(blank_layout)
    set_white_bg(s3)
    add_slide_header(s3, "2. UI 및 레퍼런스 (TOSS 디자인 테마)", "02")
    
    # Text info on left
    txBox3 = s3.shapes.add_textbox(Inches(0.8), Inches(1.8), Inches(6.5), Inches(4.8))
    tf3 = txBox3.text_frame
    tf3.word_wrap = True
    
    p_ui_1 = tf3.paragraphs[0]
    p_ui_1.text = "• 토스(TOSS) UI 디자인 철학 적극 반영"
    p_ui_1.font.name = "Malgun Gothic"
    p_ui_1.font.size = Pt(20)
    p_ui_1.font.bold = True
    p_ui_1.font.color.rgb = RGBColor(25, 31, 40)
    
    p_ui_1_sub = tf3.add_paragraph()
    p_ui_1_sub.text = "   - 맑고 정돈된 토스 블루(#3182f6)를 메인 브랜드 컬러로 지정하여 세련되고 신뢰감 주는 톤앤매너 구축.\n   - 불필요한 보더선을 지양하고 둥글고 정갈한 플랫 카드 뷰(Flat Card View) 레이아웃을 통해 가독성을 향상했습니다.\n   - 일반 브라우저 스크롤 한계를 우회해 메뉴판 고정 스크롤 박스와 장바구니 요약 카드를 상하 2단 배치."
    p_ui_1_sub.font.name = "Malgun Gothic"
    p_ui_1_sub.font.size = Pt(14)
    p_ui_1_sub.font.color.rgb = RGBColor(78, 89, 104)
    
    p_ui_2 = tf3.add_paragraph()
    p_ui_2.text = "\n• 모바일 최적화 하단 탭 바"
    p_ui_2.font.name = "Malgun Gothic"
    p_ui_2.font.size = Pt(20)
    p_ui_2.font.bold = True
    p_ui_2.font.color.rgb = RGBColor(25, 31, 40)
    
    p_ui_2_sub = tf3.add_paragraph()
    p_ui_2_sub.text = "   - 예약 홈, 내 예약 현황, AI 상담 챗봇 탭을 모바일 웹앱 하단에 항상 고정(Sticky Bottom Nav).\n   - 네이티브 앱을 사용하는 듯한 편리함과 직관적인 네비게이션 가이드를 완비했습니다."
    p_ui_2_sub.font.name = "Malgun Gothic"
    p_ui_2_sub.font.size = Pt(14)
    p_ui_2_sub.font.color.rgb = RGBColor(78, 89, 104)

    # Insert WebP reference image converting to PNG on the fly
    try:
        toss_webp = r"c:\Users\yhm2409\Desktop\map\toss\imgi_61_73ab268a060611ed89c61329738d4db8_small.webp"
        temp_png = r"c:\Users\yhm2409\Desktop\map\toss\temp_toss_ref.png"
        if os.path.exists(toss_webp):
            with Image.open(toss_webp) as img:
                img.save(temp_png, "PNG")
            s3.shapes.add_picture(temp_png, Inches(8.5), Inches(1.8), width=Inches(3.8))
    except Exception as e:
        print("Toss WebP convert failed")

    # ----------------------------------------------------
    # SLIDE 4: 백엔드 및 DB 구성 (ERD)
    # ----------------------------------------------------
    s4 = prs.slides.add_slide(blank_layout)
    set_white_bg(s4)
    add_slide_header(s4, "3. 백엔드 및 DB 구성 (ERD)", "03")
    
    # Text info on left
    txBox4 = s4.shapes.add_textbox(Inches(0.8), Inches(1.8), Inches(5.8), Inches(4.8))
    tf4 = txBox4.text_frame
    tf4.word_wrap = True
    
    p_db_1 = tf4.paragraphs[0]
    p_db_1.text = "• Prisma & Supabase PostgreSQL 기반 아키텍처"
    p_db_1.font.name = "Malgun Gothic"
    p_db_1.font.size = Pt(18)
    p_db_1.font.bold = True
    p_db_1.font.color.rgb = RGBColor(25, 31, 40)
    
    p_db_1_sub = tf4.add_paragraph()
    p_db_1_sub.text = "   - Prisma ORM 5버전을 탑재하여 관계형 데이터의 스키마 관리 및 DB 마이그레이션 파이프라인 구축.\n   - Supabase PostgreSQL 클라우드에 연결하여 보안성과 고가용성을 확보한 트랜잭션 접수를 처리합니다."
    p_db_1_sub.font.name = "Malgun Gothic"
    p_db_1_sub.font.size = Pt(13)
    p_db_1_sub.font.color.rgb = RGBColor(78, 89, 104)
    
    p_db_2 = tf4.add_paragraph()
    p_db_2.text = "\n• 데이터 관계 모델 정의"
    p_db_2.font.name = "Malgun Gothic"
    p_db_2.font.size = Pt(18)
    p_db_2.font.bold = True
    p_db_2.font.color.rgb = RGBColor(25, 31, 40)
    
    p_db_2_sub = tf4.add_paragraph()
    p_db_2_sub.text = "   - **User 테이블**: 일반 예약자 및 관리자(Admin) 권한 세분화 관리.\n   - **Reservation 테이블**: 예약 고유 키(id), 고객정보, 예약 날짜, 선택 시간대, 수용 인원, 지정된 테이블 식별자(tableId) 보관.\n   - **ReservationItem 테이블**: 예약에 매칭된 사전 음식 주문 수량(quantity) 및 요리 품목 스펙 저장.\n   - **Cascade Delete 제약**: 부모 예약 삭제 시 자식 주문 품목(ReservationItem)이 데이터 무손실 연쇄 영구 소멸."
    p_db_2_sub.font.name = "Malgun Gothic"
    p_db_2_sub.font.size = Pt(13)
    p_db_2_sub.font.color.rgb = RGBColor(78, 89, 104)

    # Insert user provided ERD image (Checked and loaded from exact Gemini Artifact path)
    erd_artifact_path = r"C:\Users\yhm2409\.gemini\antigravity\brain\514b8155-baf4-4d6f-923a-5def5c7653b5\media__1784100070910.png"
    erd_local_path = r"c:\Users\yhm2409\Desktop\map\media__1784100070910.png"
    
    if os.path.exists(erd_artifact_path):
        s4.shapes.add_picture(erd_artifact_path, Inches(6.8), Inches(1.8), width=Inches(5.7))
    elif os.path.exists(erd_local_path):
        s4.shapes.add_picture(erd_local_path, Inches(6.8), Inches(1.8), width=Inches(5.7))
    else:
        print("Warning: ERD image file not found anywhere!")

    # ----------------------------------------------------
    # SLIDE 5: 서비스 이용 시연 (Demo and Key Features)
    # ----------------------------------------------------
    s5 = prs.slides.add_slide(blank_layout)
    set_white_bg(s5)
    add_slide_header(s5, "4. 서비스 이용 시연 (실시간 중복 방지 및 챗봇)", "04")
    
    txBox5 = s5.shapes.add_textbox(Inches(0.8), Inches(1.8), Inches(11.7), Inches(4.8))
    tf5 = txBox5.text_frame
    tf5.word_wrap = True
    
    p_demo_1 = tf5.paragraphs[0]
    p_demo_1.text = "• 실시간 테이블 점유 락을 통한 '중복 예약' 원천 차단"
    p_demo_1.font.name = "Malgun Gothic"
    p_demo_1.font.size = Pt(20)
    p_demo_1.font.bold = True
    p_demo_1.font.color.rgb = RGBColor(25, 31, 40)
    
    p_demo_1_sub = tf5.add_paragraph()
    p_demo_1_sub.text = "   - 사용자가 날짜와 예약 시간대를 선택하는 순간, 서버의 `GET /api/reservations?date=X&time=Y` 가 동적으로 작동.\n   - 이미 예약 승인되었거나 접수 진행 중인 테이블 ID 목록을 조회하여 SeatMap 상의 좌석을 즉시 비활성화 락 처리.\n   - 다른 예약자의 동시 선점을 차단하여 하나의 예약 슬롯당 정확히 하나의 매칭을 안전하게 보장합니다."
    p_demo_1_sub.font.name = "Malgun Gothic"
    p_demo_1_sub.font.size = Pt(15)
    p_demo_1_sub.font.color.rgb = RGBColor(78, 89, 104)
    
    p_demo_2 = tf5.add_paragraph()
    p_demo_2.text = "\n• GROQ API Llama-3.3 기반 식당 맞춤형 AI 상담 챗봇"
    p_demo_2.font.name = "Malgun Gothic"
    p_demo_2.font.size = Pt(20)
    p_demo_2.font.bold = True
    p_demo_2.font.color.rgb = RGBColor(25, 31, 40)
    
    p_demo_2_sub = tf5.add_paragraph()
    p_demo_2_sub.text = "   - 매장의 실제 데이터베이스 및 UI 정보와 프롬프트를 100% 동기화 매치.\n   - 코스 메뉴 스펙(한우 스테이크 등), 테이블 6종의 성격(창가석, 룸, 테라스), 영업시간, 발레파킹 안내 등을 즉시 응대.\n   - 24시간 실시간 소비자 챗봇 상담을 탑재하여 매장의 전화 응대 리소스를 획기적으로 낮춥니다."
    p_demo_2_sub.font.name = "Malgun Gothic"
    p_demo_2_sub.font.size = Pt(15)
    p_demo_2_sub.font.color.rgb = RGBColor(78, 89, 104)

    # Save to user desktop directory
    dest_path = r"c:\Users\yhm2409\Desktop\map\L_AROME_Presentation.pptx"
    prs.save(dest_path)
    
    # clean up temp image
    if os.path.exists(temp_png):
        os.remove(temp_png)

if __name__ == "__main__":
    build_presentation()
