import { GoogleGenAI } from "@google/genai";
import { MaterialItem } from "../types";

// Ensure API key is present; simplified for client-side demo (usually server-side)
const apiKey = process.env.API_KEY || ""; 
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const getExplanation = async (item: MaterialItem): Promise<string> => {
  if (!ai) {
    return "ไม่พบ API Key กรุณาเชื่อมต่ออินเทอร์เน็ตหรือติดต่อผู้ดูแลระบบ";
  }

  try {
    const prompt = `
      คุณคือ "ศาสตราจารย์วิทยาศาสตร์" ใจดีที่กำลังสอนเด็กนักเรียนชั้น ป.4
      ช่วยอธิบายสั้นๆ ว่าทำไม "${item.name}" ที่ทำจากวัสดุ "${item.material}" ถึงจัดอยู่ในกลุ่ม "${item.group}"
      
      คำแนะนำ:
      - ใช้ภาษาที่เข้าใจง่ายสำหรับเด็ก 9-10 ขวบ
      - เน้นสมบัติเด่นของวัสดุกลุ่มนั้น (เช่น โลหะแข็งแรงนำความร้อน, พอลิเมอร์ยืดหยุ่นน้ำหนักเบา, เซรามิกทนความร้อนแต่เปราะ)
      - ความยาวไม่เกิน 2-3 ประโยค
      - น้ำเสียงสนุกสนาน ให้กำลังใจ
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "ขออภัย ศาสตราจารย์กำลังยุ่งอยู่ ลองใหม่อีกครั้งนะจ๊ะ";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "เกิดข้อผิดพลาดในการเรียกศาสตราจารย์";
  }
};