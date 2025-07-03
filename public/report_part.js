async function generate_reportPDF() {
  let currentPage = 1
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        format: 'a4',
        unit: 'cm'
      });

    // ตั้งฟอนต์ไทย
        doc.addFileToVFS('THSarabunNew-normal.ttf', THSarabunNew_normal);
        doc.addFont('THSarabunNew-normal.ttf', 'THSarabunNew', 'normal');
        doc.addFileToVFS('THSarabunNew-bold.ttf', THSarabunNew_bold);
        doc.addFont('THSarabunNew-bold.ttf', 'THSarabunNew', 'bold');
        doc.setFont("THSarabunNew");

calculateDuration();
const pageWidth = doc.internal.pageSize.getWidth();
doc.text(`สัญญาเงินยืมเลขที่ ${document.getElementById("con_number").value}    วันที่ ${document.getElementById("thai-datepicker6").value}`,3,2,{align: 'left'});
doc.text(
  `ชื่อผู้ยืม ${document.getElementById("Borrower").value}     จำนวนเงิน ${
    parseFloat(
      (document.getElementById("amount_borrow")?.value || "0").replace(/,/g, "")
    ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  } บาท`,
  3,
  2.7,
  { align: 'left' }
);
doc.text(`ส่วนที่1`,pageWidth-2,2, {align: 'right'});
doc.text(`แบบ 8708`,pageWidth-2,2.7,{align: 'right'});


doc.setFont("THSarabunNew", "bold");
doc.setFontSize(16);
doc.text(`ใบเบิกค่าใช้จ่ายในการเดินทางไปราชการ`,pageWidth / 2, 4, { align: 'center' });

doc.setFont("THSarabunNew", "normal");
doc.text(`ที่ทำการ  คณะวิศวกรรมศาสตร์ มมส.`,pageWidth-2,4.7, {align: 'right'});
doc.text(`วันที่ ${document.getElementById("thai-datepicker7").value}`,pageWidth-2,5.4,{align: 'right'});


let y = 6.1;
const topic_re = doc.splitTextToSize(`เรื่อง`, 16);
doc.setFont("THSarabunNew", "bold");
doc.text(topic_re, 3, y);
doc.setFont("THSarabunNew", "normal");
doc.text(`        ${document.getElementById("topic_re").value}`,3,y)
y += topic_re.length * 0.7;
doc.setFont("THSarabunNew", "bold");
doc.text (`เรียน`,3, y);
doc.setFont("THSarabunNew", "normal");
doc.text(`        ${document.getElementById("dear_re").value}`,3, y)
y += 1; 



const radios = [
    { id: "GH2", label: "บ้านพัก" },
    { id: "GS2", label: "สำนักงาน" },
    { id: "GT2", label: "ประเทศไทย" },
    { id: "GF2", label: "ต่างประเทศ" }
];
let radioText = radios.map(r => {
    const checked = document.getElementById(r.id).checked;
    // รวมเป็นคำเดียวด้วย non-breaking space หน้าและหลัง
    return ` ( ${checked ? "/" : ""} )${r.label}`;
}).join("");

const radios1 = [
    { id: "GH", label: "บ้านพัก" },
    { id: "GS", label: "สำนักงาน" },
    { id: "GT", label: "ประเทศไทย" },
    { id: "GF", label: "ต่างประเทศ" }
];
let radioText1 = radios1.map(r => {
    const checked = document.getElementById(r.id).checked;
    return ` ( ${checked ? "/" : ""} )${r.label}`;
}).join("");

// เนื้อหา
const firstLineWidth = 13;
const nextLinesWidth = 16;

const descripts = `ตามคำสั่ง/บันทึกที่ ${document.getElementById("rebd2").value} ลงวันที่ ${document.getElementById("thai-datepicker8").value} ได้อนุมัติให้ ข้าพเจ้า ${document.getElementById("nrq_re").value} ตำแหน่ง ${document.getElementById("pst_re").value} สังกัด ${document.getElementById("pt_re").value} เดินทางไปปฏิบัติราชการเพื่อ ${document.querySelector('input[name="qqee"]:checked')?.value || ''} เรื่อง ${document.getElementById("subject_re").value} ณ ${document.getElementById("lo_re").value} 
โดยออกเดินทางจาก 
  ${radioText1} ตั้งแต่วันที่ ${document.getElementById("thai-datepicker9").value} เวลา ${document.getElementById("timepicker3").value} น. 
และกลับถึง 
  ${radioText} วันที่ ${document.getElementById("thai-datepicker10").value} เวลา ${document.getElementById("timepicker4").value} น. 
${document.getElementById("daysresult").textContent}`;

const linesTemps = doc.splitTextToSize(descripts, firstLineWidth);

const firstLine = linesTemps[0];

const remainingText = descripts.substring(firstLine.length).trim(); // ตัดช่องว่างหน้าออก

// ตัดข้อความส่วนที่เหลือด้วยความกว้าง 16
const remainingLines = doc.splitTextToSize(remainingText, nextLinesWidth);

// รวมกัน
const allLines = [firstLine, ...remainingLines];

let lineY = y;
allLines.forEach((line, index) => {
  const x = index === 0 ? 5 : 3;
  doc.text(line, x, lineY);
  lineY += 0.7;
});
y=lineY;
y += 0.3;
const radios2 = [
    { id: "bb", label: "ข้าพเจ้า" },
    { id: "bb2", label: "คณะเดินทาง" },
];
let radioText2 = radios2.map(r => {
    const checked = document.getElementById(r.id).checked;
    return `( ${checked ? "/" : ""} )${r.label}`;
}).join(" ");

doc.text(`ข้าพเจ้า ขอเบิกค่าใช้จ่ายในการเดินทางไปราชการสำหรับ ${radioText2} ดังนี้`, 3, y);
y += 1;
doc.text(`1.ค่าเบี้ยเลี้ยง`, 3, y);
doc.text(`รวมเป็นเงิน ${document.getElementById("Real_GrandTotal_Allowance_Cost").textContent} บาท`, pageWidth-2, y,{align: 'right'});
y += 0.7;


let DetailOfAllowance1 = document.getElementById("real_allowance_cost_1").value.trim();

