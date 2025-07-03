let call = 1;

function addrow() {
  call++;
  const container = document.getElementById("re_cost");
  const div = document.createElement("div");
  div.className = "t_re_cost";
  const container1 = document.getElementById("gw_re");
  const div1 = document.createElement("div");
  div1.className = "gwd_re";
  // เปลี่ยน id ให้มีเลขต่อท้ายเพื่อแยกแต่ละแถว
  div1.innerHTML = `
    <div class="wrq_re1" style="width: 30%;">
        <input id="n_re_${call}" type="text" placeholder="ชื่อ-นามสกุล">
    </div>
    <div class="wrq_re2" style="width: 30%;">
        <input type="text" id="p_re_${call}" placeholder="ตำแหน่ง">
    </div>
    <div class="wrq_re3" style="width: 30%;">
        <input type="text" id="t_re_${call}"  placeholder="สังกัด" value="คณะวิศวกรรมศาสตร์ มหาวิทยาลัยมหาสารคาม">
    </div>
  `;
  container1.appendChild(div1);

  div.innerHTML = `
    <div style="padding: 1%; padding-top: 0%;">
    <input type="text" id="name_re_${call}" placeholder="ชื่อ-นามสกุล"></div>
    <div style="padding: 1%; padding-top: 0%;  width: 15%;">
    <input id="position_re_${call}" type="text"></div>
    <div style="width: 10%; padding-top: 0%;">
    <input class="allowance_p2 comma-number" id="allowance_p2_${call}" type="text"></div>
    <div style="width: 10%; padding-top: 0%;">
    <input class="accommodation_p2 comma-number" id="accommodation_p2_${call}" type="text"></div>
    <div style="width: 10%; padding-top: 0%;">
    <input class="vehicles_p2 comma-number" id="vehicles_p2_${call}" type="text"></div>
    <div style="width: 10%; padding-top: 0%;">
    <input class="other_p2 comma-number" id="other_p2_${call}" type="text"></div>
    <div style="width: 10%; padding-top: 0%;">
    <input class="total_p2 comma-number" id="total_p2_${call}" type="text" readonly></div>
    <input class="total_p_1 comma-number" id="total_p_${call}" type="text" readonly style="display: none;">
  `;
  container.appendChild(div);

  // --- เพิ่มการ sync ข้อมูลข้าม input ---
  // ชื่อ-นามสกุล
  const input1 = document.getElementById(`name_re_${call}`);
  const input2 = document.getElementById(`n_re_${call}`);
  if (input1 && input2) {
    input1.addEventListener('input', () => {
      input2.value = input1.value;
    });
    input2.addEventListener('input', () => {
      input1.value = input2.value;
    });
  }
  // ตำแหน่ง
  const pos1 = document.getElementById(`position_re_${call}`);
  const pos2 = document.getElementById(`p_re_${call}`);
  if (pos1 && pos2) {
    pos1.addEventListener('input', () => {
      pos2.value = pos1.value;
    });
    pos2.addEventListener('input', () => {
      pos1.value = pos2.value;
    });
  }
  // สังกัด
  const dep1 = document.getElementById(`t_re_${call}`);
  const dep2 = document.getElementById(`t_re_${call}`); // ถ้ามีอีก input ให้แก้ id ตรงนี้
  // ถ้าต้องการ sync สังกัดข้าม div เพิ่ม logic ตรงนี้

  div.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", updatecall);
  });
  updatecall();
  return false;
}

function removerow() {
    if (call > 1) { // ไม่ให้ลบแถวแรก
      const container1 = document.getElementById("gw_re");
      container1.removeChild(container1.lastElementChild);      
      const container = document.getElementById("re_cost");
      container.removeChild(container.lastElementChild);
      call--;
    }
    updatecall();
}

function parseNumber(val) {
    if (!val) return 0;
    return parseFloat(val.replace(/,/g, '')) || 0;
}

