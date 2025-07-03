async function generateDOCX() {
  // Import required components from docx library
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    AlignmentType,
    Table,
    TableRow,
    TableCell,
    WidthType,
    PageBreak
  } = docx;

  // Get form data
  const agency = document.getElementById("agency").value;
  const bookNum = document.getElementById("bookNum").value;
  const datepicker1 = document.getElementById("thai-datepicker1").value;
  const topic = document.getElementById("topic").value;
  const dear = document.getElementById("dear").value;
  const requesting_name = document.getElementById("requesting_name").value;
  const requesting_position = document.getElementById("requesting_position").value;
  const requesting_part = document.getElementById("requesting_part").value;
  const project = document.getElementById("project").value;
  const at = document.getElementById("at").value;
  const thai_datepicker2 = document.getElementById("thai-datepicker2").value;
  const thai_datepicker3 = document.getElementById("thai-datepicker3").value;
  const thai_datepicker4 = document.getElementById("thai-datepicker4").value;
  const thai_datepicker5 = document.getElementById("thai-datepicker5").value;

  const accommodationTotal = window.accommodationTotal || 0;
  const vehicles_cost = window.vehicles_cost || 0;
  const Registration_fee = window.Registration_fee || 0;
  const other_cost = window.other_cost || 0;
  const all_cost = window.all_cost || 0;

  function numberToThaiText(number) {
    const numberText = ["ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];
    const positionText = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];

    if (isNaN(number)) return "ไม่ใช่ตัวเลข";

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

    let segments = [];
    while (integerPart.length > 0) {
      segments.unshift(integerPart.slice(-6));
      integerPart = integerPart.slice(0, -6);
    }

    segments.forEach((seg, index) => {
      seg = parseInt(seg).toString();
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

  // Create document content
  const children = [
    // Header
    new Paragraph({
      children: [
        new TextRun({
          text: "บันทึกข้อความ",
          bold: true,
          size: 52,
          font: "TH Sarabun New",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),

    // Agency
    new Paragraph({
      children: [
        new TextRun({
          text: "ส่วนราชการ",
          bold: true,
          size: 32,
          font: "TH Sarabun New",
        }),
        new TextRun({
          text: ` ${agency}`,
          size: 32,
          font: "TH Sarabun New",
        }),
      ],
      spacing: { after: 200 },
    }),

    // Document number and date
    new Paragraph({
      children: [
        new TextRun({
          text: "ที่",
          bold: true,
          size: 32,
          font: "TH Sarabun New",
        }),
        new TextRun({
          text: ` ${bookNum}`,
          size: 32,
          font: "TH Sarabun New",
        }),
        new TextRun({
          text: "    วันที่",
          bold: true,
          size: 32,
          font: "TH Sarabun New",
        }),
        new TextRun({
          text: ` ${datepicker1}`,
          size: 32,
          font: "TH Sarabun New",
        }),
      ],
      spacing: { after: 200 },
    }),

    // Topic
    new Paragraph({
      children: [
        new TextRun({
          text: "เรื่อง",
          bold: true,
          size: 32,
          font: "TH Sarabun New",
        }),
        new TextRun({
          text: ` ${topic}`,
          size: 32,
          font: "TH Sarabun New",
        }),
      ],
      spacing: { after: 200 },
    }),

    // Dear
    new Paragraph({
      children: [
        new TextRun({
          text: "เรียน",
          bold: true,
          size: 32,
          font: "TH Sarabun New",
        }),
        new TextRun({
          text: ` ${dear}`,
          size: 32,
          font: "TH Sarabun New",
        }),
      ],
      spacing: { after: 400 },
    }),

    // Main content
    new Paragraph({
      children: [
        new TextRun({
          text: `ด้วยข้าพเจ้า ${requesting_name} ตำแหน่ง${requesting_position} สังกัด${requesting_part} ประสงค์ขออนุญาตเดินทางไปราชการเพื่อ ${document.querySelector('input[name="qqe"]:checked')?.value || ''} เรื่อง${project} ณ ${at} ในวันที่ ${thai_datepicker2} ถึงวันที่ ${thai_datepicker3} ดังเอกสารแนบต้นเรื่อง(ถ้ามี) และขออนุมัติเดินทางในวันที่ ${thai_datepicker4} และเดินทางกลับวันที่ ${thai_datepicker5} พร้อมประมาณการค่าใช้จ่ายในการเดินทางไปราชการดังนี้`,
          size: 32,
          font: "TH Sarabun New",
        }),
      ],
      spacing: { after: 400 },
    }),

    // Allowance
    new Paragraph({
      children: [
        new TextRun({
          text: "1. ค่าเบี้ยเลี้ยง",
          size: 32,
          font: "TH Sarabun New",
        }),
      ],
      alignment: AlignmentType.LEFT,
      spacing: { after: 200 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: `รวมเป็นเงิน ${accommodationTotal.toLocaleString()} บาท`,
          size: 32,
          font: "TH Sarabun New",
        }),
      ],
      alignment: AlignmentType.RIGHT,
      spacing: { after: 200 },
    }),

    // Accommodation
    new Paragraph({
      children: [
        new TextRun({
          text: `2. ค่าที่พัก ${document.querySelector('input[name="fav_language"]:checked')?.value || ''}`,
          size: 32,
          font: "TH Sarabun New",
        }),
      ],
      alignment: AlignmentType.LEFT,
      spacing: { after: 200 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: `รวมเป็นเงิน ${document.getElementById("result_2").textContent} บาท`,
          size: 32,
          font: "TH Sarabun New",
        }),
      ],
      alignment: AlignmentType.RIGHT,
      spacing: { after: 200 },
    }),

    // Transportation
    new Paragraph({
      children: [
        new TextRun({
          text: "3. ค่าพาหนะ",
          size: 32,
          font: "TH Sarabun New",
        }),
      ],
      alignment: AlignmentType.LEFT,
      spacing: { after: 200 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: `รวมเป็นเงิน ${document.getElementById("Transportation_expenses_result").textContent.trim() || "0"} บาท`,
          size: 32,
          font: "TH Sarabun New",
        }),
      ],
      alignment: AlignmentType.RIGHT,
      spacing: { after: 200 },
    }),

    // Registration fee
    new Paragraph({
      children: [
        new TextRun({
          text: "4. ค่าลงทะเบียน",
          size: 32,
          font: "TH Sarabun New",
        }),
      ],
      alignment: AlignmentType.LEFT,
      spacing: { after: 200 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: `รวมเป็นเงิน ${Registration_fee.toLocaleString()} บาท`,
          size: 32,
          font: "TH Sarabun New",
        }),
      ],
      alignment: AlignmentType.RIGHT,
      spacing: { after: 200 },
    }),

    // Other expenses
    new Paragraph({
      children: [
        new TextRun({
          text: "5. ค่าใช้จ่ายอื่นๆที่จำเป็นในการเดินทางไปราชการ",
          size: 32,
          font: "TH Sarabun New",
        }),
      ],
      alignment: AlignmentType.LEFT,
      spacing: { after: 200 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: `รวมเป็นเงิน ${other_cost.toLocaleString()} บาท`,
          size: 32,
          font: "TH Sarabun New",
        }),
      ],
      alignment: AlignmentType.RIGHT,
      spacing: { after: 200 },
    }),

    // Total
    new Paragraph({
      children: [
        new TextRun({
          text: `รวมค่าใช้จ่ายเป็นเงินประมาณ ${all_cost.toLocaleString()} บาท`,
          size: 32,
          font: "TH Sarabun New",
        }),
      ],
      alignment: AlignmentType.RIGHT,
      spacing: { after: 200 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: `(${numberToThaiText(all_cost)})`,
          size: 32,
          font: "TH Sarabun New",
        }),
      ],
      alignment: AlignmentType.RIGHT,
      spacing: { after: 400 },
    }),

    // Request consideration
    new Paragraph({
      children: [
        new TextRun({
          text: "จึงเรียนมาเพื่อโปรดพิจารณา",
          size: 32,
          font: "TH Sarabun New",
        }),
      ],
      spacing: { after: 600 },
    }),

    // Signature
    new Paragraph({
      children: [
        new TextRun({
          text: "ลงชื่อ...............................................ผู้ขอรับเงิน",
          size: 32,
          font: "TH Sarabun New",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: requesting_name,
          size: 32,
          font: "TH Sarabun New",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: requesting_position,
          size: 32,
          font: "TH Sarabun New",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),

    // Financial section
    new Paragraph({
      children: [
        new TextRun({
          text: "ความเห็นงานการเงินโดยเบิกจ่ายจาก (  )เงินงบประมาณแผ่นดิน (  )งบประมาณเงินรายได้ (  )เงินรับฝาก",
          size: 32,
          font: "TH Sarabun New",
        }),
      ],
      spacing: { after: 200 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: `หมวดรายจ่าย..............................รหัสงบประมาณ..............................จำนวนเงิน ${document.getElementById("GrandTotal").textContent} บาท`,
          size: 32,
          font: "TH Sarabun New",
        }),
      ],
      spacing: { after: 200 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: `จำนวนเงิน(ตัวอักษร) ${numberToThaiText(all_cost)}`,
          size: 32,
          font: "TH Sarabun New",
        }),
      ],
      spacing: { after: 200 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: "ความคิดเห็นจาก งานการเงินบัญชี/งานบุคคลฯ/หัวหน้ากลุมงานฯ......................................................................",
          size: 32,
          font: "TH Sarabun New",
        }),
      ],
      spacing: { after: 200 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: "ความเห็นจาก หัวหน้าสำนักงานเลขานุการฯ........................................................................................................",
          size: 32,
          font: "TH Sarabun New",
        }),
      ],
      spacing: { after: 200 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: "ความเห็นจาก หัวหน้าสำนักวิชาฯ/หัวหน้าส่วนงานฯ............................................................................................",
          size: 32,
          font: "TH Sarabun New",
        }),
      ],
      spacing: { after: 200 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: "ความเห็นจาก รองคณบดีคณะวิศวกรรมศาสตร์ ฝ่ายบริหารฯ..............................................................................",
          size: 32,
          font: "TH Sarabun New",
        }),
      ],
      spacing: { after: 200 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: "ความเห็นจาก คณบดีคณะวิศวกรรมศาสตร์  (  )อนุมัติ     (  )ไม่อนุมัติ",
          size: 32,
          font: "TH Sarabun New",
        }),
      ],
      spacing: { after: 400 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: "ลงชื่อ..............................................ผู้อนุมัติ",
          size: 32,
          font: "TH Sarabun New",
        }),
      ],
      alignment: AlignmentType.RIGHT,
      spacing: { after: 200 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: "(..............................................)",
          size: 32,
          font: "TH Sarabun New",
        }),
      ],
      alignment: AlignmentType.RIGHT,
      spacing: { after: 200 },
    }),
  ];

  // Add travel companions table if needed
  const entryCount1 = document.querySelectorAll(".entry12").length;
  if (entryCount1 > 1) {
    children.push(new PageBreak());
    
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "รายชื่อผู้ร่วมเดินทาง",
            bold: true,
            size: 52,
            font: "TH Sarabun New",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    );

    const entries = document.querySelectorAll(".entry12");
    const tableRows = [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "ชื่อ-นามสกุล", bold: true, size: 32, font: "TH Sarabun New" })] })],
            width: { size: 4000, type: WidthType.DXA },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "ตำแหน่ง", bold: true, size: 32, font: "TH Sarabun New" })] })],
            width: { size: 4000, type: WidthType.DXA },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "หน่วยงาน", bold: true, size: 32, font: "TH Sarabun New" })] })],
            width: { size: 4000, type: WidthType.DXA },
          }),
        ],
      }),
    ];

    entries.forEach(entry => {
      const name = entry.querySelector("input[name^='name_']").value;
      const pos = entry.querySelector("input[name^='position_']").value;
      const dept = entry.querySelector("input[name^='department_']").value;
      
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: name, size: 32, font: "TH Sarabun New" })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: pos, size: 32, font: "TH Sarabun New" })] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: dept, size: 32, font: "TH Sarabun New" })] })],
            }),
          ],
        })
      );
    });

    children.push(
      new Table({
        rows: tableRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
      })
    );
  }

  // Create document
  const doc = new Document({
    sections: [{
      properties: {},
      children: children,
    }],
  });

  // Generate and download the document
  try {
    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'เอกสารขออนุมัติเดินทางไปราชการ.docx';
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating DOCX:', error);
    alert('เกิดข้อผิดพลาดในการสร้างไฟล์ DOCX');
  }
} 