if (DetailOfAllowance1) {
  let DetailOfAllowance1formatted = DetailOfAllowance1 ? Number(DetailOfAllowance1.replace(/,/g, '')).toLocaleString() : "-";
  let persons1 = document.getElementById("real_NumberOfPersons_1").value.trim() || "0";
  let days1 = document.getElementById("real_NumberOfDate_1").value.trim() || "0";
  
  doc.text(`-ค่าเบี้ยเลี้ยง ${DetailOfAllowance1formatted} บาท จำนวน ${persons1} คน ระยะเวลา ${days1} วัน`, 5, y);
  y += 0.7;
}

let DetailOfAllowance2 = document.getElementById("real_allowance_cost_2").value.trim();
if (DetailOfAllowance2) {
  let DetailOfAllowance2formatted = DetailOfAllowance1 ? Number(DetailOfAllowance1.replace(/,/g, '')).toLocaleString() : "-";
  let persons2 = document.getElementById("real_NumberOfPersons_2").value.trim() || "0";
  let days2 = document.getElementById("real_NumberOfDate_2").value.trim() || "0";
  doc.text(`-ค่าเบี้ยเลี้ยง ${DetailOfAllowance2formatted} บาท จำนวน ${persons2} คน ระยะเวลา ${days2} วัน`, 5, y);
  y += 0.7;
}
y+= 0.3;


doc.text(`2.ค่าที่พัก ${document.querySelector('input[name="radio_re"]:checked')?.value || ''}`, 3, y);
doc.text(`รวมเป็นเงิน ${document.getElementById("Real_GrandTotal_Accommodation_Cost").textContent} บาท`, pageWidth-2, y,{align: 'right'});
y += 0.7;
const Accommodation_Costrows = document.querySelectorAll("#Real_accommodation .Real_accommodation_1");
Accommodation_Costrows.forEach((row, idx) => {
  const cost = row.querySelector(".real_accommodation_cost")?.value.trim() || "0";
  const rooms = row.querySelector(".real_accommodation_person")?.value.trim() || "0";
  const days = row.querySelector(".real_accommodation_day")?.value.trim() || "0";
  
  // ถ้ามีค่าใดค่าหนึ่งไม่เป็นศูนย์ ค่อยพิมพ์
  if (cost !== "0" || rooms !== "0" || days !== "0") {
    const costH = cost ? Number(cost.replace(/,/g, '')).toLocaleString() : "0";
    const unit = idx === 0 ? "ห้อง" : "คน";
    doc.text(`-ค่าที่พักราคา ${costH} บาท จำนวน ${rooms} ${unit} ระยะเวลา ${days} วัน`, 5, y);
    y += 0.7;
  }
});
y += 0.3;

doc.text(`3.ค่าพาหนะ`, 3, y);
doc.text(`รวมเป็นเงิน ${document.getElementById("R_Transportation_expenses_result").textContent} บาท`, pageWidth-2, y, { align: 'right' });
y += 0.7;

const personalBox = document.querySelector("#R_personal_car_box");
if (personalBox && personalBox.style.display !== "none") {
  const inputs = personalBox.querySelectorAll("input");
  const license = inputs[0].value.trim();
  const driver = inputs[1].value.trim();
  const distance = inputs[2].value.trim();
  const total = document.getElementById("R_total_personal_car").textContent.trim();

  const distanceFormatted = distance ? Number(distance.replace(/,/g, '')).toLocaleString() : "-";
  const totalFormatted = total ? Number(total.replace(/,/g, '')).toLocaleString() : "-";

  if (license || driver || distance) {
    const text1 = `-รถยนต์ส่วนบุคคล 
    หมายเลขทะเบียน ${license || "-"} โดยมี ${driver || "-"} เป็นผู้ขับรถ
    ระยะทางโดยประมาณ ${distanceFormatted} กม. เป็นเงิน ${totalFormatted} บาท`;
    const lines = doc.splitTextToSize(text1, pageWidth - 7); // ความกว้างหน้ากระดาษลบ margin ซ้ายขวา
    const firstX = 5;
    const indentX = 5;

    lines.forEach((line, index) => {
    const x = index === 0 ? firstX : indentX;
    doc.text(line, x, y + index * 0.7);
  });

    y += lines.length * 0.7; // ปรับระยะ Y ตามจำนวนบรรทัด
  }
}

  // ===== รถยนต์ราชการ =====
  const reignBox = document.querySelector("#R_reign_car_box");
  if (reignBox && reignBox.style.display !== "none") {
    const inputs = reignBox.querySelectorAll("input");
    const license = inputs[0].value.trim();
    const driver = inputs[1].value.trim();
    const distance = inputs[2].value.trim();
    const total = document.getElementById("R_total_reign_car").textContent.trim();
    const distanceFormatted = distance ? Number(distance.replace(/,/g, '')).toLocaleString() : "-";
    if (license || driver || distance) {
      const text1 = `-รถยนต์ของทางราชการ 
      หมายเลขทะเบียน ${license || "-"} โดยมี ${driver || "-"} เป็นพนักงานขับรถ 
      ระยะทางโดยประมาณ ${distanceFormatted} กม.  เป็นเงิน ${total} บาท`
      const lines = doc.splitTextToSize(text1, pageWidth - 7); // ความกว้างหน้ากระดาษลบ margin ซ้ายขวา
    const firstX = 5;
    const indentX = 5;

    lines.forEach((line, index) => {
    const x = index === 0 ? firstX : indentX;
    doc.text(line, x, y + index * 0.7);
  });
      y += lines.length * 0.7;
    }
  }

  // ===== รายการอื่น ๆ =====
  const transportTypes = [
    { id: "R_airplane", label: "เครื่องบิน" },
    { id: "R_train", label: "รถไฟ" },
    { id: "R_bus", label: "รถประจำทาง" },
    { id: "R_vv", label: "พาหนะรับจ้าง" }
  ];

  for (const type of transportTypes) {
    const box = document.querySelector(`#${type.id}_box`);
    if (box && box.style.display !== "none") {
      const inputs = box.querySelectorAll("input");
      const detail = inputs[0].value.trim();
      const amount = inputs[1].value.trim();
      const amountFormatted = amount ? Number(amount.replace(/,/g, '')).toLocaleString() : "0";

      if (detail || amount) {
        doc.text(`-${type.label} 
          ${detail || ""} เป็นเงิน ${amountFormatted} บาท`, 5, y);
        y += 1.2;
      }
    }
  }
  y += 0.3;



const R_other_cost_resultrows = document.querySelectorAll("#R_other_detail .r_other");