function updatecall() {
  // ดึงข้อมูล input ทั้งหมดในแต่ละ class ใหม่ทุกครั้ง
  const allowance_p2 = document.querySelectorAll(".allowance_p2");
  const accommodation_p2 = document.querySelectorAll(".accommodation_p2");
  const vehicles_p2 = document.querySelectorAll(".vehicles_p2");
  const other_p2 = document.querySelectorAll(".other_p2");
  const total_p2 = document.querySelectorAll(".total_p2");
  const total_p_1 = document.querySelectorAll(".total_p_1");

  for (let i = 0; i < allowance_p2.length; i++) {
    const price_allowance_p2 = parseNumber(allowance_p2[i].value) || 0;
    const count_accommodation_p2 = parseNumber(accommodation_p2[i].value) || 0;
    const day_vehicles_p2 = parseNumber(vehicles_p2[i].value) || 0;
    const price_other_p2 = parseNumber(other_p2[i].value) || 0;

    // คำนวณรวมเฉพาะแถวนี้
    const rowTotal = price_allowance_p2 + count_accommodation_p2 + day_vehicles_p2 + price_other_p2;
    const cs = price_allowance_p2 + count_accommodation_p2 + day_vehicles_p2 + price_other_p2;

    // แสดงผลในช่องรวมของแถวนี้ (พร้อม comma)
    total_p2[i].value = rowTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    total_p_1[i].value = cs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  thisResultGran();
  thisResult1();
  thisResult2();
  thisResult3();
  thisResult4();
  updateSummaryInputs();
}
document.getElementById("allowance_p2_1").addEventListener('input',updatecall);
document.getElementById("accommodation_p2_1").addEventListener('input',updatecall);
document.getElementById("vehicles_p2_1").addEventListener('input',updatecall);
document.getElementById("Registration_p2_1").addEventListener('input',updatecall);
document.getElementById("other_p2_1").addEventListener('input',updatecall);

function thisResultGran() {
  const inputs = document.querySelectorAll('.total_p_1');
  let total = 0;
  inputs.forEach(input => {
    const value = parseFloat(input.value.replace(/,/g, ''));
    if (!isNaN(value)) {
      total += value;
    }
  });
  document.getElementById("thisResultGran").textContent = total.toLocaleString();
  window.this = total;
  return total;
}
function thisResult1() {
  const inputs = document.querySelectorAll('.allowance_p2');
  let total = 0;
  inputs.forEach(input => {
    const value = parseFloat(input.value.replace(/,/g, ''));
    if (!isNaN(value)) {
      total += value;
    }
  });
  document.getElementById("thisResult1").textContent = total.toLocaleString();
  return total;
}
function thisResult2() {
  const inputs = document.querySelectorAll('.accommodation_p2');
  let total = 0;
  inputs.forEach(input => {
    const value = parseFloat(input.value.replace(/,/g, ''));
    if (!isNaN(value)) {
      total += value;
    }
  });
  document.getElementById("thisResult2").textContent = total.toLocaleString();
  return total;
}
function thisResult3() {
  const inputs = document.querySelectorAll('.vehicles_p2');
  let total = 0;
  inputs.forEach(input => {
    const value = parseFloat(input.value.replace(/,/g, ''));
    if (!isNaN(value)) {
      total += value;
    }
  });
  document.getElementById("thisResult3").textContent = total.toLocaleString();
  return total;
}
function thisResult4() {
  const inputs = document.querySelectorAll('.other_p2');
  let total = 0;
  inputs.forEach(input => {
    const value = parseFloat(input.value.replace(/,/g, ''));
    if (!isNaN(value)) {
      total += value;
    }
  });
  document.getElementById("thisResult4").textContent = total.toLocaleString();
  return total;
}
/* เพิ่้ม ลด แถวค่าที่พัก */
let real_accommodationRow = 1;

function addRealAccommodationRow() {
  real_accommodationRow++;
  const container = document.getElementById("Real_accommodation");
  const div = document.createElement("div");
  div.classList.add("Real_accommodation_1");

  div.innerHTML = `
    <div class="left_part">
        <input class="real_accommodation_cost comma-number" id="real_accommodation_cost_${real_accommodationRow}" type="text" placeholder="ค่าที่พัก" oninput="grandTotal()">
        <input class="real_accommodation_person " id="real_accommodation_person_${real_accommodationRow}" type="number" placeholder="จำนวนคน" oninput="grandTotal()">
        <input class="real_accommodation_day " id="real_accommodation_day_${real_accommodationRow}" type="number" placeholder="จำนวนวัน" oninput="grandTotal()">
        <button class="add-btn" onclick="removeRealAccommodationeRow(this)" style="text-align: center; margin: 0; background-color: red;">&minus;</button>
    </div> 
  `;
  
  container.appendChild(div);

  // เพิ่ม event listener ให้ input ในแถวใหม่ (สำคัญมาก!)
  div.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", updateRealAccommodationTotal);
  });

  // เรียก update รวมทันทีหลังเพิ่มแถวใหม่
  updateRealAccommodationTotal();
  return false;
}

