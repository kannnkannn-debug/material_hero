
const ADJECTIVES = [
  "ฉลาด", "ว่องไว", "ใจดี", "กล้าหาญ", "ขี้เล่น", 
  "ยอดนักคิด", "จอมพลัง", "น่ารัก", "สดใส", "อัจฉริยะ"
];

const NOUNS = [
  "แมวน้ำ", "สิงโต", "หุ่นยนต์", "นักวิทย์", "เพนกวิน", 
  "โลมา", "จรวด", "ดาวเคราะห์", "ไดโนเสาร์", "นกฮูก"
];

export const generateRandomName = (): string => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${noun}${adj}`;
};