// นับจำนวนแถวที่มีข้อมูล detail หรือ cost
const detailRowsCount = Array.from(R_other_cost_resultrows).filter(row => {
  const detailInput = row.querySelector(".R_other_detail");
  const costInput = row.querySelector(".R_other_costs");
  return (detailInput.value.trim() || costInput.value.trim());
}).length;


let groupHeight = (1 + detailRowsCount) * 0.7; // 1 คือบรรทัดหัวข้อ
y = checkAddPageForGroup(doc, y, groupHeight);

const reignCarCheckbox = document.querySelector('input[name="type"][data-id="R_reign_car"]');
if (reignCarCheckbox && reignCarCheckbox.checked) {
  groupHeight = 2.8;
  y = checkAddPageGroup(doc, y, groupHeight);
  const gbx1Lines1  = `4.ค่าตอบแทนพนักงานขับรถ`;
  doc.text(gbx1Lines1,3, y)
  doc.text(`รวมเป็นเงิน ${document.getElementById("reign_car4413_result").textContent} บาท`,pageWidth-2, y, {align: 'right'});
  y += 0.7;
  const gbx1Lines2  = `ค่าตอบแทนพนักงานขับรถ ${document.getElementById("ggx12").value} บาท X ${document.getElementById("ggx22").value} วัน `;
  doc.text(gbx1Lines2,3, y)
  y += 0.7;
}
y += 0.3;
// พิมพ์หัวข้อ
groupHeight = 2.1;
y = checkAddPageGroup(doc, y, groupHeight);
// Check if reign_car checkbox is checked to determine section number
const sectionNumber = (reignCarCheckbox && reignCarCheckbox.checked) ? '5' : '4';
const gLines1  = `${sectionNumber}.ค่าใช้จ่ายอื่นๆที่จำเป็นในการเดินทางไปราชการ`;
doc.text(gLines1,3, y)
doc.text(`รวมเป็นเงิน ${document.getElementById("R_other_cost_result").textContent} บาท`,pageWidth-2, y, {align: 'right'});
y += 0.7;

const rows2 = document.querySelectorAll("#R_other_detail .r_other");
rows2.forEach((row,index) => {
  const detailInput = row.querySelector(".R_other_detail");
  const costInput = row.querySelector(".R_other_costs");
  const detail = detailInput?.value.trim() || "";
  // ปรับตรงนี้ให้รองรับ , และค่าว่าง
  const costRaw = costInput?.value.trim().replace(/,/g, '') || "0";
  const cost = Number(costRaw).toLocaleString();
  console.log(`Row ${index + 1}:`, detail, cost);
  if (detail || costRaw !== "0") {
    // ตรวจสอบก่อนเพิ่มแถวใหม่
    y = checkAddPageGroup(doc, y, 0.7);
    doc.text(`-${detail} เป็นเงิน ${cost} บาท`,5, y);
    y += 0.7;
  }
});
y += 0.3;


doc.setFont("THSarabunNew", "bold");
doc.text(`รวมทั้งสิ้น ${document.getElementById("R_GrandTotal").textContent} บาท`, pageWidth-2, y,{align: 'right'});
y += 0.7;
doc.text(`จำนวนเงิน (ตัวอักษร)`, 3, y);
doc.text(`${numberToThaiText(window.Grand)}`, pageWidth-2, y,{align: 'right'});
y += 1;


// --- กลุ่มลายเซ็นผู้ขอรับเงิน ---
// --- กลุ่มลายเซ็นผู้ขอรับเงิน ---
const groupSignatureLines = 4; // จำนวนบรรทัดข้อความ (รวมวันที่)
const groupSignatureHeight = (groupSignatureLines * 0.7) + 1.6; // 0.7 ต่อบรรทัด + 1.6 (บรรทัดเว้น)
y = checkAddPageForGroup(doc, y, groupSignatureHeight);

doc.setFont("THSarabunNew", "normal");
doc.text(`ข้าพเจ้าขอรับรองว่ารายการที่กล่าวมาข้างต้นเป็นความจริง และหลักฐานการจ่ายที่ส่งมาด้วย`,5,y);
y += 0.7;
doc.text(`จำนวน...........ฉบับ รวมทั้งจำนวนเงินที่ขอเบิกถูกต้องตามกฎหมายทุกประการ`,3,y);
y += 1.6;

const text1 = "ลงชื่อ...............................................ผู้ขอรับเงิน";
const marginLeft = 10.75;
const marginRight = 0.5;
const pageWidthForSignature = doc.internal.pageSize.getWidth();
const rangeWidth = pageWidthForSignature - marginLeft - marginRight;
const centerX = marginLeft + rangeWidth / 2;
doc.text(text1, centerX, y, { align: 'center' });
y += 0.7;
const text2_1 = `${document.getElementById("nrq_re").value}`;
doc.text(text2_1, centerX-0.3, y, { align: 'center' });
y += 0.7;
const text3_1 = `${document.getElementById("pst_re").value}`;
doc.text(text3_1, centerX-0.3, y, { align: 'center' });
y += 0.7;
const text4_1 = `${document.getElementById("thai-datepicker7").value}`;
doc.text(text4_1, centerX-0.3, y, { align: 'center' });
y += 0.7;

// doc.addPage();

// --- กลุ่มกล่องลายเซ็นสองฝั่ง ---
const groupBoxHeight = 7.5 + 1.7 + 0.7 + 0.7 + 0.7 + 1 + 1.4; 
// 7.5 (กล่อง) + 1.7 (ข้อความหลังกล่อง) + 0.7*3 (ลายเซ็น/ชื่อ/ตำแหน่ง) + 1 (วันที่) + 1.4 (ข้อความท้าย)
y = checkAddPageForGroup(doc, y, groupBoxHeight);

doc.setLineWidth(0.03);
// วาดกล่องซ้าย
doc.rect(1.5, y, 9, 6); // x, y, width, height
doc.text("ได้ตรวจสอบหลักฐาน การเบิกจ่ายเงิน ที่แนบถูกต้องแล้ว", 1.85, y + 0.7);
doc.text("เห็นควรอนุมัติให้เบิกจ่ายได้", 4, y + 1.4);

doc.text("ลงชื่อ.....................................................", 3.2, y + 2.7);
doc.text("(.....................................................)", 3.9, y + 3.4);
doc.text("ตำแหน่ง....................................................", 2.7, y + 4.1);
doc.text("วันที่.....................................................", 3.2, y + 4.8);

// วาดกล่องขวา
doc.rect(10.5, y, 9, 6);
doc.text("อนุมัติให้เบิกจ่ายได้", 13.5, y + 0.7);