function removeRealAccommodationeRow(button) {
  const containerAcc = button.closest(".Real_accommodation_1");
  if (containerAcc) {
    containerAcc.remove();
    real_accommodationRow--;
  }
  updateRealAccommodationTotal();
  grandTotal();
}

/* เพิ่มลบแถว ค่าลงทะเบียน */
let Real_OtherRow= 1;

function R_addOtherLine() {
  Real_OtherRow++;
  const container = document.getElementById("R_other_detail");
  const div = document.createElement("div");
    div.classList.add("r_other");

  div.innerHTML = `
    <div class="R_other_cost" style ="display:flex; margin-bottom:0.5%;">
      <div style = "margin-right:1%;width:38%;">
        <input class="R_other_detail" name="R_other_detail_${Real_OtherRow}" type="text" placeholder="รายละเอียดค่าใช้จ่ายอื่น" style = "margin: 0 ; width:96%;">
      </div>  
      <div style = "margin-right:1%; width:20%">
        <input class="R_other_costs comma-number" name="R_other_costs" type="text" placeholder="จำนวนเงิน" oninput="updateRealOthercostTotal()" style = "margin: 0 ; width:94%;">
      </div>  
        <button class="remove-btn" onclick="R_removeOtherLine(this)" style="text-align: center; margin: 0 ; background-color:red;">&minus;</button>
      
    </div> 
  `;
  container.appendChild(div);
  updateRealOthercostTotal();
  return false;
}
function R_removeOtherLine(button) {
  const containerAcc = button.closest(".r_other");
  if (containerAcc) {
    containerAcc.remove();
    Real_OtherRow--;
  }
  updateRealOthercostTotal();
  grandTotal();
}


/* แสดงเมือเรือกรถราชการ */
const R_checkbox = document.getElementById('R_reign_car');
const R_inputDiv = document.getElementById('R_detail_car');

R_checkbox.addEventListener('change', function() {
  if (this.checked) {
    R_inputDiv.style.display = 'grid';
    } else {
      R_inputDiv.style.display = 'none';
    }
    });
    
const R2_checkbox = document.getElementById('R_personal_car');
R2_checkbox.addEventListener('change', function() {
  if (this.checked) {
    R_inputDiv.style.display = 'grid';
    } else {
      R_inputDiv.style.display = 'none';
    }
    });

/* คำนวนหน้า2 */

