/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WhistleblowingCase } from './types';

export const INITIAL_CASES: WhistleblowingCase[] = [
  {
    id: "WB-2026-0412",
    type: "wage",
    businessName: "โรงงานสิ่งทอ เจริญกิจ",
    location: "เขตประเวศ กรุงเทพมหานคร",
    gps: "13.7201, 100.6542",
    evidenceUrl: "payroll_sheet_june.pdf",
    evidenceType: "document",
    details: "จ่ายค่าจ้างต่ำกว่าอัตราขั้นต่ำ (วันละ 250 บาท) และไม่มีการจ่ายค่าล่วงเวลา (OT) เมื่อทำงานเกิน 8 ชั่วโมงต่อวัน บังคับลงชื่อในเอกสารรับเงินเต็มจำนวน",
    identity: "anonymous",
    status: "closed",
    priority: "high",
    createdAt: "2026-06-15T09:00:00Z",
    secretCode: "PASS123",
    timeline: [
      {
        status: "received",
        title: "รับเรื่องเข้าระบบ",
        description: "ระบบได้รับเรื่องแจ้งเบาะแสการเอาเปรียบเรื่องค่าจ้างและลงทะเบียนข้อมูลเรียบร้อยแล้ว",
        timestamp: "15 มิ.ย. 2026, 09:00 น.",
        isCompleted: true
      },
      {
        status: "investigating",
        title: "อยู่ระหว่างการตรวจสอบ",
        description: "ส่งพนักงานตรวจแรงงานลงพื้นที่สืบข้อเท็จจริง ตรวจสอบบัญชีจ่ายค่าจ้าง และเรียกนายจ้างมาสอบปากคำ",
        timestamp: "17 มิ.ย. 2026, 14:30 น.",
        isCompleted: true
      },
      {
        status: "action_taken",
        title: "ดำเนินการทางกฎหมาย",
        description: "ออกคำสั่งให้นายจ้างจ่ายเงินค่าจ้างย้อนหลังรวมถึงค่าโอทีค้างจ่ายทั้งหมดให้แก่แรงงานจำนวน 45 คน",
        timestamp: "22 มิ.ย. 2026, 11:00 น.",
        isCompleted: true
      },
      {
        status: "closed",
        title: "ปิดเคสสำเร็จ",
        description: "นายจ้างปฏิบัติตามคำสั่งและโอนเงินครบถ้วน แกนนำแรงงานยืนยันได้รับเงินแล้วเสร็จ",
        timestamp: "28 มิ.ย. 2026, 16:15 น.",
        isCompleted: true
      }
    ]
  },
  {
    id: "WB-2026-0501",
    type: "forced_labor",
    businessName: "เรือประมง โชคอนันต์วารี 9",
    location: "ท่าเทียบเรือสมุทรสาคร",
    gps: "13.5412, 100.2734",
    evidenceUrl: "boat_log_photo.jpg",
    evidenceType: "photo",
    details: "บังคับทำงานบนเรือประมงวันละ 18 ชั่วโมง ยึดบัตรประจำตัวประชาชนและบัตรชมพูของแรงงานต่างด้าว ไม่ให้ออกนอกบริเวณท่าเรือ มีการข่มขู่ทำร้ายร่างกายหากปฏิเสธการออกเรือ",
    identity: "confidential",
    status: "investigating",
    priority: "high",
    createdAt: "2026-06-28T02:15:00Z",
    secretCode: "SAFE999",
    timeline: [
      {
        status: "received",
        title: "รับเรื่องเข้าระบบเร่งด่วน",
        description: "ระบบคัดกรองจัดให้เป็นเคสที่มีความเร่งด่วนสูง (High Priority - บังคับใช้แรงงานกักขังหน่วงเหนี่ยว)",
        timestamp: "28 มิ.ย. 2026, 02:15 น.",
        isCompleted: true
      },
      {
        status: "investigating",
        title: "ประสานงานชุดเฉพาะกิจ",
        description: "ประสานงานร่วมกับตำรวจน้ำและเจ้าหน้าที่พัฒนาสังคมและความมั่นคงของมนุษย์ (พม.) เพื่อวางแผนเข้าช่วยเหลือ",
        timestamp: "29 มิ.ย. 2026, 10:00 น.",
        isCompleted: true
      },
      {
        status: "action_taken",
        title: "รอการดำเนินงานถัดไป",
        description: "อยู่ระหว่างรวบรวมหลักฐานพิกัดเรือแน่ชัดเพื่อบุกตรวจค้นกลางทะเล",
        timestamp: "-",
        isCompleted: false
      },
      {
        status: "closed",
        title: "ปิดเคส",
        description: "ยังไม่ถึงขั้นตอนปิดเคส",
        timestamp: "-",
        isCompleted: false
      }
    ]
  },
  {
    id: "WB-2026-0505",
    type: "safety",
    businessName: "โครงการก่อสร้าง คอนโด แกรนด์ วิลล์",
    location: "ถ.พระราม 9 เขตห้วยขวาง",
    gps: "13.7533, 100.5649",
    evidenceUrl: "scaffolding_no_net.mp4",
    evidenceType: "video",
    details: "นั่งร้านชั้น 12-15 ไม่มีตาข่ายกันตก ฝุ่นละอองฟุ้งกระจาย และไม่มีการแจกอุปกรณ์นิรภัย (หมวกเซฟตี้, เข็มขัดกันตก) ให้แก่คนงานระดับปฏิบัติการ ทำงานในสภาวะเสี่ยงอันตรายต่อชีวิตอย่างยิ่ง",
    identity: "anonymous",
    status: "action_taken",
    priority: "medium",
    createdAt: "2026-06-30T13:45:00Z",
    secretCode: "WORK888",
    timeline: [
      {
        status: "received",
        title: "รับเรื่องเข้าระบบ",
        description: "ระบบรับเบาะแสความปลอดภัยในการทำงาน และลงทะเบียนผู้แจ้งเรียบร้อย",
        timestamp: "30 มิ.ย. 2026, 13:45 น.",
        isCompleted: true
      },
      {
        status: "investigating",
        title: "ตรวจสอบสถานที่เกิดเหตุ",
        description: "เจ้าหน้าที่ตรวจความปลอดภัยลงพื้นที่ตรวจไซด์งานก่อสร้าง พบการฝ่าฝืนจริงตามข้อร้องเรียน",
        timestamp: "01 ก.ค. 2026, 09:30 น.",
        isCompleted: true
      },
      {
        status: "action_taken",
        title: "ออกคำสั่งปรับปรุงด่วน",
        description: "ออกหนังสือคำสั่งระงับงานก่อสร้างบริเวณส่วนที่ไม่มีระบบป้องกันภัยชั่วคราว จนกว่าจะติดตั้งนั่งร้านและระบบ Safety ครบถ้วน",
        timestamp: "01 ก.ค. 2026, 15:00 น.",
        isCompleted: true
      },
      {
        status: "closed",
        title: "ปิดเคส",
        description: "อยู่ระหว่างการติดตามว่าผู้รับเหมาปรับปรุงระบบความปลอดภัยครบถ้วนตามกำหนดเวลาหรือไม่",
        timestamp: "-",
        isCompleted: false
      }
    ]
  },
  {
    id: "WB-2026-0508",
    type: "child_labor",
    businessName: "ร้านขายส่งสินค้าอะไหล่ยนต์ สหมิตร",
    location: "ตลาดน้อย แขวงสัมพันธวงศ์",
    gps: "13.7339, 100.5135",
    evidenceUrl: null,
    evidenceType: null,
    details: "มีการจ้างแรงงานเด็กอายุเพียง 12-13 ปี จำนวน 3 คน มายกของหนักเกิน 20 กิโลกรัม ทำงานวันละ 10 ชั่วโมง ไม่ได้รับสิทธิ์หยุดเรียนตามสิทธิขั้นพื้นฐานของเด็ก",
    identity: "confidential",
    status: "received",
    priority: "high",
    createdAt: "2026-07-01T17:20:00Z",
    secretCode: "KIDSAFE7",
    timeline: [
      {
        status: "received",
        title: "รับเรื่องเข้าระบบส่งตรวจสอบด่วน",
        description: "รับเรื่องแจ้งเบาะแสแรงงานเด็กอายุต่ำกว่าเกณฑ์ ส่งเรื่องต่อกองคุ้มครองแรงงานเด็กและสตรีทันที",
        timestamp: "01 ก.ค. 2026, 17:20 น.",
        isCompleted: true
      },
      {
        status: "investigating",
        title: "วางแผนสืบพฤติการณ์",
        description: "ประสานหน่วยงานท้องถิ่นเพื่อลงพื้นที่สืบสวนหาข้อมูลเชิงลึกเรื่องอายุและตารางการทำงานของเยาวชนกลุ่มดังกล่าว",
        timestamp: "-",
        isCompleted: false
      },
      {
        status: "action_taken",
        title: "รอการช่วยเหลือ",
        description: "-",
        timestamp: "-",
        isCompleted: false
      },
      {
        status: "closed",
        title: "ปิดเคส",
        description: "-",
        timestamp: "-",
        isCompleted: false
      }
    ]
  }
];