doc.text("ลงชื่อ.....................................................", 12.2, y + 2.7);
doc.text("(.....................................................)", 12.9, y + 3.4);
doc.text("ตำแหน่ง......................................................", 11.7, y + 4.1);
doc.text("วันที่......................................................", 12.2, y + 4.8);

y += 7.5; // ปรับตำแหน่ง Y ลงหลังจากวาดกล่อง

doc.text(doc.splitTextToSize(`ได้รับเงินค่าใช้จ่ายในการเดินทางไปราชการ จำนวนเงิน ${document.getElementById("R_GrandTotal").textContent} บาท (${numberToThaiText(window.Grand)}) ไว้เป็นการถูกต้องแล้ว`,17),2,y);
y += 1.7;

// ตั้งค่าความกว้างของ block ลายเซ็นแต่ละฝั่ง
const blockWidth = 7; // หน่วย cm

// คำนวณ X ตำแหน่งซ้ายของ block
const leftBlockX = 3.2;
const rightBlockX = 12.2;

function centerText(text, xStart, width, y) {
  const textWidth = doc.getTextWidth(text);
  const centeredX = xStart + (width - textWidth) / 2;
  doc.text(text, centeredX, y);
}

centerText("ลงชื่อ.....................................................ผู้รับเงิน", leftBlockX, blockWidth, y);
centerText("ลงชื่อ.....................................................ผู้จ่ายเงิน", rightBlockX, blockWidth, y);
y += 0.7;

const nameTextf =`${document.getElementById("nrq_re").value || "(....................................................)"}`;
const nameText ="(....................................................)";
centerText(nameTextf, leftBlockX, blockWidth, y);
centerText(nameText, rightBlockX-0.2, blockWidth, y);
y += 0.7;

const positionTextf =`${document.getElementById("pst_re").value || "ตำแหน่ง...................................................................."}`;
const positionText ="ตำแหน่ง....................................................................";
centerText(positionTextf, leftBlockX, blockWidth, y);
centerText(positionText, rightBlockX-0.25, blockWidth, y);
y += 0.7;

centerText("วันที่.....................................................................", leftBlockX-0.02, blockWidth, y);
centerText("วันที่.....................................................................", rightBlockX-0.02, blockWidth, y);
y += 1;

doc.text(`จากเงินตามสัญญายืมเงินเลขที่ ${document.getElementById("con_number")?.value || "......................."}  วันที่ ${document.getElementById("thai-datepicker6")?.value || "......................."}`,2,y)

y += 1.4;

const ps = `หมายเหตุ: ${document.getElementById("ps")?.value || ".........................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................."}`;
const linesps = doc.splitTextToSize(ps, 18);
const groupPsHeight = linesps.length * 0.7;
y = checkAddPageForGroup(doc, y, groupPsHeight);

doc.text(linesps, 2, y);
y += linesps.length * 0.7;

const alert1 = `1. กรณีเดินทางเป็นหมู่คณะและจัดทำใบเบิกค่าใช้จ่ายรวมฉบับเดียวกัน หากระยะเวลาในการเริ่มต้น และสิ้นสุดการเดินทางของแต่ละบุคคลแตกต่างกัน ให้แสดงรายละเอียดของวันเวลาที่แตกต่างกัน ของบุคคลนั้นในช่องหมายเหตุ`;
const alertLine1 = doc.splitTextToSize(alert1, 18);

const alert2 = `2. กรณียื่นขอเบิกเงินค่าใช้จ่ายรายบุคคล ให้ผู้ขอรับเงินเป็นผู้ลงลายมือชื่อผู้รับเงิน และวันเดือนปีที่รับเงิน กรณีมีการยืมเงินให้ระบุวันที่ที่ได้รับเงินยืม เลขที่สัญญายืม และวันที่อนุมัติเงินยืมด้วย`;
const alertLine2 = doc.splitTextToSize(alert2, 18);

const alert3 = `3. กรณีที่ยื่นขอเบิกค่าใช้จ่ายรวมเป็นหมู่คณะ ผู้ขอรับเงินมิต้องลงลายมือชื่อในช่องผู้รับเงิน ทั้งนี้ให้ผู้มีสิทธิแต่ละคน ลงลายมือชื่อผู้รับเงินในหลักฐานการจ่ายเงิน ( ส่วนที่ 2 )`;
const alertLine3 = doc.splitTextToSize(alert3, 18);

// คำนวณความสูงกลุ่ม "คำชี้แจง"
const groupAlertHeight = 0.5 + (alertLine1.length * 0.5) + (alertLine2.length * 0.5) + (alertLine3.length * 0.5);

y = checkAddPageForGroup(doc, y, groupAlertHeight);

doc.setFont("THSarabunNew", "bold");
doc.text(`คำชี้แจง`, 2, y);
doc.setFontSize(12);
y += 0.5;
doc.setFont("THSarabunNew", "normal");
doc.text(alertLine1, 2, y);
y += alertLine1.length * 0.5;

doc.text(alertLine2, 2, y);
y += alertLine2.length * 0.5;

doc.text(alertLine3, 2, y);
y += alertLine3.length * 0.5;
doc.setFontSize(16);

