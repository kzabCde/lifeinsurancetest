import type { Category, Difficulty, Question, QuestionType } from '@/types';

type Angle = {
  label: string;
  type: QuestionType;
  scenario: boolean;
  objective: string;
  stem: (topic: string, point: string, actor: string) => string;
  choices: (topic: string, point: string, category: Category) => [string, string, string, string];
  explanation: (topic: string, point: string, category: Category) => string;
};

type TopicPlan = { category: Category; topic: string; points: string[] };

const difficulties: Difficulty[] = ['easy', 'medium', 'medium', 'hard', 'expert'];
const actors = ['นายสมชาย', 'นางสาวมาลี', 'ครอบครัวคุณอนันต์', 'เจ้าของกิจการรายย่อย', 'พนักงานบริษัทเอกชน', 'ผู้สูงอายุที่ต้องการวางแผนมรดก'];

const ethicsPlans: TopicPlan[] = [
  { category: 'จรรยาบรรณ', topic: 'ความซื่อสัตย์', points: ['การนำเสนอข้อมูลจริง', 'การไม่ปกปิดข้อยกเว้น'] },
  { category: 'จรรยาบรรณ', topic: 'การบริการลูกค้า', points: ['การติดตามหลังการขาย', 'การอธิบายขั้นตอนเคลม'] },
  { category: 'จรรยาบรรณ', topic: 'การรักษาความลับ', points: ['ข้อมูลสุขภาพลูกค้า', 'ข้อมูลการเงินผู้เอาประกันภัย'] },
  { category: 'จรรยาบรรณ', topic: 'การเปิดเผยข้อมูล', points: ['การเปิดเผยผลประโยชน์', 'การอธิบายเงื่อนไขกรมธรรม์'] },
  { category: 'จรรยาบรรณ', topic: 'ความเหมาะสมของแบบประกัน', points: ['การวิเคราะห์ความต้องการ', 'การไม่ขายเกินกำลังชำระ'] },
  { category: 'จรรยาบรรณ', topic: 'จริยธรรมค่าบำเหน็จ', points: ['การไม่ชักจูงด้วยค่าตอบแทน', 'การไม่บิดเบือนเพื่อค่าคอมมิชชัน'] },
  { category: 'จรรยาบรรณ', topic: 'การเปลี่ยนกรมธรรม์', points: ['การเปรียบเทียบข้อดีข้อเสีย', 'การป้องกันการ replacement ไม่เหมาะสม'] },
  { category: 'จรรยาบรรณ', topic: 'ความประพฤติทางวิชาชีพ', points: ['การไม่ทำลายชื่อเสียงวิชาชีพ', 'การติดต่ออย่างสุภาพ'] },
  { category: 'จรรยาบรรณ', topic: 'การเรียนรู้อย่างต่อเนื่อง', points: ['การติดตามกฎใหม่', 'การพัฒนาความรู้ผลิตภัณฑ์'] },
  { category: 'จรรยาบรรณ', topic: 'มาตรฐานศีลธรรม', points: ['การไม่เอาเปรียบผู้เปราะบาง', 'การตัดสินใจโดยคำนึงถึงประโยชน์ลูกค้า'] },
];