const Real_GrandTotal_Allowance_Cost = document.getElementById("Real_GrandTotal_Allowance_Cost");
let R_AllowanceTotal1 = 0;
let R_AllowanceTotal2 = 0;
function calculateRealAllowance () {
  const real_allowance_cost_1 =  parseNumber(document.getElementById("real_allowance_cost_1").value) || 0;
  const real_NumberOfPersons_1 =  parseNumber(document.getElementById("real_NumberOfPersons_1").value) || 0;
  const real_NumberOfDate_1 =  parseNumber(document.getElementById("real_NumberOfDate_1").value) || 0;
  const real_allowance_cost_2 =  parseNumber(document.getElementById("real_allowance_cost_2").value) || 0;
  const real_NumberOfPersons_2 =  parseNumber(document.getElementById("real_NumberOfPersons_2").value) || 0;
  const real_NumberOfDate_2 =  parseNumber(document.getElementById("real_NumberOfDate_2").value) || 0;

  R_AllowanceTotal1 = (real_allowance_cost_1*real_NumberOfPersons_1*real_NumberOfDate_1);
  R_AllowanceTotal2 = (real_allowance_cost_2*real_NumberOfPersons_2*real_NumberOfDate_2);
  Real_GrandTotal_Allowance_Cost.textContent = (R_AllowanceTotal1+R_AllowanceTotal2).toLocaleString();

  let total = Real_GrandTotal_Allowance_Cost;
  grandTotal();
  return total;
}
['real_allowance_cost_1', 'real_NumberOfPersons_1', 'real_NumberOfDate_1',
 'real_allowance_cost_2', 'real_NumberOfPersons_2', 'real_NumberOfDate_2'
].forEach(id => {
    document.getElementById(id).addEventListener('input', calculateRealAllowance);
});



function updateRealAccommodationTotal() {
  let totalAcc = 0;

  // ต้อง query ใหม่ทุกครั้ง เพื่อรองรับ row ใหม่ที่เพิ่มมา
  const prices_accommodation = document.querySelectorAll(".real_accommodation_cost");
  const counts_accommodation = document.querySelectorAll(".real_accommodation_person");
  const days_accommodation = document.querySelectorAll(".real_accommodation_day");

  for (let i = 0; i < prices_accommodation.length; i++) {
    const price_accommodation_ = parseNumber(prices_accommodation[i].value) || 0;
    const count_accommodation = parseNumber(counts_accommodation[i].value) || 0;
    const day_accommodation = parseNumber(days_accommodation[i].value) || 0;

    totalAcc += price_accommodation_ * count_accommodation * day_accommodation;
  }

  document.getElementById("Real_GrandTotal_Accommodation_Cost").textContent = totalAcc.toLocaleString();
  grandTotal();
  return totalAcc;
}

document.getElementById("real_accommodation_cost_1").addEventListener('input', updateRealAccommodationTotal);
document.getElementById("real_accommodation_person_1").addEventListener('input', updateRealAccommodationTotal);
document.getElementById("real_accommodation_day_1").addEventListener('input', updateRealAccommodationTotal);

function updateRealOthercostTotal() {
  const inputs = document.querySelectorAll('.R_other_costs');
  let total = 0;
  inputs.forEach(input => {
    const value = parseNumber(input.value); // ใช้ parseNumber เพื่อรองรับ comma และทศนิยม
    if (!isNaN(value)) {
      total += value;
    }
  });
  document.getElementById("R_other_cost_result").textContent = total.toLocaleString();
  window.other_cost = total;
  grandTotal();
  return total;
}

function grandTotal() {
  function parseNumber(id) {
    const el = document.getElementById(id);
    if (!el) return 0;
    const raw = el.textContent || "0"; // ใช้ textContent เพราะเป็น <span>
    return parseFloat(raw.replace(/,/g, '')) || 0;
  }

  const G_1 = parseNumber("Real_GrandTotal_Allowance_Cost");
  const G_2 = parseNumber("Real_GrandTotal_Accommodation_Cost");
  const G_3 = parseNumber("R_distance-cost_result");
  const G_4 = parseNumber("R_Transportation_expenses_result");
  const G_5 = parseNumber("reign_car4413_result");
  const G_6 = parseNumber("R_other_cost_result");

  const total = G_1 + G_2 + G_3 + G_4 + G_5 + G_6;
  document.getElementById("R_GrandTotal").textContent = total.toLocaleString();
  window.Grand = total;
  return total;
}

