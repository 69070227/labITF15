// ===== 1. จับ element จาก HTML มาเก็บไว้ในตัวแปร =====
const input_name = document.getElementById("input_name")   // ช่องพิมพ์ข้อความ
const btn_add = document.getElementById("btn_add")         // ปุ่ม "เพิ่ม"
const container = document.getElementById("container")     // <ul> ที่ใช้ใส่รายการทั้งหมด
 
// ===== 2. ตัวแปรที่ใช้ตลอดทั้งไฟล์ =====
let currentId = 0     // ตัวนับ ใช้ทำ id ให้แต่ละแถวไม่ซ้ำกัน (list-1, list-2, ...)
let name_list = []    // ลิสต์ที่จดข้อความทั้งหมดไว้ (ใช้เซฟลงเบราว์เซอร์)
 
// ===== 3. ฟังก์ชันสร้างรายการ 1 แถว =====
function createList(text){                        // text = ข้อความที่ผู้ใช้พิมพ์
    let li = document.createElement("li")         // สร้างแท็ก <li> เปล่าๆ
    li.id = "list-" + ++currentId                 // บวก currentId ขึ้น 1 แล้วตั้งเป็น id เช่น "list-1"
 
    let span = document.createElement("span")     // สร้างแท็ก <span> สำหรับใส่ข้อความ
    span.textContent = text                       // ใส่ข้อความลงใน span
 
    let button = document.createElement("button") // สร้างปุ่ม
    button.textContent = "ลบ"                     // เขียนบนปุ่มว่า "ลบ"
    // ตั้งให้ตอนคลิกปุ่ม ไปเรียก deleteList(id, 'ข้อความ')
    button.setAttribute("onclick", "deleteList(" + currentId + ",'" + text + "')")
 
    li.appendChild(span)                          // เอา span ใส่เข้าไปใน li
    li.appendChild(button)                        // เอาปุ่มใส่เข้าไปใน li
 
    return li                                     // ส่ง li ที่ประกอบเสร็จแล้วกลับไป
}
 
// ===== 4. ฟังก์ชันลบรายการ =====
function deleteList(id, text){
    let itemToDelete = document.getElementById("list-" + id)  // หา <li> ที่มี id ตรงกัน
    container.removeChild(itemToDelete)                       // ลบ li นั้นออกจากหน้าเว็บ
 
    let index = name_list.indexOf(text)           // หาตำแหน่งของข้อความนี้ในลิสต์ (ไม่เจอ = -1)
    if (index > -1){                              // ถ้าเจอ
        name_list.splice(index,1)                 // ลบข้อความนั้นออกจากลิสต์ 1 ตัว
    }
 
    updatestorage()                               // เซฟลิสต์ที่อัปเดตแล้วลงเบราว์เซอร์
}
 
// ===== 5. ฟังก์ชันเซฟลงเบราว์เซอร์ =====
function updatestorage(){
    let arr_to_text = JSON.stringify(name_list)    // แปลงลิสต์เป็นข้อความ (localStorage เก็บได้แต่ข้อความ)
    localStorage.setItem("name_list", arr_to_text) // เก็บลงเบราว์เซอร์ ชื่อกล่อง "name_list" (ต้องตรงกับตอนโหลด)
}
 
// ===== 6. ตอนคลิกปุ่ม "เพิ่ม" =====
btn_add.addEventListener("click", ()=>{           // รอให้มีคนคลิกปุ่ม แล้วทำสิ่งในปีกกา
    if (input_name.value.trim() == ""){           // ถ้าช่องพิมพ์ว่าง (trim = ตัดช่องว่างหัวท้าย)
        alert("กรุณาใส่ข้อความ")                   // เด้งเตือน
    } else{                                       // ถ้ามีข้อความ
        let new_li = createList(input_name.value) // สร้างแถวใหม่จากข้อความที่พิมพ์
        container.appendChild(new_li)             // เอาแถวใหม่ไปแปะใน <ul> (โผล่บนหน้าเว็บ)
        name_list.push(input_name.value)          // จดข้อความลงท้ายลิสต์
        updatestorage()                           // เซฟลงเบราว์เซอร์
        input_name.value = ""                     // ล้างช่องพิมพ์ให้ว่าง (ไม่มี () นะ)
    }
})
 
// ===== 7. ตอนเปิดหน้าเว็บ ให้โหลดรายการที่เซฟไว้กลับมา =====
window.onload = () => {                           // ทำงานตอนหน้าเว็บโหลดเสร็จ
    let data = localStorage.getItem("name_list")  // ดึงข้อความที่เซฟไว้ (ถ้าไม่เคยเซฟจะได้ null)
    let arr = []                                  // ลิสต์ที่จะเอามาสร้างแถว
 
    if (data != null){                            // ถ้าเคยเซฟไว้
        arr = JSON.parse(data)                    // แปลงข้อความกลับเป็นลิสต์
    }
 
    if (arr.length == 0){                         // ถ้าไม่มีอะไรเลย (เปิดครั้งแรก หรือเซฟค้างเป็นลิสต์ว่าง)
        arr = ["learn", "play roblox", "draw smt", "sleep"]   // ใช้รายการเริ่มต้น
    }
 
    arr.forEach((i) => {                          // วนทีละตัวในลิสต์
        let new_li = createList(i)                // สร้างแถว (ชื่อฟังก์ชันต้องเป็น createList)
        container.appendChild(new_li)             // แปะลงหน้าเว็บ
        name_list.push(i)                         // จดลง name_list ด้วย
    })
 
    updatestorage()                               // เซฟ
}