const lifePlans: TopicPlan[] = [
  { category: 'ความรู้ประกันชีวิต', topic: 'หลักการประกันชีวิต', points: ['การเฉลี่ยภัย', 'ส่วนได้เสียอันอาจเอาประกันภัย', 'หลักสุจริตอย่างยิ่ง'] },
  { category: 'ความรู้ประกันชีวิต', topic: 'พื้นฐานการประกันชีวิต', points: ['ความเสี่ยงต่อชีวิต', 'บทบาทการออมและคุ้มครอง', 'การวางแผนคุ้มครองรายได้ครอบครัว'] },
  { category: 'ความรู้ประกันชีวิต', topic: 'ประเภทการประกันชีวิต', points: ['สามัญ รายย่อย กลุ่ม', 'ตลอดชีพ สะสมทรัพย์ ชั่วระยะเวลา', 'การเลือกประเภทให้เหมาะกับวัตถุประสงค์'] },
  { category: 'ความรู้ประกันชีวิต', topic: 'แบบการประกันชีวิต', points: ['แบบตลอดชีพ', 'แบบสะสมทรัพย์', 'แบบชั่วระยะเวลา'] },
  { category: 'ความรู้ประกันชีวิต', topic: 'มูลค่าเงินสด', points: ['มูลค่าเวนคืน', 'การกู้เงินตามกรมธรรม์', 'มูลค่าใช้เงินสำเร็จและมูลค่าขยายเวลา'] },
  { category: 'ความรู้ประกันชีวิต', topic: 'สิทธิผู้รับประโยชน์', points: ['การเปลี่ยนผู้รับประโยชน์', 'สิทธิเมื่อผู้เอาประกันภัยเสียชีวิต', 'ผู้รับประโยชน์หลายคนและสัดส่วนผลประโยชน์'] },
  { category: 'ความรู้ประกันชีวิต', topic: 'สิทธิและหน้าที่ของผู้เอาประกันภัย', points: ['ระยะเวลาผ่อนผัน', 'การแถลงข้อความจริง', 'สิทธิยกเลิกกรมธรรม์ในระยะพิจารณา'] },
  { category: 'ความรู้ประกันชีวิต', topic: 'เบี้ยประกันภัย', points: ['ปัจจัยคำนวณเบี้ย', 'ผลของการไม่ชำระเบี้ย', 'รูปแบบการชำระเบี้ยรายเดือนรายปี'] },
  { category: 'ความรู้ประกันชีวิต', topic: 'การพิจารณารับประกันภัย', points: ['การประเมินสุขภาพ', 'การจัดชั้นความเสี่ยง', 'การเพิ่มเบี้ยหรือยกเว้นความคุ้มครอง'] },
  { category: 'ความรู้ประกันชีวิต', topic: 'สัญญาเพิ่มเติมสุขภาพ', points: ['ค่ารักษาพยาบาล', 'ข้อยกเว้นสุขภาพ', 'ระยะเวลารอคอยของสัญญาเพิ่มเติม'] },
  { category: 'ความรู้ประกันชีวิต', topic: 'สัญญาเพิ่มเติมทุพพลภาพ', points: ['การยกเว้นเบี้ยเมื่อทุพพลภาพ', 'นิยามทุพพลภาพสิ้นเชิงถาวร', 'หลักฐานทางการแพทย์ประกอบการเรียกร้อง'] },
  { category: 'ความรู้ประกันชีวิต', topic: 'การประกันกลุ่ม', points: ['นายจ้างเป็นผู้ถือกรมธรรม์', 'ใบรับรองการประกันภัย', 'สมาชิกเข้าออกจากความคุ้มครองกลุ่ม'] },
  { category: 'ความรู้ประกันชีวิต', topic: 'การประกันชีวิตแบบอุตสาหกรรม', points: ['เบี้ยประกันจำนวนไม่สูง', 'การเก็บเบี้ยถี่', 'วงเงินคุ้มครองสำหรับรายได้น้อย'] },
  { category: 'ความรู้ประกันชีวิต', topic: 'ประมวลกฎหมายแพ่งและพาณิชย์', points: ['สัญญาประกันภัย', 'หน้าที่เปิดเผยข้อความจริง', 'ผลของการแถลงเท็จหรือปกปิดข้อความจริง'] },
  { category: 'ความรู้ประกันชีวิต', topic: 'กฎหมายประกันชีวิต', points: ['ใบอนุญาตตัวแทน', 'ข้อห้ามในการชักชวน', 'หน้าที่ส่งมอบเอกสารและใบรับเงิน'] },
  { category: 'ความรู้ประกันชีวิต', topic: 'ข้อกำหนด คปภ.', points: ['การกำกับดูแลตัวแทน', 'การโฆษณาและเอกสารเสนอขาย', 'ช่องทางร้องเรียนและการคุ้มครองผู้บริโภค'] },
  { category: 'ความรู้ประกันชีวิต', topic: 'พระราชบัญญัติประกันชีวิต', points: ['บทบาทนายทะเบียน', 'การคุ้มครองผู้เอาประกันภัย', 'มาตรการเมื่อบริษัทไม่ปฏิบัติตามกฎหมาย'] },
];