//function คำนวนเวลาที่ใช้ โดย อิงเวลา ไป กลับ
function convertThaiFullDateToISO(thaiFullDateStr) {
  const thaiMonths = {
    "มกราคม": "01", "กุมภาพันธ์": "02", "มีนาคม": "03", "เมษายน": "04",
    "พฤษภาคม": "05", "มิถุนายน": "06", "กรกฎาคม": "07", "สิงหาคม": "08",
    "กันยายน": "09", "ตุลาคม": "10", "พฤศจิกายน": "11", "ธันวาคม": "12"
  };

  const parts = thaiFullDateStr.trim().split(" ");
  if (parts.length !== 3) return null;

  const [day, thaiMonth, yearBE] = parts;
  const month = thaiMonths[thaiMonth];
  const year = parseInt(yearBE) - 543;

  if (!day || !month || isNaN(year)) return null;

  return `${year}-${month}-${day.padStart(2, '0')}`;
}


function calculateDuration() {
  const startDateRaw = document.getElementById("thai-datepicker9").value;
  const startTime = document.getElementById("timepicker3").value;
  const endDateRaw = document.getElementById("thai-datepicker10").value;
  const endTime = document.getElementById("timepicker4").value;

  if (!startDateRaw || !startTime || !endDateRaw || !endTime) {
    document.getElementById("daysresult").textContent = "❗ กรุณากรอกวันและเวลาให้ครบ";
    return;
  }

  // แปลงวันที่ไทยเป็น ISO
const startDate = convertThaiFullDateToISO(startDateRaw);
const endDate = convertThaiFullDateToISO(endDateRaw);


  // ตรวจสอบการแปลงวันที่
  if (!startDate || !endDate) {
    document.getElementById("daysresult").textContent = "❗ รูปแบบวันที่ไม่ถูกต้อง (ควรเป็น ว/ด/ป)";
    return;
  }

  const startDateTime = new Date(`${startDate}T${startTime}`);
  const endDateTime = new Date(`${endDate}T${endTime}`);

  if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
    document.getElementById("daysresult").textContent = "❗ วันที่หรือเวลาไม่ถูกต้อง";
    return;
  }

  const diffMs = endDateTime - startDateTime;
  if (diffMs <= 0) {
    document.getElementById("daysresult").textContent = "❗ เวลาไปต้องมาก่อนเวลากลับ";
    return;
  }

  const totalMinutes = diffMs / (1000 * 60);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = Math.floor(totalMinutes % 60);

  document.getElementById("daysresult").textContent =
    `รวมเวลาไปราชการครั้งนี้ ${days} วัน ${hours} ชั่วโมง ${minutes} นาที`;
}



    
    let dateId = 1;

  function addDateSection() {
    const form_container1 = document.getElementById("form-container1");
    const div = document.createElement("div");
    div.id = `date-section-${dateId}`; // เพื่ออ้างอิงได้ง่าย
    div.innerHTML = `
      <div class="date-header">
        📅 วันที่: <input type="text" placeholder="ว/ด/ปี เช่น 16/พ.ค./68">
        <button onclick="addEntry(${dateId})">&plus; เพิ่มรายละเอียด</button>
        <button onclick="removeDateSection(${dateId})" style="margin-left: auto; background-color:rgb(223, 3, 3);">🗑 ลบวันที่</button>
      </div>
      <div class="entries" id="entries-${dateId}"></div>
    `;
    form_container1.appendChild(div);
    dateId++;
    return false;
  }

  // ฟังก์ชันคำนวณจำนวนเงินจากระยะทาง
// ...existing code...
function updateAmount(uniqueId) {
  const distanceInput = document.getElementById(`distance-${uniqueId}`);
  const amountInput = document.getElementById(`amount-${uniqueId}`);
  const multiplierCheckbox = document.getElementById(`multiplier-checkbox-${uniqueId}`);
  const distance = parseNumber(distanceInput.value);

  if (multiplierCheckbox && multiplierCheckbox.checked) {
    // ถ้าติ๊ก checkbox: คำนวณและ readonly
    amountInput.value = !isNaN(distance) ? (distance * 4).toFixed(2) : '';
    amountInput.readOnly = true;
  } else {
    // ไม่ติ๊ก: ให้กรอกเอง
    amountInput.readOnly = false;
  }

  calculateTotalAmount();
}
// ...existing code...

