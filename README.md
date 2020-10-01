# Google Apps Script Development 💯

# Google sheet stock with app script (ระบบอัพเดตสต็อคสินค้า)

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)
[![Company Logo](https://github.com/ggafiled/googlesheet_appscript_project_list/blob/master/img/terra.jpg)](https://github.com/ggafiled)

ระบบเบิกและจัดสต็อคอุปกรณ์ในคลังบนแพทฟอร์ม google sheet และ app script โดยมีฟังก์ชันการใช้งานตามนี้ Version 1.0.0

  - สามารถแสดงหน้าต่างการใช้งานเมื่อเปิดเข้าไฟล์ได้
  - แชทบอทสำหรับสั่งเรียกใช้งานฟังก์ชันภายใน google app script เพื่อทำการค้นหาและแสดงสถานะงาน
  - ค้นหาและเลือกดูข้อมูลบน LIFF (LINE FRONTEND FRAMEWORK) [Demo](https://script.google.com/macros/s/AKfycbxtBUEiPCrWkepUJm0cmXfhqoM0IZqcXEixvSFs/exec?v=project-list)

ตัวอย่างคำที่จะค้นหา | Survey	| IFCC (ODF) |	Wall Box	| Micro Duct Vertical	| Micro Duct Horizontal
------------ | ------------- | ------------- | ------------- | ------------- | -------------
U&I Thonglor | ดำเนินการแล้วเสร็จ | ดำเนินการแล้วเสร็จ |  ดำเนินการแล้วเสร็จ |  ดำเนินการแล้วเสร็จ |  ดำเนินการแล้วเสร็จ 
Bel gravia | ดำเนินการแล้วเสร็จ |  ดำเนินการแล้วเสร็จ |  ดำเนินการแล้วเสร็จ |  ดำเนินการแล้วเสร็จ |  รอเข้าดำเนินนการ 
Topview | ดำเนินการแล้วเสร็จ |  ดำเนินการแล้วเสร็จ |  ดำเนินการแล้วเสร็จ |  ดำเนินการแล้วเสร็จ |  รอเข้าดำเนินนการ 
Fortune condo town 2 (ตึก 1-3) | ดำเนินการแล้วเสร็จ |  ดำเนินการแล้วเสร็จ |  ดำเนินการแล้วเสร็จ |  ดำเนินการแล้วเสร็จ | รอเข้าดำเนินนการ 

# How to use (วิธีการใช้งาน)
**1.** ทำการสร้างไฟล์งานบน google sheet และทำการนำเข้าไฟล์ที่ใช้สำหรับโปรเจ็คนี้
![Main Panel UI](https://github.com/ggafiled/googlesheet_appscript_project_list/blob/master/img/googlesheet_appscript_project_list_01.PNG)
ทั้งนี้ในไฟล์งานต้องมีชีทที่ชื่อว่า Progress ที่จะใช้สำหรับการค้นหาข้อมูลเพื่อนำมาแสดงผล]

**2.** ทำการสร้าง App Script Project ตามภาพ
![Expand](https://github.com/ggafiled/googlesheet_appscript_project_list/blob/master/img/expand-03.jpg)
จากนั้นให้ทำการตั้งค่า App Script Project ดังนี้
![Expand](https://github.com/ggafiled/googlesheet_appscript_project_list/blob/master/img/expand-04.jpg) 
และทำการคัดลอกลิงค์ URL เก็บไว้เพื่อรอใช้งานในขั้นตอนถัดไป

**3.** ทำการสร้าง Line bot จากหน้าบริการ [Line developers](https://developers.line.biz/en/) ทำการสร้าง Providers และ Create New Chanel (Messaging API) และทำการกรอกข้อมูลที่ระบบต้องการไป จนเสร็จกระบวนการ

**4.** ตั้งค่า Line bot โดยกดเข้าไปที่ Bot ที่เราต้องการตั้งค่า
<table>
  <tr>
    <td>เลือก Bot ที่ต้องการจะตั้งค่า</td>
  </tr>
  <tr>
    <td><img src="https://github.com/ggafiled/googlesheet_appscript_project_list/blob/master/img/expand-01.jpg"></td>
  </tr>
  <tr>
    <td>ที่เมนู Messaging API ให้ทำการเพิ่มลิงค์ Webhook URL โดยใช้ลิงค์ที่ได้จากขั้นตอนก่อนหน้ามาใส่และกดบันทึก ทำการเปิดใช้งานที่ปุ่ม Use webhook และเปิดให้บอทสามารถเข้ากลุ่มแชทได้ และปิดการส่งข้อความอัตโนมัติของทางไลน์ ขั้นตอนสุดท้ายกดรับ Channel access token เพื่อนำไปใช้งานในขั้นตอนถัดไป</td>
  </tr>
  <tr>
    <td><img src="https://github.com/ggafiled/googlesheet_appscript_project_list/blob/master/img/expand-02.jpg"></td>
  </tr>
 </table>

**5.** เปิดแอปพลิเคชันไลน์แล้วทำการเพิ่มเพื่อน Line Notify (สำหรับใช้บริการ Line Notify แจ้งเตือนสำหรับใช้ในอนาคต) และ Line bot ที่เราสร้างขึ้น (เพิ่มได้จาก Qr code ที่หน้า Line Developers/Messaging API)
![Expand](https://github.com/ggafiled/googlesheet_appscript_project_list/blob/master/img/expand-05.JPG)

**6.** ทำการสร้างกลุ่มสนทนาบนแพลตฟอร์ม Line Application จากนั้นให้ทำการเชิญ Line notify และ Line bot ที่ทำการสร้างไว้เข้ากลุ่ม 
<img src="https://github.com/ggafiled/googlesheet_appscript_project_list/blob/master/img/expand-06.jpg" alt="Terra Bot" width="480" height="480">

**7.** ทำการเพิ่ม Property เพื่อเก็บค่าที่จะใช้ภายในโปรเจ็ค ดังนี้

Property | ความหมาย | ค่าที่เก็บ	
-------- | -------- | --------
LINE_MESSAGE_REPLY_URL | ลิงค์สำหรับตอบกลับข้อความไปยังไลน์ | https://api.line.me/v2/bot/message/reply
LINE_NOTIFY_URL | ลิงค์สำหรับส่ง notify เข้ากลุ่ม | https://notify-api.line.me/api/notify
GOOGLE_SHEET_ID | ไอดีของชีท | นำมาจากลิงค์ที่หน้าโปรเจ็ค google sheet <img src="https://github.com/ggafiled/googlesheet_appscript_project_list/blob/master/img/expand-08.jpg">
LINE_NOTIFY_TOKEN | โทเคนของ Line notify | ใส่ค่าว่าง หรือ หากต้องการให้ทำการสร้างได้จาก [ลิงค์นี้](https://notify-bot.line.me/th/)
LINE_CHANEL_ACCESS_TOKEN | โทเคนสำหรับให้บอทใช้ส่งข้อความกลับไปยังกลุ่ม | ได้มาจากขั้นตอนที่  ``` 4. ```

**8.** ทำการโหลดไฟล์โค้ดนี้ลงเครื่อง ด้วยคำสั่ง 
```node
git clone https://github.com/ggafiled/googlesheet_appscript_project_list.git

// จากนั้นเข้าไปยังโฟลเดอร์โปรเจ็ค
cd googlesheet_appscript_project_list

// และติดตั้ง Library ที่จำเป็น
npm i -g @google/clasp 
npm i

// เสร็จขั้นตอนข้างบนแล้วให้ทำการ Login เข้า Account Google ของเราเพื่อให้สิทธิ์ในการอัพโค้ดขึ้นคลาว์
clasp login

// หลังจากนั้นเปิดการอนุญาตอัพโค้ดที่ลิงค์นี้
https://script.google.com/home/usersettings

```

**9.** ที่ไฟล์ ```html .clasp.json  ``` กรอกรหัสสคริปต์
หาได้จาก ![Expand](https://github.com/ggafiled/googlesheet_appscript_project_list/blob/master/img/expand-09.jpg)
```json5

{
    "scriptId": "นำรหัสสคริปต์ของโปรเจ็คเรามาใส่ตรงนี้",
    "rootDir": "./dist"
}

```

**10.** หลังจากตั้งค่าสิ่งที่ต้องการทั้งหมดแล้วให้ทำการอัพโค้ดขึ้น app script cloud ด้วยคำสั่ง
```node
npm run deploy:prod

```

# Overall 🍚🍣 (ตัวอย่างภาพรวม)
### ตัวอย่างข้อมูลที่จะทำการค้นหา
![Main Panel UI](https://github.com/ggafiled/googlesheet_appscript_project_list/blob/master/img/googlesheet_appscript_project_list_02.PNG)

### ตัวอย่างหน้าจอการใช้งานคำสั่ง Chatbot 
<img src="https://github.com/ggafiled/googlesheet_appscript_project_list/blob/master/img/terra-project-bot01.jpg" alt="Terra Bot" width="340" height="480">

### ตัวอย่างหน้าจอการใช้งาน LIFF
<img src="https://github.com/ggafiled/googlesheet_appscript_project_list/blob/master/img/expand-10.jpg" alt="Terra Bot">


# Copyright 🏛
Copyright (c)Ggafiled (Nattapol Krobklang):See [LICENSE](https://github.com/ggafiled/googlesheet_appscript_project_list/blob/master/LICENSE).