const angles: Angle[] = [
  { label: 'recall', type: 'multiple-choice', scenario: false, objective: 'นิยามและหลักเกณฑ์พื้นฐาน', stem: (t, p) => `ข้อใดอธิบายหลักเรื่อง${p}ในหัวข้อ${t}ได้ถูกต้องที่สุด`, choices: (t, p, c) => [`ให้${p}ขึ้นอยู่กับดุลยพินิจของตัวแทนเท่านั้น`, `พิจารณา${p}ตามหลักเกณฑ์ของ${t}และเงื่อนไขกรมธรรม์อย่างครบถ้วน`, `ใช้คำบอกเล่าของบุคคลภายนอกแทนเอกสารจริง`, `ละเว้นรายละเอียดที่ทำให้ลูกค้าต้องใช้เวลาตัดสินใจ`], explanation: (t, p) => `${p}ต้องอธิบายตามหลักของ${t}โดยใช้ข้อมูลจริง เงื่อนไขกรมธรรม์ และข้อกฎหมายที่เกี่ยวข้อง ไม่ใช่ดุลยพินิจหรือคำบอกเล่าที่ไม่ตรวจสอบ` },
  { label: 'scenario-client', type: 'scenario', scenario: true, objective: 'การตัดสินใจเมื่อลูกค้าขอคำแนะนำ', stem: (t, p, a) => `${a}สอบถามตัวแทนเกี่ยวกับ${p}ภายใต้หัวข้อ${t} ก่อนตัดสินใจซื้อประกันชีวิต ตัวแทนควรดำเนินการอย่างไร`, choices: () => ['เร่งให้ลงนามก่อนแล้วค่อยส่งเอกสารตามหลัง', 'อธิบายข้อมูลสำคัญ เปรียบเทียบทางเลือก และให้ลูกค้าตัดสินใจจากข้อมูลครบถ้วน', 'เสนอเฉพาะแบบที่มีค่าบำเหน็จสูงที่สุด', 'บอกว่าทุกแบบให้ผลเหมือนกันเพื่อไม่ให้ลูกค้าสับสน'], explanation: (t, p) => `สถานการณ์นี้ทดสอบการนำ${p}ไปใช้จริง ตัวแทนต้องให้ข้อมูลครบถ้วนและเหมาะสมกับความต้องการของลูกค้าในหัวข้อ${t}` },
  { label: 'case-risk', type: 'case-analysis', scenario: true, objective: 'การวิเคราะห์ความเสี่ยงและผลกระทบ', stem: (t, p, a) => `กรณีศึกษา: ${a}เลือกกรมธรรม์โดยเข้าใจ${p}คลาดเคลื่อน ต่อมามีข้อพิพาทเกี่ยวกับ${t} ประเด็นใดควรวิเคราะห์เป็นอันดับแรก`, choices: (t, p) => [`ใครเป็นผู้แนะนำโดยไม่ต้องดูเอกสาร`, `ข้อเท็จจริง เอกสารเสนอขาย เงื่อนไขกรมธรรม์ และความเข้าใจเกี่ยวกับ${p}`, `จำนวนเพื่อนของลูกค้าที่ซื้อแบบเดียวกัน`, `ยอดขายของตัวแทนในเดือนนั้น`], explanation: (t, p) => `การวิเคราะห์ข้อพิพาทต้องเริ่มจากข้อเท็จจริงและเอกสารที่เกี่ยวข้องกับ${p} ไม่ใช่ปัจจัยภายนอกที่ไม่เกี่ยวกับสิทธิหรือหน้าที่ตาม${t}` },
  { label: 'exception', type: 'multiple-choice', scenario: false, objective: 'ข้อยกเว้นหรือข้อควรระวัง', stem: (t, p) => `ข้อใดเป็นข้อควรระวังสำคัญเกี่ยวกับ${p}ในเรื่อง${t}`, choices: () => ['สามารถละเลยข้อยกเว้นได้หากลูกค้าไว้ใจตัวแทน', 'ต้องชี้แจงข้อจำกัด เงื่อนไข และผลกระทบที่อาจเกิดขึ้นก่อนลูกค้าตัดสินใจ', 'แจ้งเฉพาะตอนลูกค้าเรียกร้องผลประโยชน์แล้ว', 'ให้ลูกค้าเดาจากชื่อแบบประกันเอง'], explanation: (t, p) => `ข้อควรระวังของ${p}คือการสื่อสารข้อจำกัดและผลกระทบล่วงหน้า เพื่อป้องกันความเข้าใจผิดและสอดคล้องกับ${t}` },
  { label: 'application', type: 'scenario', scenario: true, objective: 'การประยุกต์ใช้ในชีวิตจริง', stem: (t, p, a) => `${a}มีภาระครอบครัวและต้องการใช้ประกันชีวิตวางแผนการเงิน หากประเด็นหลักคือ${p} ตัวแทนควรถามหรือประเมินเรื่องใดก่อน`, choices: () => ['ถามเฉพาะงบประมาณและขายแบบที่ถูกที่สุด', 'ประเมินเป้าหมาย ความเสี่ยง ความสามารถชำระเบี้ย และเงื่อนไขที่เกี่ยวข้อง', 'เลือกแบบที่บริษัทกำลังส่งเสริมการขาย', 'ให้ญาติของลูกค้าเลือกแทนทั้งหมด'], explanation: (t, p) => `การประยุกต์ใช้${p}ต้องเริ่มจากการวิเคราะห์ความต้องการและความสามารถของลูกค้า เพื่อให้คำแนะนำในหัวข้อ${t}เหมาะสม` },
  { label: 'legal-interpretation', type: 'case-analysis', scenario: true, objective: 'การตีความกฎหมายและสิทธิหน้าที่', stem: (t, p, a) => `สถานการณ์ทางกฎหมาย: ${a}โต้แย้งเรื่อง${p}หลังกรมธรรม์มีผลบังคับใช้ ข้อใดเป็นแนวทางตีความที่เหมาะสม`, choices: () => ['ยึดคำพูดที่ไม่อยู่ในเอกสารเป็นหลักเสมอ', 'พิจารณากฎหมาย เงื่อนไขกรมธรรม์ ใบคำขอ และหลักฐานการเปิดเผยข้อมูลร่วมกัน', 'ให้ตัวแทนตัดสินแทนนายทะเบียน', 'ถือว่าบริษัทต้องจ่ายทุกกรณีโดยไม่ดูข้อยกเว้น'], explanation: (t, p) => `การตีความ${p}ต้องอาศัยกฎหมายและเอกสารสัญญาที่เกี่ยวข้องกับ${t}ร่วมกัน ไม่ควรอ้างคำพูดลอย ๆ หรือสรุปเกินเงื่อนไข` },
  { label: 'mistake-diagnosis', type: 'situational-ethics', scenario: true, objective: 'การวินิจฉัยข้อผิดพลาดที่พบบ่อย', stem: (t, p, a) => `${a}ได้รับคำแนะนำที่ทำให้เข้าใจ${p}ผิดพลาด ข้อใดสะท้อนความผิดพลาดของตัวแทนได้ชัดเจนที่สุด`, choices: () => ['ใช้ภาษาที่เข้าใจง่ายและให้เอกสารประกอบ', 'ไม่ตรวจสอบความต้องการจริงและไม่อธิบายผลเสียที่เกี่ยวข้อง', 'แนะนำให้ลูกค้าถามคำถามเพิ่มเติม', 'บันทึกเหตุผลในการเลือกแบบประกันไว้เป็นหลักฐาน'], explanation: (t, p) => `ข้อผิดพลาดสำคัญคือไม่ประเมินความต้องการและไม่อธิบายผลกระทบของ${p} ซึ่งขัดกับการให้คำแนะนำที่รอบคอบใน${t}` },
  { label: 'comparison', type: 'multiple-choice', scenario: false, objective: 'การเปรียบเทียบแนวทางที่ถูกและผิด', stem: (t, p) => `เมื่อต้องเปรียบเทียบทางเลือกเกี่ยวกับ${p}ในหัวข้อ${t} ข้อใดเหมาะสมที่สุด`, choices: () => ['เปรียบเทียบเฉพาะผลประโยชน์โดยไม่พูดถึงค่าใช้จ่าย', 'แสดงทั้งประโยชน์ ข้อจำกัด ค่าใช้จ่าย และผลระยะยาวอย่างสมดุล', 'เน้นว่าทางเลือกที่แพงที่สุดดีที่สุดเสมอ', 'หลีกเลี่ยงการเปรียบเทียบเพราะทำให้ขายช้าลง'], explanation: (t, p) => `การเปรียบเทียบ${p}ต้องสมดุลทั้งประโยชน์ ข้อจำกัด และค่าใช้จ่าย เพื่อให้สอดคล้องกับหลัก${t}และช่วยให้ลูกค้าตัดสินใจได้จริง` },
  { label: 'document-review', type: 'case-analysis', scenario: true, objective: 'การอ่านเอกสารและหลักฐาน', stem: (t, p, a) => `${a}ได้รับกรมธรรม์แล้วพบข้อความเกี่ยวกับ${p}ไม่ตรงกับที่เข้าใจ ควรตรวจสอบเอกสารใดเป็นหลัก`, choices: () => ['ข้อความโฆษณาที่แชร์ต่อในสื่อสังคมออนไลน์', 'ใบคำขอ เอกรสารเสนอขาย เงื่อนไขกรมธรรม์ และบันทึกการชี้แจง', 'ความคิดเห็นของเพื่อนที่ไม่ใช่คู่สัญญา', 'อันดับยอดขายของบริษัทในปีล่าสุด'], explanation: (t, p) => `การทบทวน${p}ควรอ้างอิงเอกสารสัญญาและหลักฐานการเสนอขายที่เกี่ยวข้องกับ${t} เพื่อให้ตรวจสอบสิทธิและหน้าที่ได้ชัดเจน` },
  { label: 'real-life-service', type: 'scenario', scenario: true, objective: 'การให้บริการหลังการขาย', stem: (t, p, a) => `หลังออกกรมธรรม์ ${a}ขอให้ตัวแทนอธิบาย${p}อีกครั้ง แนวทางบริการหลังการขายที่ดีที่สุดคือข้อใด`, choices: () => ['ตอบสั้น ๆ ว่าให้อ่านเองทั้งหมด', 'นัดอธิบายประเด็นสำคัญ ตรวจความเข้าใจ และแนะนำช่องทางติดต่อบริษัทหรือ คปภ. เมื่อจำเป็น', 'ปฏิเสธเพราะขายสำเร็จแล้ว', 'ขอค่าบริการพิเศษก่อนอธิบายข้อมูลพื้นฐาน'], explanation: (t, p) => `บริการหลังการขายที่ดีต้องช่วยให้ลูกค้าเข้าใจ${p}อย่างถูกต้อง และรู้ช่องทางใช้สิทธิหรือขอความช่วยเหลือในเรื่อง${t}` },
];