if (call > 1) {
doc.addPage('a4', 'landscape');

const pageWidth2 = doc.internal.pageSize.getWidth();

doc.text(`ส่วนที่2`,pageWidth2-2,2, {align: 'right'});
doc.text(`แบบ 8708`,pageWidth2-2,2.7,{align: 'right'});

doc.setFont("THSarabunNew", "bold");
doc.text(`หลักฐานการจ่ายเงินค่าใช้จ่ายในการเดินทางไปราชการ`,pageWidth2/2,2.7,{align: 'center'});
doc.setFont("THSarabunNew", "normal");
doc.text(`ชื่อส่วนราชการ คณะวิศวกรรมศาสตร์ มหาวิทยาลัยมหาสารคาม  จังหวัด มหาสารคาม`,pageWidth2/2,3.4,{align: 'center'});
const subject = document.getElementById("subject_re").value;
const location = document.getElementById("lo_re").value;
const dateStart = document.getElementById("thai-datepicker9").value;
const dateEnd = document.getElementById("thai-datepicker10").value;

// ข้อความหลัก (ไม่รวมวันที่)
const mainText = `ใบประกอบค่าใช้จ่ายในการเดินทางไปราชการ เรื่อง ${subject} ณ ${location}`;
// ข้อความวันที่ (ต้องอยู่บรรทัดเดียวกันเสมอ)
const dateText = `วันที่ ${dateStart} ถึงวันที่ ${dateEnd}`;

// แบ่ง mainText เป็นหลายบรรทัด (เช่น 60 ตัวอักษร หรือ 18cm)
const mainLines = doc.splitTextToSize(mainText, 17);   

// รวมกับบรรทัดวันที่
const allLines = [...mainLines, dateText];

// พิมพ์ตรงกลาง
allLines.forEach((line, idx) => {
  doc.text(line, pageWidth2 / 2, 4.1 + idx * 0.7, { align: 'center' });
});
const head = [
  [
    { content: 'ลำดับ', rowSpan: 2 },
    { content: 'ชื่อ - นามสกุล', rowSpan: 2 },
    { content: 'ตำแหน่ง', rowSpan: 2 },
    { content: 'ค่าใช้จ่าย', colSpan: 4, styles: { halign: 'center' } },
    { content: 'รวม', rowSpan: 2 },
    { content: 'ลายมือชื่อผู้รับเงิน', rowSpan: 2 },
    { content: 'วัน เดือน ปี ที่รับเงิน', rowSpan: 2 },
    { content: 'หมายเหตุ', rowSpan: 2 }
  ],
  [
    { content: 'ค่าเบี้ยเลี้ยง' },
    { content: 'ค่าเช่าที่พัก' },
    { content: 'ค่าพาหนะ' },
    { content: 'ค่าใช้จ่ายอื่น' }
  ]
];

function generateBodyFromInputs() {
  const body = [];
  
  for (let i = 1; i <= call; i++) {
    const name = document.getElementById(`name_re_${i}`)?.value || "";
    const position = document.getElementById(`position_re_${i}`)?.value || "";
  
    const allowance = document.getElementById(`allowance_p2_${i}`)?.value
      ? Number(document.getElementById(`allowance_p2_${i}`).value.replace(/,/g, '')).toLocaleString()
      : "";
  
    const accommodation = document.getElementById(`accommodation_p2_${i}`)?.value
      ? Number(document.getElementById(`accommodation_p2_${i}`).value.replace(/,/g, '')).toLocaleString()
      : "";
  
    const vehicles = document.getElementById(`vehicles_p2_${i}`)?.value
      ? Number(document.getElementById(`vehicles_p2_${i}`).value.replace(/,/g, '')).toLocaleString()
      : "";
  
    const other = document.getElementById(`other_p2_${i}`)?.value
      ? Number(document.getElementById(`other_p2_${i}`).value.replace(/,/g, '')).toLocaleString()
      : "";
  
    const total = document.getElementById(`total_p_${i}`)?.value
      ? Number(document.getElementById(`total_p_${i}`).value.replace(/,/g, '')).toLocaleString()
      : "";
  
    const row = [
      i,              // ลำดับ
      name,
      position,
      allowance,
      accommodation,
      vehicles,
      other,
      total,
      "",             // ลายมือชื่อ
      "",             // วันที่รับเงิน
      ""              // หมายเหตุ
    ];
  
    body.push(row);
  }
  return body;
}


const foot = [
    [
      { content: 'รวมเงิน', colSpan: 3, styles: { halign: 'center' } },
      { content: `${document.getElementById("thisResult1").textContent}`, styles: { halign: 'right' } },
      { content: `${document.getElementById("thisResult2").textContent}`, styles: { halign: 'right' } },
      { content: `${document.getElementById("thisResult3").textContent}`, styles: { halign: 'right' } },
      { content: `${document.getElementById("thisResult4").textContent}`, styles: { halign: 'right' } },
      { content: `${document.getElementById("thisResultGran").textContent}`, styles: { halign: 'right' } },
      { content: `ตามสัญญาเงินยืมเลขที่ ${document.getElementById("con_number")?.value || "................"} วันที่ ${document.getElementById("thai-datepicker6")?.value || "................"}`, colSpan: 3 }
    ]
  ];

doc.autoTable({
  head: head,
  body: generateBodyFromInputs(),
  foot: foot,
  theme: 'grid',
  styles: {
    font: 'THSarabunNew',
    fontSize: 14,
    halign: 'center',
    valign: 'middle',
    overflow: 'linebreak',
  },
  headStyles: {
    fillColor: [255, 255, 255],
    textColor: 0,
    lineWidth: 0.02,
    lineColor: [0, 0, 0]
  },
  bodyStyles: {
    fillColor: [255, 255, 255],
    textColor: 0,
    lineWidth: 0.02,
    lineColor: [0, 0, 0]
},
  footStyles: {
    fillColor: [255, 255, 255],
    textColor: 0,
    lineWidth: 0.02,
    lineColor: [0, 0, 0]
  },
  startY: 5.3, // หน่วย pt (ประมาณ 2cm)
  pageSize: 'a4',
  orientation: 'landscape',
  pageBreak: 'avoid',
  columnStyles: {
    0: { cellWidth: 1.2 },
    1: { cellWidth: 5.0 },
    2: { cellWidth: 2.5 },
    3: { cellWidth: 2.0 },
    4: { cellWidth: 2.0 },
    5: { cellWidth: 2.0 },
    6: { cellWidth: 2.0 },
    7: { cellWidth: 2.0 },
    8: { cellWidth: 3.0 },
    9: { cellWidth: 3.0 },
    10: { cellWidth: 2.5 }
  }
});

const finalY = doc.lastAutoTable.finalY
doc.text(`จำนวนเงินรวมทั้งสิ้น (ตัวอักษร)   ${numberToThaiText(window.this)}`, 1.5, finalY + 1.4);
y = finalY + 1.4;
const text2 = "ลงชื่อ....................................................ผู้จ่ายเงิน";
const marginLeft1 = 20;
const marginRight1 = 0;
const pageWidthForSignature1 = doc.internal.pageSize.getWidth();
const rangeWidth1 = pageWidthForSignature1 - marginLeft1 - marginRight1;
const centerX1 = marginLeft1 + rangeWidth1 / 2;
doc.text(text2, centerX1, y+0.75, { align: 'center' });
y+= 0.7;
doc.text("(.......................................................)", centerX1-0.2, y+0.75, { align: 'center' });
y+= 0.7;
doc.text("ตำแหน่ง.........................................................", centerX1-0.7, y+0.75, { align: 'center' });
y+= 0.7;
doc.text("วันที่.........................................................", centerX1-0.4, y+0.75, { align: 'center' });
y+= 0.7;

y2 = y-2;
doc.setFont("THSarabunNew", "bold");
doc.text(`คำชี้แจง`,1.5, y2);
y2 += 0.7;
doc.setFont("THSarabunNew", "normal");
const alert1_2 = ` 1. ค่าเบี้ยเลี้ยงและค่าเช่าที่พัก ให้ระบุอัตราวันละและจำนวนวันที่ขอเบิกของแต่ละบุคคลในช่องหมายเหตุ`;
const alertLine1_2 = doc.splitTextToSize(alert1_2,18);
doc.text(alertLine1_2, 2, y2)
y2 += alertLine1_2.length * 0.7;

const alert2_2 = ` 2. ให้ผู้มีสิทธิแต่ละคนเป็นผู้ลงลายมือชื่อผู้รับเงินและวันเดือนปีที่ได้รับเงิน กรณีเป็นการรับจากเงินยืมให้ระบุวันที่ที่ได้รับจากเงินยืม`;
const alertLine2_2 = doc.splitTextToSize(alert2_2,18);
doc.text(alertLine2_2, 2, y2)
y2 += alertLine2_2.length * 0.7;

const alert3_2 = `3. ผู้จ่ายเงินหมายถึงผู้ที่ขอยืมเงินจากทางราชการ และจ่ายเงินยืมนั้นให้แก่ผู้เดินทางแต่ละคน เป็นผู้ลงลายมือชื่อผู้จ่ายเงิน`;
const alertLine3_2 = doc.splitTextToSize(alert3_2,18);
doc.text(alertLine3_2, 2, y2)
y2 += alertLine3_2.length * 0.7;
};