function addEntry(id) {
  const entriesDiv = document.getElementById(`entries-${id}`);
  const entry = document.createElement("div");
  const uniqueId = Date.now();

  entry.innerHTML = `
    <div style="margin-bottom:1%;">
      <label>
        <input 
          type="checkbox" 
          id="multiplier-checkbox-${uniqueId}" 
          onchange="updateAmount(${uniqueId})"
          style="margin-right:4px;"
        > รถยนต์ส่วนบุคคล × 4 บาท/กม.
      </label>
      <div style="display:grid; grid-template-columns: 60% 15.5% 15.5% 9%; align-items:center; ">
        <input type="text" placeholder="รายละเอียด เช่น เดินทางไปประชุมที่ อ.เมือง อุดรธานี..." style="margin:0; margin-right:1%;">
        <input 
          type="text" 
          id="distance-${uniqueId}"
          class="comma-number"
          placeholder="ระยะทาง (กม.)" 
          style="margin:0; margin-right:1%;" 
          oninput="updateAmount(${uniqueId})">
        <input 
          class="comma-number"
          type="text" 
          id="amount-${uniqueId}"
          placeholder="จำนวนเงิน (บาท)" 
          style="margin:0; margin-right:1%;"
          oninput="calculateTotalAmount()"
        >
        <button 
          class="remove-btn" 
          onclick="this.parentElement.parentElement.parentElement.remove(); calculateTotalAmount();" 
          style="background-color:rgb(223, 3, 3);margin:1%;">
          🗑
        </button>
      </div>
    </div>  
  `;

  entriesDiv.appendChild(entry);
}
// ...existing code...


document.addEventListener('DOMContentLoaded', function () {

const checkboxess = document.querySelectorAll('input[name="type"]');

checkboxess.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    const id = checkbox.dataset.id;
    const box = document.getElementById(id + '_box');

    if (checkbox.checked) {
      box.style.display = 'flex';
    } else {
      box.style.display = 'none';
      // เคลียร์ input ข้างใน
      const input = box.querySelectorAll('input');
      input.forEach(input => input.value = '');
      calculateTotal();
    }
  });
});

const totalDisplay = document.querySelector('#R_Transportation_expenses_result');
const totalPersonalCarDisplay = document.querySelector('#R_total_personal_car');
const totalReignCarDisplay = document.querySelector('#R_total_reign_car');

function parseNumber(val) {
    if (!val) return 0;
    return parseFloat(val.replace(/,/g, '')) || 0;
}

function calculateTotal() {
   const container = document.getElementById("container2");
    let total = 0;

    const personalCarInput = container.querySelector('#R_personal_car_box input.comma-number');
    const personalCarCheckbox = container.querySelector('#R_personal_car_box input[type="checkbox"]');
    let personalCarAmount = 0;
    if (personalCarInput) {
        let multiplier = 4;
        if (personalCarCheckbox && personalCarCheckbox.checked) {
            multiplier = 8; // *4*2
        }
        personalCarAmount = parseNumber(personalCarInput.value) * multiplier;
        total += personalCarAmount;
    }
    totalPersonalCarDisplay.textContent = personalCarAmount.toLocaleString();

    // รถยนต์ราชการ × 4 หรือ × 8 ถ้า checkbox
    const reignCarInput = container.querySelector('#R_reign_car_box input.comma-number');
    const reignCarCheckbox = container.querySelector('#R_reign_car_box input[type="checkbox"]');
    let reignCarAmount = 0;
    if (reignCarInput) {
        let multiplier = 4;
        if (reignCarCheckbox && reignCarCheckbox.checked) {
            multiplier = 8;
        }
        reignCarAmount = parseNumber(reignCarInput.value) * multiplier;
        total += reignCarAmount;
    }
    totalReignCarDisplay.textContent = reignCarAmount.toLocaleString();

    // input-box อื่นๆ (ไม่นับรถยนต์ส่วนบุคคล/ราชการ)
    const allBoxes = container.querySelectorAll('.input-box');
    allBoxes.forEach(box => {
        if (
            box.id === "R_personal_car_box" ||
            box.id === "R_reign_car_box"
        ) return;
        const numberInputs = box.querySelectorAll('input.comma-number');
        numberInputs.forEach(input => {
            const value = parseNumber(input.value);
            if (!isNaN(value)) {
                total += value;
            }
        });
    });

    totalDisplay.textContent = total.toLocaleString();
    grandTotal();
}