const diversifyChoices = (choices: [string, string, string, string], sequence: number) => {
  const correct = choices[1];
  const distractors = [choices[0], choices[2], choices[3]];
  const answer = sequence % 4;
  const arranged = [...distractors];
  arranged.splice(answer, 0, correct);
  return { choices: arranged as [string, string, string, string], answer };
};

const buildQuestion = (plan: TopicPlan, point: string, angle: Angle, sequence: number): Question => {
  const actor = actors[sequence % actors.length];
  const diversified = diversifyChoices(angle.choices(plan.topic, point, plan.category), sequence);
  return {
    id: `${plan.category === 'จรรยาบรรณ' ? 'ETH' : 'LIFE'}-${String(sequence + 1).padStart(4, '0')}`,
    category: plan.category,
    topic: plan.topic,
    difficulty: difficulties[(sequence + angle.label.length) % difficulties.length],
    type: angle.type,
    question: angle.stem(plan.topic, point, actor),
    choices: diversified.choices,
    answer: diversified.answer,
    explanation: angle.explanation(plan.topic, point, plan.category),
    references: [`${plan.category}: ${plan.topic}`, `มุมคำถาม: ${angle.objective}`, `จุดความรู้: ${point}`],
  };
};

const buildBank = () => {
  const source = [...ethicsPlans, ...lifePlans];
  const bank: Question[] = [];
  for (const plan of source) {
    for (const point of plan.points) {
      for (const angle of angles) {
        bank.push(buildQuestion(plan, point, angle, bank.length));
      }
    }
  }
  return bank;
};