doc.addPage('a4', 'portrait');

let y3 = 3;
doc.text(`บก 4231`,pageWidth-2,2, {align: 'right'});
doc.setFont("THSarabunNew", "bold");
doc.text(`ใบรับรองแทนใบเสร็จรับเงิน`, pageWidth/2,y3,{align: 'center'});
y3 += 0.7;
doc.text(`ส่วนราชการ มหาวิทยาลัยมหาสารคาม`,pageWidth/2,y3,{align: 'center'});
y3 += 0.7;
doc.setFont("THSarabunNew", "normal");

  const allSections = document.querySelectorAll('[id^="date-section-"]');

  const allData = [];

  allSections.forEach((section) => {
    const date = section.querySelector('.date-header input')?.value || 'ไม่ระบุ';
    const entries = section.querySelectorAll('.entries > div');
  
    entries.forEach((entry) => {
      const inputs = entry.querySelectorAll('input');
      const detail = inputs[1]?.value || '-';
      const distance = inputs[2]?.value
        ? Number(inputs[2].value.replace(/,/g, '')).toLocaleString() + ' กม.'
        : '-';
      const amount = inputs[3]?.value
        ? Number(inputs[3].value.replace(/,/g, '')).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : '-';
  
      allData.push([date, detail, distance, amount]);
    });
  });

const foot1 = [
    [
      { content: 'รวมทั้งสิ้น', colSpan: 3, styles: { halign: 'center' } },
      { content: `${document.getElementById("k").textContent}`, styles: { halign: 'center' } },
      { content: ''}
    ]
  ];
  doc.autoTable({
    head: [['วัน/เดือน/ปี', 'รายละเอียดการจ่ายเงิน', 'ระยะทาง', 'จำนวนเงิน']],
    body: allData,
    foot: foot1,
    startY: y3,
  theme: 'grid',
  styles: {
    font: 'THSarabunNew',
    fontSize: 14,
    halign: 'center',
    valign: 'middle',
    overflow: 'linebreak',
  },
  columnStyles: {
    1: { halign: 'left' }, // คอลัมน์ที่ 2 (เริ่มนับจาก 0)
  },

  headStyles: {
    fillColor: [255, 255, 255],
    textColor: 0,
    lineWidth: 0.02,
    lineColor: [0, 0, 0]
  },
  bodyStyles: {
    fillColor: [255, 255, 255],
    textColor: 0,
    lineWidth: 0.02,
    lineColor: [0, 0, 0],
},
  footStyles: {
    fillColor: [255, 255, 255],
    textColor: 0,
    lineWidth: 0.02,
    lineColor: [0, 0, 0]
  },
  });
const finalY2 = doc.lastAutoTable.finalY
y3 = finalY2 + 1.4;
doc.text(`หมายเหตุ: เหมาจ่ายกิโลเมตรละ 4 บาท `, 1.5, y3);
y3 += 0.7;
// ...existing code...
// หาตัวเลือกการเดินทาง
// ...existing code...
let personalBoxc = document.querySelector("#R_personal_car_box");
let reignBoxc = document.querySelector("#R_reign_car_box");

if (personalBoxc && personalBoxc.style.display !== "none") {
  let inputs = personalBoxc.querySelectorAll("input");
  let license = inputs[0]?.value?.trim() || "";
  let driver = inputs[1]?.value?.trim() || "";
  let travelText = `เดินทางโดย รถยนต์ส่วนบุคคล`;
  if (license) travelText += ` หมายเลขทะเบียน ${license}`;
  if (driver) travelText += ` โดยมี ${driver} เป็นผู้ขับรถ`;
  doc.text(travelText, 1.5, y3);
  y3 += 0.7;
}

if (reignBoxc && reignBoxc.style.display !== "none") {
  let inputs = reignBoxc.querySelectorAll("input");
  let license = inputs[0]?.value?.trim() || "";
  let driver = inputs[1]?.value?.trim() || "";
  let travelText = `เดินทางโดย รถยนต์ของทางราชการ`;
  if (license) travelText += ` หมายเลขทะเบียน ${license}`;
  if (driver) travelText += ` โดยมี ${driver} เป็นพนักงานขับรถ`;
  doc.text(travelText, 1.5, y3);
  y3 += 0.7;
}
// ...existing code...
// ...existing code...
y3 += 0.7;
const kValue = Number((document.getElementById("k").textContent || "0").replace(/,/g, ''));
doc.text(`รวมทั้งสิ้น(ตัวอักษร)   ${numberToThaiText(kValue)}`, 1.5, y3);
y3 += 2.1;
doc.text(`ข้าพเจ้า ${document.getElementById("nrq_re").value}  ตำแหน่ง ${document.getElementById("pst_re").value}`,1.5,y3)
y3 += 0.7;
doc.text(`สังกัด กอง ${document.getElementById("pt_re").value}`,1.5,y3)
y3 += 0.7;
doc.text(`ขอรับรองว่ารายจ่ายข้างต้นนี้ ไม่อาจเรียกใบเสร็จรับเงินจากผู้รับได้ และข้าพเจ้าได้จ่ายในงานของราชการโดยแท้`,1.5,y3)
y3 += 2.1;
doc.text("ลงชื่อ....................................................ผู้ขอรับเงิน",pageWidth/2,y3, {align: 'center'});
y3 += 0.7;
doc.text(`${document.getElementById("nrq_re").value}`,pageWidth/2,y3,{align: 'center'});
y3 += 0.7;
doc.text(`${document.getElementById("pst_re").value}`,pageWidth/2,y3,{align: 'center'});