// ➤ ติดตามทุก input
const allInputs = document.querySelectorAll('.input-box input');
allInputs.forEach(input => {
    input.addEventListener('input', calculateTotal);
});

// เรียกคำนวณครั้งแรกเมื่อโหลดหน้า
calculateTotal();
grandTotal();
});

window.addEventListener('DOMContentLoaded', function () {
    // ดึงค่าจาก <p>
    const r1 = document.getElementById('thisResult1').textContent || '0';
    const r2 = document.getElementById('thisResult2').textContent || '0';
    const r3 = document.getElementById('thisResult3').textContent || '0';
    const r4 = document.getElementById('thisResult4').textContent || '0';
    const rGran = document.getElementById('thisResultGran').textContent || '0';

    // ใส่ค่าใน input
    document.getElementById('summary-allowance').value = r1;
    document.getElementById('summary-accommodation').value = r2;
    document.getElementById('summary-vehicle').value = r3;
    document.getElementById('summary-other').value = r4;
    document.getElementById('summary-total').value = rGran;
});

function updateSummaryInputs() {
    document.getElementById('summary-allowance').value = document.getElementById('thisResult1').textContent || '0';
    document.getElementById('summary-accommodation').value = document.getElementById('thisResult2').textContent || '0';
    document.getElementById('summary-vehicle').value = document.getElementById('thisResult3').textContent || '0';
    document.getElementById('summary-other').value = document.getElementById('thisResult4').textContent || '0';
    document.getElementById('summary-total').value = document.getElementById('thisResultGran').textContent || '0';
}

// ...existing code...


document.addEventListener('DOMContentLoaded', function() {
    // เลือก radio "อบรม/สัมมนา"
    const seminarRadio = document.querySelector('input[name="qqee"][value="อบรม/สัมมนา"]');
    // เลือก radio "เหมาจ่าย"
    const maoRadio = document.querySelector('input[name="radio_re"][value="เหมาจ่าย"]');

    // ฟังก์ชันสำหรับจัดการสถานะ disabled
    function handleSeminarChange() {
        if (seminarRadio.checked) {
            maoRadio.checked = false;
            maoRadio.disabled = true;
        } else {
            maoRadio.disabled = false;
        }
    }

    // เมื่อมีการเปลี่ยนแปลง radio group qqe
    document.querySelectorAll('input[name="qqee"]').forEach(radio => {
        radio.addEventListener('change', handleSeminarChange);
    });

    // เรียกครั้งแรกเพื่อ sync สถานะ
    handleSeminarChange();
});

function removeDateSection(id) {
  const section = document.getElementById(`date-section-${id}`);
  if (section) {
    section.remove();
  }
}

// Sum all amount-<uniqueId> fields and display the result
function calculateTotalAmount() {
  let total = 0;
  // Select all inputs whose id starts with 'amount-'
  const amountInputs = document.querySelectorAll('input[id^="amount-"]');
  amountInputs.forEach(input => {
    const value = parseFloat((input.value || '').replace(/,/g, ''));
    if (!isNaN(value)) {
      total += value;
    }
  });
  // Display the result in the element with id 'R_distance-cost_result'
  document.getElementById("k").textContent = total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const resultEl = document.getElementById('R_distance-cost_result');
  if (resultEl) {
    resultEl.textContent = total.toLocaleString();
  }
  grandTotal && grandTotal(); // update grand total if function exists
  return total;
}

entries.forEach((entry) => {
  const inputs = entry.querySelectorAll('input');
  console.log(inputs, Array.from(inputs).map(i => i.value));
  // ...rest of your code
});