export const questionBank: Question[] = buildBank();

export const topics = {
  ethicsTopics: ethicsPlans.map((plan) => plan.topic),
  lifeTopics: lifePlans.map((plan) => plan.topic),
};

export const questionBankQuality = {
  total: questionBank.length,
  ethics: questionBank.filter((question) => question.category === 'จรรยาบรรณ').length,
  lifeInsurance: questionBank.filter((question) => question.category === 'ความรู้ประกันชีวิต').length,
  scenarioBased: questionBank.filter((question) => question.type !== 'multiple-choice').length,
  scenarioRatio: questionBank.filter((question) => question.type !== 'multiple-choice').length / questionBank.length,
  uniqueLearningAngles: new Set(questionBank.map((question) => question.references.join('|'))).size,
};

export const validateQuestionBankUniqueness = () => {
  const duplicateIds = questionBank.filter((question, index) => questionBank.findIndex((candidate) => candidate.id === question.id) !== index);
  const duplicateObjectives = questionBank.filter((question, index) => questionBank.findIndex((candidate) => candidate.topic === question.topic && candidate.references[1] === question.references[1] && candidate.references[2] === question.references[2]) !== index);
  const scenarioRatioIsValid = questionBankQuality.scenarioRatio >= 0.5;
  return { duplicateIds, duplicateObjectives, scenarioRatioIsValid, quality: questionBankQuality };
};