doc.addPage();
let y4 = 2;
doc.text(`ที่ มหาวิทยาลัยมหาสารคาม`,pageWidth-2,y4,{align: 'right'});
y4 += 0.7;
doc.text(`(ส่วนราชการเป็นผู้เบิกให้)`,pageWidth-2,y4,{align: 'right'});
y4 += 0.7;
doc.setFont("THSarabunNew", "bold");
doc.text(`ใบสำคัญรับเงิน`,pageWidth/2,y4,{align: 'center'});
y4 += 0.7;
doc.setFont("THSarabunNew", "normal");
doc.text(`วันที่...................................`,pageWidth/2,y4,{align: 'center'});
y4 += 0.7;
doc.text(`ข้าพเจ้า ${document.getElementById("nrq_re").value}`,1.5,y4);
y4 += 0.7;
doc.text(`บ้านเลขที่ คณะวิศวกรรมศาสตร์ มหาวิทยาลัยมหาสารคาม ตำบลขามเรียง อำเภอกันทรวิชัย จังหวัดมหาสารคาม`,1.5,y4);
y4 += 0.7;
doc.text(`ได้รับเงินจาก คณะวิศวกรรมศาสตร์ มหาวิทยาลัยมหาสารคาม ดังรายการต่อไปนี้`,1.5,y4);
y4 += 0.7;


  const allSections1 = document.querySelectorAll('[id^="date-section-"]');

  const allData1 = [];

  allSections1.forEach((section) => {
    const date = section.querySelector('.date-header input').value || 'ไม่ระบุ';
    const entries = section.querySelectorAll('.entries > div');

entries.forEach((entry) => {
  const inputs = entry.querySelectorAll('input');
  const detail = inputs[1]?.value?.trim() || '-';
  const amount = (inputs[3].value)
    ? Number(inputs[3].value.replace(/,/g, '')).toLocaleString()
    : '-';

  allData1.push([date, detail, amount]);
});
  });

const foot2 = [
    [
      { content: 'รวมทั้งสิ้น', colSpan: 2, styles: { halign: 'center' } },
      { content: `${document.getElementById("k").textContent}`, styles: { halign: 'center' } },
      { content: ''}
    ]
  ];
  doc.autoTable({
    head: [['วัน/เดือน/ปี', 'รายละเอียดการจ่ายเงิน', 'จำนวนเงิน']],
    body: allData1,
    foot: foot2,
    startY: y4,
  theme: 'grid',
  styles: {
    font: 'THSarabunNew',
    fontSize: 14,
    halign: 'center',
    valign: 'middle',
    overflow: 'linebreak',
  },
  columnStyles: {
    1: { halign: 'left' }, // คอลัมน์ที่ 2 (เริ่มนับจาก 0)
  },

  headStyles: {
    fillColor: [255, 255, 255],
    textColor: 0,
    lineWidth: 0.02,
    lineColor: [0, 0, 0]
  },
  bodyStyles: {
    fillColor: [255, 255, 255],
    textColor: 0,
    lineWidth: 0.02,
    lineColor: [0, 0, 0],
},
  footStyles: {
    fillColor: [255, 255, 255],
    textColor: 0,
    lineWidth: 0.02,
    lineColor: [0, 0, 0]
  },
  });

const finalY3 = doc.lastAutoTable.finalY
y3 = finalY3 + 0.7;
doc.text(
  `จำนวนเงิน(ตัวอักษร)   ${numberToThaiText(Number((document.getElementById("k").textContent || "0").replace(/,/g, "")))}`,
  1.5,
  y3
);
y3 += 1.4;
centerText("ลงชื่อ.....................................................ผู้รับเงิน", leftBlockX, blockWidth, y3);
centerText("ลงชื่อ.....................................................ผู้จ่ายเงิน", rightBlockX, blockWidth, y3);
y3 += 0.7;

const nameText1 = document.getElementById("nrq_re")?.value || "(......................................................)";
centerText(nameText1, leftBlockX, blockWidth, y3);
centerText(`(......................................................)`, rightBlockX-0.3, blockWidth, y3);
y3 += 0.7;

const positionText1 = document.getElementById("pst_re")?.value || "ตำแหน่ง....................................................";
centerText(positionText1, leftBlockX, blockWidth, y3);
centerText(`ตำแหน่ง.....................................................`, rightBlockX-0.9, blockWidth, y3);
y3 += 0.7;

/**
 * ตรวจสอบพื้นที่ว่างก่อนพิมพ์กลุ่มข้อความ
 * @param {jsPDF} doc
 * @param {number} y - ตำแหน่ง y ปัจจุบัน
 * @param {number} groupHeight - ความสูงของกลุ่ม (cm)
 * @param {number} margin - ระยะขอบล่าง (cm)
 * @returns {number} y ใหม่หลังขึ้นหน้า (ถ้าจำเป็น)
 */
function checkAddPageForGroup(doc, y, groupHeight, margin = 2) {
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  if (y + groupHeight + margin > pageHeight) {
    doc.addPage();
    currentPage++;
    // ใส่เลขหน้า (เริ่มจากหน้าสอง) ด้านบน
    if (currentPage > 1) {
      doc.setFont("THSarabunNew", "normal");
      doc.text(`- ${currentPage} -`, pageWidth / 2, 1.2, { align: 'center' }); // y = 1.2 ด้านบน
    }
    return 2.5; // y ใหม่หลังขึ้นหน้า
  }
  return y;
}

doc.addPage();

const imgData = "data:image/png;base64,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";
  doc.addImage(imgData, 'PNG', 3, 1.5, 1.5, 1.6);

