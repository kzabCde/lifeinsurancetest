import type { Category, Difficulty } from '@/types';

export type BlueprintPart = {
  id: 'part-a' | 'part-b';
  title: string;
  category: Category;
  questionCount: number;
  passScore: number;
  topicDistribution: Record<string, number>;
};

export type ExamBlueprint = {
  id: string;
  title: string;
  totalQuestions: number;
  totalMinutes: number;
  difficultyDistribution: Record<Difficulty, number>;
  parts: BlueprintPart[];
};

export const licensingExamBlueprint: ExamBlueprint = {
  id: 'thai-life-agent-license-v1',
  title: 'แบบจำลองข้อสอบตัวแทนประกันชีวิต',
  totalQuestions: 60,
  totalMinutes: 120,
  difficultyDistribution: { easy: 0.3, medium: 0.4, hard: 0.2, expert: 0.1 },
  parts: [
    {
      id: 'part-a',
      title: 'ส่วนที่ 1 จรรยาบรรณและศีลธรรม',
      category: 'จรรยาบรรณและศีลธรรม',
      questionCount: 20,
      passScore: 14,
      topicDistribution: {
        ความซื่อสัตย์: 4,
        การรักษาความลับ: 4,
        การเปิดเผยข้อมูล: 4,
        การบริการลูกค้า: 4,
        ความประพฤติทางวิชาชีพ: 4,
      },
    },
    {
      id: 'part-b',
      title: 'ส่วนที่ 2 ความรู้ประกันชีวิต',
      category: 'ความรู้ประกันชีวิต',
      questionCount: 40,
      passScore: 24,
      topicDistribution: {
        หลักการประกันชีวิต: 5,
        กรมธรรม์ประกันชีวิต: 5,
        สิทธิผู้รับประโยชน์: 5,
        'สิทธิและหน้าที่ของผู้เอาประกันภัย': 5,
        มูลค่าเงินสด: 5,
        'ประมวลกฎหมายแพ่งและพาณิชย์': 7,
        พระราชบัญญัติประกันชีวิต: 8,
      },
    },
  ],
};