doc.setFont("THSarabunNew", "bold");
doc.setFontSize(26);
doc.text('บันทึกข้อความ', pageWidth/2, 2.5, {align:'center'});

let yy=2.5+0.7+0.7;
doc.setFontSize(16);
doc.setFont("THSarabunNew", "bold");
doc.text(`ส่วนราชการ`,3,yy)
doc.setFont("THSarabunNew", "normal");
doc.text(`                  คณะวิศวกรรมศาสตร์ มหาวิทยาลัยมหาสารคาม โทรศัพท์ 043-754316  ภายใน 3007`,3,yy)
yy+=0.7;
doc.setFont("THSarabunNew", "bold");
doc.text(`ที่`,3,yy);
doc.setFont("THSarabunNew", "normal");
doc.text(`    อว 0605.14/..........`,3,yy)
doc.setFont("THSarabunNew", "bold");
doc.text(`วันที่`,pageWidth/2,yy);
doc.setFont("THSarabunNew", "normal");
doc.text(`      ${document.getElementById("thai-datepicker7").value}`,pageWidth/2,yy)
 yy+=0.7;
 doc.setFont("THSarabunNew", "bold");
doc.text(`เรื่อง`,3,yy);
doc.setFont("THSarabunNew", "normal");
doc.text(`        ขออนุมัติเบิกเงินค่าลงทะเเบียน`,3,yy)
yy+=1;
doc.setFont("THSarabunNew", "bold");
doc.text(`เรียน`,3,yy);
doc.setFont("THSarabunNew", "normal");
doc.text(`        ${document.getElementById("dear_re").value}`,3,yy)
yy+=1;

const sValue = document.getElementById("s").value.replace(/,/g, '');

// ...existing // ...existing code...
const nb = `ตามหนังสือที่ ${document.getElementById("rebd2").value} ลงวันที่ ${document.getElementById("thai-datepicker8").value} เรื่อง ขออนุมัติเดินทางไปราชการ เพื่อ ${document.querySelector('input[name="qqee"]:checked')?.value || ''} เรื่อง ${document.getElementById("subject_re").value} ณ ${document.getElementById("lo_re").value} ระหว่างวันที่ ${document.getElementById("thai-datepicker9").value} ถึงวันที่ ${document.getElementById("thai-datepicker10").value} บัดนี้ผู้เดินทางได้ดำเนินการชำระค่าลงทะเบียน เป็นที่เรียบร้อยแล้ว จึงขออนุมัติ เบิกค่าลงทะเบียน รวมเป็นเงิน ${document.getElementById("s").value} ตัวอักษร ( ${numberToThaiText(sValue)} )`;

// ตัดบรรทัดแรกที่ 16cm
const linesTemp = doc.splitTextToSize(nb, firstLineWidth);

const firstLine1 = linesTemp[0];

const remainingText1 = nb.substring(firstLine1.length).trim(); // ตัดช่องว่างหน้าออก

// ตัดข้อความส่วนที่เหลือด้วยความกว้าง 16
const remainingLines1 = doc.splitTextToSize(remainingText1, nextLinesWidth);

// รวมกัน
const allLines1 = [firstLine1, ...remainingLines1];

let lineY1 = yy;
allLines1.forEach((line, index) => {
  const x = index === 0 ? 5.5 : 3;
  doc.text(line, x, lineY1);
  lineY1 += 0.7;
});

yy = lineY1;
// ...existing code...
doc.text(`โดยเบิกค่าใช้จ่ายจากเงินงบประมาณรายได้คณะวิศวกรรมศาสตร์ปี......................`,3,yy);

yy += 0.7;
doc.text(`แผนงานที่1  ขยายโอกาสและพัฒนาการศึกษา`,3,yy);
yy += 0.7;
doc.text(`ผลผลิตที่1 ผู้สำเร็จการศึกษาด้านวิทยาศาสตร์และเทคโนโลยี`,3,yy);
yy += 0.7;
doc.text(`หมวด.........................`,3,yy);
yy += 0.7;
doc.text(`รหัสงบ.......................`,3,yy);
yy+=1;
doc.text(`จึงเรียนมาเพื่อโปรดพิจารณาการอนุมัติเบิกจ่ายเงิน`,3,yy);
yy += 1.7;



doc.text(text1, centerX, yy, { align: 'center' });
yy += 0.7;

doc.text(text2_1, centerX-0.3, yy, { align: 'center' });
yy += 0.7;

doc.text(text3_1, centerX-0.3, yy, { align: 'center' });
yy += 0.7;

doc.text(text4_1, centerX-0.3, yy, { align: 'center' });
yy += 0.7;

















const pdfBlob = doc.output("blob");
const blobUrl = URL.createObjectURL(pdfBlob);
window.open(blobUrl, "_blank");











    // doc.save("รายงานการเดินทางไปราชการ.pdf");



}

function numberToThaiText(number) {
  const numberText = ["ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];
  const positionText = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];

  if (isNaN(number)) return "ศูนย์บาทถ้วน";

  let [integerPart, decimalPart] = Number(number).toFixed(2).split(".");
  let bahtText = "";

  function convert(num) {
    let result = "";
    let len = num.length;

    for (let i = 0; i < len; i++) {
      const digit = parseInt(num.charAt(i));
      const pos = len - i - 1;

      if (digit === 0) continue;

      if (pos === 1 && digit === 1) {
        result += "สิบ";
      } else if (pos === 1 && digit === 2) {
        result += "ยี่สิบ";
      } else if (pos === 1) {
        result += numberText[digit] + "สิบ";
      } else if (pos === 0 && digit === 1 && len > 1) {
        result += "เอ็ด";
      } else {
        result += numberText[digit] + positionText[pos];
      }
    }
    return result;
  }

  // รองรับจำนวนหลักล้านขึ้นไป
  let segments = [];
  while (integerPart.length > 0) {
    segments.unshift(integerPart.slice(-6));
    integerPart = integerPart.slice(0, -6);
  }

  segments.forEach((seg, index) => {
    seg = parseInt(seg).toString(); // ลบ 0 ข้างหน้า
    if (seg !== "0") {
      bahtText += convert(seg);
      if (index < segments.length - 1) {
        bahtText += "ล้าน";
      }
    }
  });

  bahtText += "บาท";

  if (decimalPart === "00") {
    bahtText += "ถ้วน";
  } else {
    bahtText += convert(decimalPart) + "สตางค์";
  }

  return bahtText;
}
