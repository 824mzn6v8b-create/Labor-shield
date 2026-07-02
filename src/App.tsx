/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  MapPin, 
  Upload, 
  UserX, 
  UserCheck, 
  FileText, 
  Video, 
  Image as ImageIcon, 
  ChevronRight, 
  Search, 
  Lock, 
  Settings, 
  Activity, 
  Trash2, 
  AlertCircle, 
  Eye, 
  Map,
  BadgeAlert,
  ClipboardList,
  Building,
  CheckCircle2,
  Calendar,
  KeyRound,
  ArrowRight,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { WhistleblowingCase, CaseType, CaseStatus, CasePriority, TimelineEvent } from './types';
import { INITIAL_CASES } from './initialData';
import MapMockup from './components/MapMockup';

export default function App() {
  // Navigation & Page State
  // 1 = Landing, 2 = Form, 3 = Track Status, 4 = Admin Dashboard
  const [activeTab, setActiveTab] = useState<number>(1);
  
  // Whistleblowing Cases Database State
  const [cases, setCases] = useState<WhistleblowingCase[]>([]);
  
  // Form State
  const [reportType, setReportType] = useState<CaseType>('wage');
  const [businessName, setBusinessName] = useState<string>('');
  const [gpsLocation, setGpsLocation] = useState<string>('13.5412, 100.2734');
  const [locationName, setLocationName] = useState<string>('ท่าเทียบเรือสมุทรสาคร');
  const [evidenceType, setEvidenceType] = useState<'photo' | 'video' | 'document' | null>('photo');
  const [evidenceFile, setEvidenceFile] = useState<string>('paycheck_stub.jpg');
  const [details, setDetails] = useState<string>('');
  const [identity, setIdentity] = useState<'anonymous' | 'confidential'>('anonymous');
  
  // Confidential contact info
  const [reporterName, setReporterName] = useState<string>('');
  const [reporterPhone, setReporterPhone] = useState<string>('');

  // Status Tracking Screen States
  const [trackIdInput, setTrackIdInput] = useState<string>('');
  const [trackCodeInput, setTrackCodeInput] = useState<string>('');
  const [foundCase, setFoundCase] = useState<WhistleblowingCase | null>(null);
  const [trackError, setTrackError] = useState<string>('');

  // Admin Filter States
  const [adminSearch, setAdminSearch] = useState<string>('');
  const [adminPriorityFilter, setAdminPriorityFilter] = useState<string>('all');
  const [adminTypeFilter, setAdminTypeFilter] = useState<string>('all');

  // Success Submission Modal State
  const [submittedCase, setSubmittedCase] = useState<WhistleblowingCase | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  // Initialize and Load Data from LocalStorage if exists
  useEffect(() => {
    const savedCases = localStorage.getItem('labor_whistleblowing_cases');
    if (savedCases) {
      try {
        setCases(JSON.parse(savedCases));
      } catch (e) {
        setCases(INITIAL_CASES);
      }
    } else {
      setCases(INITIAL_CASES);
      localStorage.setItem('labor_whistleblowing_cases', JSON.stringify(INITIAL_CASES));
    }
  }, []);

  // Sync state to LocalStorage
  const syncCasesToLocalStorage = (updatedCases: WhistleblowingCase[]) => {
    setCases(updatedCases);
    localStorage.setItem('labor_whistleblowing_cases', JSON.stringify(updatedCases));
  };

  // Quick navigation helpers to comply with "หน้าแรกให้ไปหน้าที่ 2 ให้ทำเหมือนกันทุกๆ หน้า"
  const handleNextPageSequence = () => {
    if (activeTab === 1) {
      setActiveTab(2);
    } else if (activeTab === 2) {
      setActiveTab(3);
    } else if (activeTab === 3) {
      setActiveTab(4);
    } else if (activeTab === 4) {
      setActiveTab(1);
    }
  };

  // Submit a new Whistleblowing Report
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !details.trim()) {
      alert('กรุณากรอกข้อมูลชื่อสถานประกอบการและรายละเอียดพฤติการณ์ให้ครบถ้วน');
      return;
    }

    // Generate random WB ID and Secret Code
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `WB-2026-${randomNum}`;
    const generatedSecret = `SEC-${Math.floor(100 + Math.random() * 900)}`;

    const currentThaiTime = new Date().toLocaleString('th-TH', { 
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newCase: WhistleblowingCase = {
      id: newId,
      type: reportType,
      businessName: businessName.trim(),
      location: locationName,
      gps: gpsLocation,
      evidenceUrl: evidenceFile || null,
      evidenceType: evidenceType,
      details: details.trim(),
      identity: identity,
      status: 'received',
      priority: reportType === 'forced_labor' || reportType === 'child_labor' ? 'high' : 'medium',
      createdAt: new Date().toISOString(),
      secretCode: generatedSecret,
      timeline: [
        {
          status: 'received',
          title: 'รับเรื่องเข้าระบบสำเร็จ',
          description: `ระบบรับเบาะแสการแจ้งเกี่ยวกับ [${getReportTypeLabel(reportType)}] ได้รับการยืนยัน รหัสคดีความปลอดภัย`,
          timestamp: `${currentThaiTime} น.`,
          isCompleted: true
        },
        {
          status: 'investigating',
          title: 'เตรียมการตรวจสอบข้อเท็จจริง',
          description: 'อยู่ระหว่างพิจารณามอบหมายเจ้าหน้าที่ตรวจความปลอดภัย/แรงงานลงพื้นที่สืบค้นข้อมูล',
          timestamp: '-',
          isCompleted: false
        },
        {
          status: 'action_taken',
          title: 'ดำเนินมาตรการทางกฎหมาย',
          description: 'ออกคำสั่งและบังคับใช้สิทธิตามพ.ร.บ. คุ้มครองแรงงาน',
          timestamp: '-',
          isCompleted: false
        },
        {
          status: 'closed',
          title: 'ปิดคำร้องเรียนเสร็จสิ้น',
          description: 'พนักงานเจ้าหน้าที่ตรวจสอบพบการแก้ไขปรับปรุง และเยียวยาผู้เสียหายแล้วเสร็จ',
          timestamp: '-',
          isCompleted: false
        }
      ]
    };

    const updated = [newCase, ...cases];
    syncCasesToLocalStorage(updated);

    // Save submitted info to show user the credentials
    setSubmittedCase(newCase);
    setShowSuccessModal(true);

    // Auto populate tracking page input
    setTrackIdInput(newId);
    setTrackCodeInput(generatedSecret);

    // Reset Form Fields
    setBusinessName('');
    setDetails('');
    setReporterName('');
    setReporterPhone('');
  };

  // Search case tracking ID
  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError('');
    setFoundCase(null);

    if (!trackIdInput.trim() || !trackCodeInput.trim()) {
      setTrackError('กรุณากรอกรหัสติดตามเคส และรหัสผ่านลับให้ครบถ้วน');
      return;
    }

    const target = cases.find(
      c => c.id.toUpperCase() === trackIdInput.trim().toUpperCase() && 
           c.secretCode.toUpperCase() === trackCodeInput.trim().toUpperCase()
    );

    if (target) {
      setFoundCase(target);
    } else {
      setTrackError('ไม่พบข้อมูลเคส หรือรหัสลับไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง');
    }
  };

  // Fast-track from history listing click
  const triggerFastTrack = (caseId: string, secretCode: string) => {
    setTrackIdInput(caseId);
    setTrackCodeInput(secretCode);
    setActiveTab(3); // Switch to Page 3

    // Execute lookup automatically
    const target = cases.find(c => c.id === caseId && c.secretCode === secretCode);
    if (target) {
      setFoundCase(target);
      setTrackError('');
    }
  };

  // Admin action: Change status of a case
  const updateCaseStatus = (caseId: string, nextStatus: CaseStatus) => {
    const currentThaiTime = new Date().toLocaleString('th-TH', { 
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const updated = cases.map(c => {
      if (c.id === caseId) {
        // Prepare updated timeline where the target status and preceding statuses are marked as completed
        const updatedTimeline = c.timeline.map(t => {
          if (t.status === nextStatus) {
            return {
              ...t,
              isCompleted: true,
              timestamp: `${currentThaiTime} น.`,
              description: getStatusTimelineDescription(nextStatus, c.businessName)
            };
          }
          // Mark as complete if it's prior in the chain
          if (getStatusOrder(t.status) <= getStatusOrder(nextStatus)) {
            return {
              ...t,
              isCompleted: true,
              timestamp: t.timestamp === '-' ? `${currentThaiTime} น.` : t.timestamp
            };
          }
          // Reset further down the line if downgraded
          return {
            ...t,
            isCompleted: false,
            timestamp: '-'
          };
        });

        const updatedCase = {
          ...c,
          status: nextStatus,
          timeline: updatedTimeline
        };

        // If the case currently highlighted on page 3 is this case, sync its details immediately!
        if (foundCase && foundCase.id === caseId) {
          setFoundCase(updatedCase);
        }

        return updatedCase;
      }
      return c;
    });

    syncCasesToLocalStorage(updated);
  };

  // Admin action: Change priority of a case
  const updateCasePriority = (caseId: string, nextPriority: CasePriority) => {
    const updated = cases.map(c => {
      if (c.id === caseId) {
        const updatedCase = { ...c, priority: nextPriority };
        if (foundCase && foundCase.id === caseId) {
          setFoundCase(updatedCase);
        }
        return updatedCase;
      }
      return c;
    });
    syncCasesToLocalStorage(updated);
  };

  // Admin action: Delete/Archive a case
  const deleteCase = (caseId: string) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ที่จะลบเคสรายงานหมายเลข ${caseId}?`)) {
      const updated = cases.filter(c => c.id !== caseId);
      syncCasesToLocalStorage(updated);
      if (foundCase && foundCase.id === caseId) {
        setFoundCase(null);
      }
    }
  };

  // Helper values to map database statuses to order indices
  const getStatusOrder = (status: CaseStatus): number => {
    switch(status) {
      case 'received': return 1;
      case 'investigating': return 2;
      case 'action_taken': return 3;
      case 'closed': return 4;
    }
  };

  const getStatusTimelineDescription = (status: CaseStatus, bizName: string): string => {
    switch(status) {
      case 'received':
        return `รับเรื่องเข้าระบบสำเร็จอย่างเป็นทางการ และได้รับมอบหมายหมายเลขอ้างอิงคดี`;
      case 'investigating':
        return `ส่งพนักงานตรวจแรงงานประสานหน่วยงานคุ้มครองความปลอดภัยลงพื้นที่ตรวจตราอาคาร/พฤติกรรมการจ้างงาน ณ ${bizName} พบข้อพิรุธจริง`;
      case 'action_taken':
        return `สั่งการลงโทษทางวินัย มีคำสั่งชี้ขาดบังคับให้นายจ้างเยียวยาจ่ายเงินและปรับปรุงสภาพการทำงานให้มีความปลอดภัยสูงสุด`;
      case 'closed':
        return `ตัวแทนแรงงานได้รับสิทธิประโยชน์และค่าชดเชยที่พึงได้ทั้งหมด สภาพความปลอดภัยได้รับการลงบันทึกรับรองปิดแฟ้มคดีสำเร็จ`;
    }
  };

  // Thai text formatting helpers
  function getReportTypeLabel(type: CaseType): string {
    switch (type) {
      case 'wage': return 'ค่าจ้างและผลประโยชน์ (Wage)';
      case 'forced_labor': return 'การบังคับใช้แรงงาน (Forced Labor)';
      case 'safety': return 'ความปลอดภัยในการทำงาน (Safety)';
      case 'child_labor': return 'การใช้แรงงานเด็ก (Child Labor)';
    }
  }

  function getReportTypeBadgeColor(type: CaseType): string {
    switch (type) {
      case 'wage': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'forced_labor': return 'bg-red-50 text-red-700 border-red-200';
      case 'safety': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'child_labor': return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  }

  function getStatusBadge(status: CaseStatus) {
    switch (status) {
      case 'received':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">● รับเรื่องแล้ว</span>;
      case 'investigating':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">● กำลังตรวจสอบ</span>;
      case 'action_taken':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">● ดำเนินการแล้ว</span>;
      case 'closed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">✔ ปิดเคสสำเร็จ</span>;
    }
  }

  function getPriorityBadge(priority: CasePriority) {
    switch (priority) {
      case 'high':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800 border border-red-200 font-sans">ด่วนที่สุด (High)</span>;
      case 'medium':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200 font-sans">ปานกลาง (Medium)</span>;
      case 'low':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 font-sans">ปกติ (Low)</span>;
    }
  }

  // Derive current statistical values
  const totalSimulatedCases = 1520 + cases.filter(c => c.id.startsWith('WB-2026') && c.id !== 'WB-2026-0412' && c.id !== 'WB-2026-0501' && c.id !== 'WB-2026-0505' && c.id !== 'WB-2026-0508').length;
  const inProgressCasesCount = cases.filter(c => c.status === 'investigating' || c.status === 'action_taken').length;
  const closedCasesCount = cases.filter(c => c.status === 'closed').length;

  // Filtered cases for Admin
  const filteredCases = cases.filter(c => {
    const matchesSearch = c.businessName.toLowerCase().includes(adminSearch.toLowerCase()) || 
                          c.id.toLowerCase().includes(adminSearch.toLowerCase()) ||
                          c.location.toLowerCase().includes(adminSearch.toLowerCase());
    const matchesPriority = adminPriorityFilter === 'all' ? true : c.priority === adminPriorityFilter;
    const matchesType = adminTypeFilter === 'all' ? true : c.type === adminTypeFilter;
    return matchesSearch && matchesPriority && matchesType;
  });

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col antialiased selection:bg-orange-500 selection:text-white">
      
      {/* HEADER SECTION (Top Navigation with responsive tabs) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo and Brand Title */}
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-2.5 rounded-xl text-white shadow-md flex items-center justify-center font-bold text-xl">
                L
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-base sm:text-lg tracking-tight text-slate-900 uppercase">
                  LABOR SHIELD
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-orange-500 uppercase tracking-widest font-mono">
                  Labor Whistleblowing System
                </span>
              </div>
            </div>

            {/* Platform Quick Action: Next Step Sequencer */}
            <div className="hidden md:flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-sans px-2">ทดสอบปุ่มนำทางด่วน:</span>
              <button
                id="next-step-sequence-btn"
                onClick={handleNextPageSequence}
                className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1 transition-all"
                title="คลิกเพื่อกระโดดข้ามจำลองหน้าถัดไปแบบเรียงลำดับ"
              >
                หน้า {activeTab} <ArrowRight className="w-3 h-3 text-orange-500" /> หน้า {activeTab === 4 ? 1 : activeTab + 1}
              </button>
            </div>
          </div>

          {/* Module Tab Switcher - styled after the flowchart image */}
          <div className="flex items-center overflow-x-auto scrollbar-none gap-2.5 pb-3 mt-1 -mx-2 px-2">
            {[
              { id: 1, label: 'หน้าแรก', labelEn: 'LANDING PAGE', icon: ClipboardList },
              { id: 2, label: 'ระบบแจ้งเรื่อง', labelEn: 'WHISTLEBLOWING FORM', icon: ShieldAlert },
              { id: 3, label: 'ระบบติดตามสถานะ', labelEn: 'TRACK STATUS', icon: Activity },
              { id: 4, label: 'ระบบจัดการหลังบ้าน', labelEn: 'ADMIN DASHBOARD', icon: Settings },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[140px] text-left py-2.5 px-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <TabIcon className={`w-4 h-4 shrink-0 ${isActive ? 'text-orange-500' : 'text-slate-500'}`} />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold font-sans tracking-tight">
                        {tab.label}
                      </span>
                      <span className={`text-[8.5px] font-mono tracking-wider font-bold ${isActive ? 'text-orange-400' : 'text-slate-400'}`}>
                        {tab.labelEn}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </header>

      {/* DYNAMIC PROGRESS STEPPER FOR SEQUENTIAL USER FLOW */}
      <div className="bg-orange-500/10 border-b border-orange-500/20 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 text-xs text-orange-950">
          <div className="flex items-center gap-2 font-semibold">
            <span className="bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shadow-sm">i</span>
            <span>แนะนำลำดับการใช้งาน: แจ้งเรื่อง (หน้า 2) → คัดลอกรหัสอ้างอิง → ค้นหาสถานะ (หน้า 3) → ปรับสถานะในแดชบอร์ด (หน้า 4)</span>
          </div>
          <button 
            id="flow-step-btn"
            onClick={handleNextPageSequence}
            className="self-start sm:self-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer shrink-0 text-xs shadow-sm"
          >
            <span>กดข้ามไปหน้าถัดไป ({activeTab} ➜ {activeTab === 4 ? 1 : activeTab + 1})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* CORE APPLICATION VIEWS WITH BEAUTIFUL TRANSITION EFFECTS */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          
          {/* ==================== MODULE 1: LANDING PAGE ==================== */}
          {activeTab === 1 && (
            <motion.div
              key="landing-page"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
              id="module-landing"
            >
              {/* Feature Hero Section */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl -z-10 -translate-y-12 translate-x-12" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-100/30 rounded-full blur-2xl -z-10 translate-y-12 -translate-x-12" />
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Left Column Text details */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      เปิดใช้งานระบบแจ้งความปลอดภัยแรงงานดิจิทัล
                    </div>
                    
                    <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 leading-tight tracking-tight">
                      ระบบแจ้งเบาะแส<br className="hidden sm:inline" />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-slate-900">
                        การเอาเปรียบแรงงานและความปลอดภัย
                      </span>
                    </h1>
                    
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                      ช่วยปกป้องสิทธิ คุ้มครองผู้ถูกเอาเปรียบเรื่องค่าจ้าง การกดขี่ข่มเหงแรงงานต่างด้าว 
                      เยาวชน และสภาพแวดล้อมที่เป็นอันตราย ส่งเรื่องอย่างปลอดภัย ไม่ต้องเปิดเผยตัวตนจริง 
                      มีระบบติดตามสถานะรวดเร็วโดยพนักงานเจ้าหน้าที่
                    </p>

                    {/* Integrated Statistics Row */}
                    <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-center">
                      <div>
                        <span className="block text-xl sm:text-3xl font-extrabold text-orange-500 font-mono tracking-tight">
                          {totalSimulatedCases}
                        </span>
                        <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wide">เคสสะสมทั้งหมด</span>
                      </div>
                      <div>
                        <span className="block text-xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                          95%
                        </span>
                        <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wide">ช่วยปิดเคสสำเร็จ</span>
                      </div>
                      <div>
                        <span className="block text-xl sm:text-3xl font-extrabold text-orange-600 font-mono tracking-tight">
                          95%
                        </span>
                        <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wide">แก้ไขได้ทันที</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <button
                        id="landing-report-immediately-btn"
                        onClick={() => setActiveTab(2)}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-4 rounded-2xl text-center shadow-lg hover:shadow-xl hover:shadow-orange-500/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <ShieldAlert className="w-5 h-5" />
                        <span>แจ้งเบาะแสทันที (Report Immediately)</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <button
                        id="landing-track-status-btn"
                        onClick={() => setActiveTab(3)}
                        className="bg-white hover:bg-slate-50 text-slate-800 font-bold px-6 py-4 rounded-2xl text-center border border-slate-200 hover:border-slate-300 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Search className="w-4 h-4 text-orange-500" />
                        <span>ค้นหาและติดตามสถานะเคส</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column illustration mockup */}
                  <div className="lg:col-span-5 flex justify-center">
                    <div className="relative w-full max-w-[320px]">
                      {/* Decorative elements resembling flowchart image */}
                      <div className="absolute -top-4 -left-4 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-xl shadow-md animate-bounce text-white font-bold">
                        ⚠️
                      </div>
                      <div className="absolute -bottom-4 -right-4 bg-slate-900 text-white p-3 rounded-2xl shadow-lg flex items-center gap-1.5 text-[10px] font-bold border border-slate-800">
                        <CheckCircle className="w-4 h-4 text-orange-500" /> ปลอดภัย 100%
                      </div>

                      {/* Main graphic container */}
                      <div className="bg-slate-100 rounded-3xl border-4 border-white shadow-xl overflow-hidden aspect-square flex flex-col justify-between p-6 relative">
                        {/* Graphical representation of standard labor protection shield */}
                        <div className="flex justify-between items-start">
                          <span className="text-2xl">🇹🇭</span>
                          <span className="bg-orange-100 text-orange-800 text-[9px] font-mono font-bold px-2.5 py-1 rounded-full border border-orange-200">
                            OFFICIAL SYSTEM
                          </span>
                        </div>
                        
                        <div className="my-auto flex flex-col items-center text-center space-y-3">
                          <div className="bg-orange-50 p-4 rounded-full text-orange-500 animate-pulse border border-orange-100">
                            <ShieldAlert className="w-12 h-12" />
                          </div>
                          <span className="text-xs font-bold text-slate-800 bg-white px-3 py-1 rounded-full shadow-xs border border-slate-200">
                            หยุดความเหลื่อมล้ำทางแรงงาน
                          </span>
                        </div>

                        <div className="w-full bg-slate-900 text-white py-2 px-3 rounded-xl text-center text-[10px] font-bold uppercase tracking-wider font-mono">
                          Anti-exploitation Portal
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Unique Features Icons List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4">
                  <div className="bg-orange-50 text-orange-500 p-3 rounded-2xl shrink-0 border border-orange-100">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">ความปลอดภัยสูงสุด (High Security)</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      ไม่มีการเก็บข้อมูลบัตรประชาชนหรือข้อมูลติดต่อหากท่านเลือกแบบไม่เปิดเผยตัวตน (Anonymous) ข้อมูลของท่านจะถูกกรองเป็นความลับสุดยอด
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4">
                  <div className="bg-orange-50 text-orange-500 p-3 rounded-2xl shrink-0 border border-orange-100">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">ติดตามง่ายแบบเรียลไทม์ (Easy Tracking)</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      หลังส่งเรื่องท่านจะได้รับรหัสติดตามตัวเลขพิเศษ สามารถตรวจสอบขั้นตอนดำเนินการของกระทรวงและเจ้าหน้าที่ตำรวจได้ตลอด 24 ชั่วโมง
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4">
                  <div className="bg-orange-50 text-orange-500 p-3 rounded-2xl shrink-0 border border-orange-100">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">เข้าถึงได้ทุกคน (Access for All)</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      รองรับการแปลความและช่วยเหลือคนงานทุกสัญชาติ ไม่ว่าจะเป็นแรงงานไทย เมียนมา กัมพูชา หรือลาว มุ่งมั่นสร้างความเป็นธรรมในทุกกลุ่ม
                    </p>
                  </div>
                </div>
              </div>

              {/* LANDING PAGE HISTORY ("หน้าประวัติ") - as requested */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <ClipboardList className="w-5 h-5 text-orange-500" />
                      ประวัติและรายการแจ้งเบาะแสล่าสุดในระบบ
                    </h2>
                    <p className="text-xs text-slate-500">
                      รายการเบาะแสที่ประชาชนรายงานเข้าระบบ (แสดงข้อมูลสาธารณะโดยปกปิดข้อมูลส่วนบุคคล)
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-semibold">
                    <Clock className="w-3.5 h-3.5 text-orange-500" />
                    อัปเดตข้อมูลล่าสุดเมื่อสักครู่
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cases.map((item) => (
                    <div 
                      key={item.id} 
                      className="border border-slate-200 rounded-2xl p-5 hover:border-orange-400 hover:shadow-md transition-all space-y-3 bg-slate-50/50"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {item.id}
                        </span>
                        <div className="flex gap-1.5">
                          {getPriorityBadge(item.priority)}
                          {getStatusBadge(item.status)}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className={`inline-block text-[10.5px] font-semibold px-2 py-0.5 rounded border ${getReportTypeBadgeColor(item.type)}`}>
                          {getReportTypeLabel(item.type)}
                        </span>
                        <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5 mt-1">
                          <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {item.businessName}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                          {item.location}
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 italic bg-white p-2.5 rounded border border-slate-100">
                        "{item.details}"
                      </p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {new Date(item.createdAt).toLocaleDateString('th-TH', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        
                        {/* BUTTON TO AUTOFILL AND TRACK STATUS ON SCREEN 3 */}
                        <button
                          id={`landing-fast-track-${item.id}`}
                          onClick={() => triggerFastTrack(item.id, item.secretCode)}
                          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                        >
                          <Search className="w-3 h-3 text-orange-500" />
                          <span>ติดตามเบาะแสนวัตกรรม</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center pt-3">
                  <button
                    id="landing-report-more-btn"
                    onClick={() => setActiveTab(2)}
                    className="inline-flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 font-bold hover:underline cursor-pointer"
                  >
                    <span>ต้องการรายงานคดีเอาเปรียบเรื่องใหม่ใช่ไหม? กดเริ่มที่นี่</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== MODULE 2: WHISTLEBLOWING FORM ==================== */}
          {activeTab === 2 && (
            <motion.div
              key="whistleblowing-form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="max-w-3xl mx-auto space-y-6"
              id="module-whistleblowing"
            >
              <div className="text-center space-y-2">
                <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900">
                  ระบบแจ้งเรื่องร้องเรียนการเอาเปรียบ (Whistleblowing Form)
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm">
                  กรอกข้อมูลพฤติการณ์ สภาพแวดล้อม และพิกัดสถานที่เพื่อเริ่มขั้นตอนสืบสวนคุ้มครองสิทธิแรงงาน
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
                
                {/* 1. Select Type of Exploitation */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono font-bold">1</span>
                    เลือกประเภทการเอาเปรียบและละเมิดสิทธิ
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'wage', label: 'ค่าจ้างและผลประโยชน์ (Wage)', desc: 'ไม่จ่ายค่าแรงขั้นต่ำ, ค้างเงินเดือน, ไม่จ่าย OT', emoji: '💰' },
                      { id: 'forced_labor', label: 'การบังคับใช้แรงงาน (Forced Labor)', desc: 'ยึดบัตรประชาชน/เอกสาร, ข่มขู่ กักขังหน่วงเหนี่ยว', emoji: '⛓️' },
                      { id: 'safety', label: 'ความปลอดภัยและชีวอนามัย (Safety)', desc: 'ไม่มีระบบเซฟตี้, สภาพแวดล้อมเสี่ยงอุบัติเหตุร้ายแรง', emoji: '🦺' },
                      { id: 'child_labor', label: 'การใช้แรงงานเด็ก (Child Labor)', desc: 'อายุต่ำกว่ากฎหมายกำหนด, ใช้เยาวชนทำงานหนักอันตราย', emoji: '👶' }
                    ].map((typeItem) => {
                      const isSelected = reportType === typeItem.id;
                      return (
                        <button
                          key={typeItem.id}
                          id={`form-type-select-${typeItem.id}`}
                          type="button"
                          onClick={() => setReportType(typeItem.id as CaseType)}
                          className={`text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex gap-3 ${
                            isSelected 
                              ? 'border-orange-500 bg-orange-50/50 shadow-xs' 
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-2xl shrink-0 mt-0.5">{typeItem.emoji}</span>
                          <div className="space-y-0.5">
                            <span className="block text-xs font-bold text-slate-800">{typeItem.label}</span>
                            <span className="block text-[10.5px] text-slate-500 leading-tight">{typeItem.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Location details with interactive Map */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono font-bold">2</span>
                    ระบุข้อมูลสถานที่และแผนที่พิกัด (Map with GPS)
                  </label>

                  {/* Interactive Mock Map component */}
                  <MapMockup 
                    onLocationSelect={(gps, addressName) => {
                      setGpsLocation(gps);
                      setLocationName(addressName);
                    }} 
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <div className="space-y-1">
                      <label htmlFor="business-name-input" className="block text-xs font-bold text-slate-600">
                        ชื่อสถานประกอบการ / ชื่อยี่ห้อสินค้า / นายจ้าง *
                      </label>
                      <input
                        id="business-name-input"
                        type="text"
                        required
                        placeholder="เช่น โรงงานสิ่งทอสหมิตรการค้า"
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 font-sans"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="location-desc-input" className="block text-xs font-bold text-slate-600">
                        ที่ตั้งโดยสังเขป / อำเภอ จังหวัด *
                      </label>
                      <input
                        id="location-desc-input"
                        type="text"
                        required
                        placeholder="เช่น ตำบลท่าทราย อำเภอเมือง สมุทรสาคร"
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 font-sans"
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Evidence Uploader slot mockup */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono font-bold">3</span>
                    อัปโหลดไฟล์หลักฐาน (Photos / Videos / Documents)
                  </label>

                  {/* Select file type */}
                  <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                    {[
                      { id: 'photo', label: 'ไฟล์รูปภาพ (Photo)', icon: ImageIcon },
                      { id: 'video', label: 'ไฟล์วีดีโอ (Video)', icon: Video },
                      { id: 'document', label: 'เอกสารหลักฐาน (Doc)', icon: FileText }
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = evidenceType === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setEvidenceType(item.id as 'photo' | 'video' | 'document');
                            setEvidenceFile(item.id === 'photo' ? 'paycheck.jpg' : item.id === 'video' ? 'inside_factory.mp4' : 'timesheet.pdf');
                          }}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            isSelected ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-orange-500' : 'text-slate-500'}`} />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Mock Upload Box */}
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 text-center bg-slate-50 hover:bg-slate-50/70 transition-all flex flex-col items-center justify-center gap-2">
                    <div className="bg-orange-50 text-orange-500 p-2.5 rounded-full border border-orange-100">
                      <Upload className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-700">ลากไฟล์หลักฐานเพื่ออัปโหลด หรือกดคลิกเลือกไฟล์</p>
                      <p className="text-[10px] text-slate-400">รองรับไฟล์ขนาดสูงสุด 50MB (เช่น สลิปการจ่ายเงิน, รูปสภาพแวดล้อมนั่งร้าน, วีดีโอบังคับขู่เข็ญ)</p>
                    </div>
                    <div className="inline-flex items-center gap-1 bg-white border border-slate-200 text-[10px] font-mono font-bold px-3 py-1.5 rounded-xl text-slate-600">
                      📂 ไฟล์ทดสอบแนบแล้ว: <span className="text-orange-500">{evidenceFile}</span>
                    </div>
                  </div>

                  {/* Detailed Description text */}
                  <div className="space-y-1">
                    <label htmlFor="details-textarea" className="block text-xs font-bold text-slate-600">
                      อธิบายรายละเอียดพฤติกรรมการเอาเปรียบที่เกิดขึ้น *
                    </label>
                    <textarea
                      id="details-textarea"
                      required
                      rows={3}
                      placeholder="อธิบายว่ามีการเอาเปรียบอย่างไร เกิดขึ้นบ่อยแค่ไหน มีคนงานได้รับผลกระทบกี่คน..."
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 font-sans resize-none"
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                    />
                  </div>
                </div>

                {/* 4. Choose Identity configuration */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <label className="block text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono font-bold">4</span>
                      รูปแบบการยืนยันตัวตนและความปลอดภัย
                    </label>
                    
                    {/* Identity Option Selectors */}
                    <div className="flex gap-1 bg-slate-200 p-0.5 rounded-xl self-start sm:self-auto">
                      <button
                        type="button"
                        id="identity-option-anonymous"
                        onClick={() => setIdentity('anonymous')}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          identity === 'anonymous' ? 'bg-slate-900 text-white' : 'text-slate-600'
                        }`}
                      >
                        Anonymous (ไม่เผยตัวตน)
                      </button>
                      <button
                        type="button"
                        id="identity-option-confidential"
                        onClick={() => setIdentity('confidential')}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          identity === 'confidential' ? 'bg-slate-900 text-white' : 'text-slate-600'
                        }`}
                      >
                        Confidential (ปิดความลับ)
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Help Text based on selection */}
                  {identity === 'anonymous' ? (
                    <div className="text-[11px] text-slate-500 bg-white p-3.5 rounded-xl border border-slate-200/60 space-y-1">
                      <p className="font-bold text-slate-700 flex items-center gap-1">
                        <UserX className="w-3.5 h-3.5 text-orange-500" />
                        ความลับสมบูรณ์แบบ (100% Anonymous Mode)
                      </p>
                      <p>ระบบจะไม่เก็บชื่อ เบอร์โทร หรือไอพีแอดเดรสของท่าน เจ้าหน้าที่จะลงตรวจสอบตามข้อพิรุธของสถานที่เท่านั้น ปลอดภัยสูงสุดสำหรับผู้เป็นแรงงานในสถานประกอบการดังกล่าว</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-[11px] text-slate-500 bg-white p-3.5 rounded-xl border border-slate-200/60 space-y-1">
                        <p className="font-bold text-slate-700 flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                          แบบปกปิดเป็นความลับของรัฐ (Confidential with Contact)
                        </p>
                        <p>ข้อมูลติดต่อของท่านจะถูกกรองและจำกัดผู้รับชมเฉพาะพนักงานสอบสวนแรงงานระดับสูง เหมาะสำหรับบุคคลที่ต้องการให้เจ้าหน้าที่โทรติดต่อกลับเพื่อรายงานความคืบหน้า หรือขอรับเงินสินบนรางวัลนำจับตามกฎหมาย</p>
                      </div>

                      {/* Confidential Details Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label htmlFor="reporter-name-input" className="block text-[10px] font-bold text-slate-600">
                            ชื่อ-นามสกุล ของท่าน (ปกปิดเป็นความลับ)
                          </label>
                          <input
                            id="reporter-name-input"
                            type="text"
                            placeholder="ระบุชื่อจริงของท่านเพื่อเป็นหลักฐาน"
                            className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 font-sans"
                            value={reporterName}
                            onChange={(e) => setReporterName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label htmlFor="reporter-phone-input" className="block text-[10px] font-bold text-slate-600">
                            เบอร์โทรศัพท์ติดต่อกลับ
                          </label>
                          <input
                            id="reporter-phone-input"
                            type="text"
                            placeholder="เช่น 081-XXXXXXX"
                            className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 font-sans"
                            value={reporterPhone}
                            onChange={(e) => setReporterPhone(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    id="submit-whistleblowing-btn"
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5 text-orange-500" />
                    <span>ยืนยันและส่งเบาะแสเข้าระบบสืบสวน</span>
                  </button>
                </div>

              </form>
            </motion.div>
          )}

          {/* ==================== MODULE 3: TRACK STATUS ==================== */}
          {activeTab === 3 && (
            <motion.div
              key="track-status"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="max-w-3xl mx-auto space-y-6"
              id="module-tracking"
            >
              <div className="text-center space-y-2">
                <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900">
                  ระบบติดตามสถานะความคืบหน้า (Track Status)
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm">
                  กรอกหมายเลขอ้างอิงคดีและรหัสผ่านลับของท่านเพื่อติดตามพฤติการณ์สืบสวนของเจ้าหน้าที่คุ้มครองสิทธิแรงงาน
                </p>
              </div>

              {/* Secure Login Form */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-5">
                <form onSubmit={handleTrackSearch} className="space-y-4">
                  <div className="bg-orange-50 text-orange-950 p-4 rounded-2xl border border-orange-100 flex items-start gap-2.5">
                    <CheckCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5 animate-pulse" />
                    <div className="text-[11.5px] leading-relaxed">
                      <span className="font-bold">ตรวจสอบสถานะอย่างรวดเร็ว (Secure Check):</span> เพื่อความปลอดภัยสูงสุด กรุณาป้อนรหัสติดตาม 10 หลัก ที่ท่านได้รับหลังการส่งรายงานเบาะแส
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="track-id-input" className="block text-xs font-bold text-slate-700">
                        รหัสติดตามคดี (Tracking ID)
                      </label>
                      <input
                        id="track-id-input"
                        type="text"
                        placeholder="เช่น WB-2026-0412"
                        className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 font-mono font-bold uppercase"
                        value={trackIdInput}
                        onChange={(e) => setTrackIdInput(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="track-code-input" className="block text-xs font-bold text-slate-700">
                        รหัสลับผู้แจ้ง (Secret Code / Password)
                      </label>
                      <div className="relative">
                        <input
                          id="track-code-input"
                          type="text"
                          placeholder="เช่น PASS123 หรือ SEC-xxx"
                          className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 font-mono font-bold uppercase"
                          value={trackCodeInput}
                          onChange={(e) => setTrackCodeInput(e.target.value)}
                        />
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  </div>

                  {trackError && (
                    <div className="bg-red-50 text-red-800 p-3 rounded-lg border border-red-200 text-xs flex items-center gap-1.5 font-sans font-medium">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span>{trackError}</span>
                    </div>
                  )}

                  <button
                    id="search-track-btn"
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Search className="w-4 h-4 text-orange-500" />
                    <span>ค้นหาและตรวจสอบประวัติคดี (Log In)</span>
                  </button>
                </form>

                {/* TESTER SHORTCUT COMPONENT - to easily test specific cases */}
                <div className="pt-3 border-t border-slate-100">
                  <span className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    ทางลัดสำหรับทดสอบระบบ (Quick Testing Shortcuts)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {cases.map((item) => (
                      <button
                        key={item.id}
                        id={`test-shortcut-${item.id}`}
                        type="button"
                        onClick={() => {
                          setTrackIdInput(item.id);
                          setTrackCodeInput(item.secretCode);
                          setFoundCase(item);
                          setTrackError('');
                        }}
                        className="bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-orange-600 p-2.5 rounded-xl border border-slate-200 text-left transition-all cursor-pointer space-y-1"
                      >
                        <span className="block font-mono text-[10px] font-bold">{item.id}</span>
                        <div className="flex justify-between items-center">
                          <span className="text-[8.5px] font-sans font-bold bg-white px-1 py-0.5 rounded border">
                            {item.secretCode}
                          </span>
                          <span className="text-[8.5px] text-slate-500">
                            {item.type === 'wage' ? '💰' : item.type === 'forced_labor' ? '⛓️' : item.type === 'safety' ? '🦺' : '👶'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* TIMELINE OF TRACK STATUS (Visible only when case is loaded) */}
              <AnimatePresence mode="wait">
                {foundCase ? (
                  <motion.div
                    key={`found-${foundCase.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6"
                    id="tracking-results-card"
                  >
                    {/* Header Case Details */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                            {foundCase.id}
                          </span>
                          {getPriorityBadge(foundCase.priority)}
                        </div>
                        <h3 className="font-bold text-base text-slate-800 mt-2 flex items-center gap-1.5">
                          <Building className="w-4 h-4 text-slate-400" />
                          {foundCase.businessName}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-orange-500" />
                          {foundCase.location} (พิกัดดาวเทียม: {foundCase.gps})
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs text-slate-400 block">สถานะพิจารณาคดี</span>
                        <div className="mt-1">{getStatusBadge(foundCase.status)}</div>
                      </div>
                    </div>

                    {/* Timeline Tracker Graphic matching the mockup */}
                    <div className="space-y-4">
                      <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                        Timeline ติดตามสถานะ
                      </span>

                      <div className="relative pl-6 space-y-6">
                        {/* Vertical line connector */}
                        <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-slate-200" />

                        {foundCase.timeline.map((step, idx) => {
                          const isActive = foundCase.status === step.status;
                          const isFinished = step.isCompleted;

                          return (
                            <div key={idx} className="relative flex gap-4 items-start">
                              
                              {/* Indicator Circle */}
                              <div className={`absolute -left-[20px] w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all z-10 ${
                                isFinished
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : isActive
                                    ? 'bg-orange-500 border-orange-500 text-white animate-pulse'
                                    : 'bg-white border-slate-200 text-slate-300'
                              }`}>
                                {isFinished ? (
                                  <span className="text-xs font-bold">✓</span>
                                ) : (
                                  <span className="text-[10px] font-bold font-mono">{idx + 1}</span>
                                )}
                              </div>

                              {/* Text details */}
                              <div className="flex-1 space-y-1 bg-slate-50/50 p-3.5 rounded-2xl border border-slate-150">
                                <div className="flex items-center justify-between gap-2">
                                  <span className={`text-xs font-bold ${isFinished || isActive ? 'text-slate-800' : 'text-slate-400'}`}>
                                    {step.title}
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-400">
                                    {step.timestamp}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                  {step.description}
                                </p>
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Additional Case Details box */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-4 space-y-3">
                      <span className="text-xs font-bold text-slate-700 block border-b border-slate-200 pb-1.5 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-orange-500" />
                        สรุปพฤติการณ์ที่แนบมาในคำร้อง
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <span className="text-slate-400 block">รูปแบบพฤติกรรมเอาเปรียบ:</span>
                          <span className="font-semibold text-slate-800">{getReportTypeLabel(foundCase.type)}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-slate-400 block">สิทธิ์ตัวตนผู้รายงาน:</span>
                          <span className="font-semibold text-slate-800 uppercase font-mono">
                            {foundCase.identity === 'anonymous' ? '🔒 ไม่เปิดเผยตัวตน (Anonymous)' : '👤 ปกปิดเป็นความลับ (Confidential)'}
                          </span>
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <span className="text-slate-400 block">เอกสาร/หลักฐานอ้างอิง:</span>
                          <span className="font-mono text-slate-700 bg-white border px-2 py-0.5 rounded text-[10.5px] inline-block">
                            📁 {foundCase.evidenceUrl || 'ไม่มีการแนบไฟล์หลักฐาน'}
                          </span>
                        </div>
                        <div className="space-y-1 sm:col-span-2 bg-white p-3 rounded-xl border border-slate-200">
                          <span className="text-slate-400 block">คำบรรยายพฤติการณ์:</span>
                          <p className="text-slate-700 mt-1 italic leading-relaxed">
                            "{foundCase.details}"
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Go to next screen CTA to satisfy the loop */}
                    <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-orange-950 font-sans">
                      <span className="font-semibold flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-orange-500 shrink-0" />
                        ทดสอบเปลี่ยนสถานะเคสนี้ได้ในหน้าถัดไป (ผู้ดูแลระบบหลังบ้าน) เพื่อดูการอัปเดตแบบเรียลไทม์!
                      </span>
                      <button
                        id="track-go-admin-btn"
                        onClick={() => setActiveTab(4)}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0 text-xs shadow-sm"
                      >
                        ไปหน้าที่ 4 (ระบบจัดการหลังบ้าน)
                      </button>
                    </div>

                  </motion.div>
                ) : (
                  <motion.div
                    key="no-case"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-slate-100 rounded-3xl border-2 border-dashed border-slate-300 p-10 text-center text-slate-500"
                  >
                    <AlertTriangle className="w-10 h-10 mx-auto text-slate-400 mb-3 animate-bounce" />
                    <p className="font-bold text-sm text-slate-700">กรุณาป้อนหมายเลขรายงานเพื่อตรวจสอบข้อมูล</p>
                    <p className="text-xs mt-1 text-slate-500">หรือใช้ทางลัดทดสอบระบบด่วนโดยการกดปุ่มเคสจำลองที่มีอยู่ด้านบน</p>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}

          {/* ==================== MODULE 4: ADMIN DASHBOARD ==================== */}
          {activeTab === 4 && (
            <motion.div
              key="admin-dashboard"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
              id="module-admin"
            >
              {/* Header with Title and On-duty staff */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-900 text-white p-2.5 rounded-2xl">
                    <Settings className="w-6 h-6 text-orange-500 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-900 font-display">
                      ระบบจัดการหลังบ้านสำหรับพนักงานเจ้าหน้าที่ (Admin Dashboard)
                    </h2>
                    <p className="text-xs text-slate-500">
                      สำหรับผู้ตรวจการแรงงาน กระทรวงแรงงาน และกองบัญชาการคดีพิเศษ เพื่อสืบสวน ปรับระดับความเร่งด่วน และปิดคดี
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 border px-3 py-1.5 rounded-xl text-xs self-start sm:self-auto">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                  <span className="font-medium text-slate-700">
                    เจ้าหน้าที่ออนแอร์: <span className="font-bold">3 นาย</span>
                  </span>
                </div>
              </div>

              {/* Statistical summary counters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-md relative overflow-hidden">
                  <div className="absolute top-2 right-2 text-white/5 font-mono text-4xl font-extrabold select-none">
                    ALL
                  </div>
                  <span className="text-[11px] text-slate-400 block font-semibold">สรุปเคสรายงานทั้งหมด</span>
                  <span className="text-2xl font-extrabold block mt-1 font-mono">{totalSimulatedCases}</span>
                  <div className="text-[9.5px] text-slate-400 mt-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" /> อัตราการรายงานเพิ่มขึ้นสัปดาห์นี้
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] text-slate-500 block font-semibold">สถานะดำเนินการอยู่ (In Progress)</span>
                  <span className="text-2xl font-extrabold block mt-1 text-slate-800 font-mono">{inProgressCasesCount}</span>
                  <div className="text-[9.5px] text-yellow-600 mt-2 flex items-center gap-1.5 font-bold">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" /> กำลังตรวจสอบพิกัด GPS
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] text-slate-500 block font-semibold">ปิดเคสสำเร็จสมบูรณ์ (Closed)</span>
                  <span className="text-2xl font-extrabold block mt-1 text-emerald-600 font-mono">{closedCasesCount}</span>
                  <div className="text-[9.5px] text-emerald-600 mt-2 flex items-center gap-1.5 font-bold">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> ช่วยเหลือแรงงานสำเร็จ
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] text-slate-500 block font-semibold">เคสเร่งด่วนที่สุด (High Priority)</span>
                  <span className="text-2xl font-extrabold block mt-1 text-red-600 font-mono">
                    {cases.filter(c => c.priority === 'high').length}
                  </span>
                  <div className="text-[9.5px] text-red-600 mt-2 flex items-center gap-1.5 font-bold">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" /> ตรวจสอบเรื่องละเมิดรุนแรง
                  </div>
                </div>
              </div>

              {/* Filters and Search Tools */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-orange-500" />
                    กล่องควบคุมตัวกรองอัจฉริยะ (Data Filters)
                  </span>
                  <button
                    onClick={() => {
                      setAdminSearch('');
                      setAdminPriorityFilter('all');
                      setAdminTypeFilter('all');
                    }}
                    className="text-[10px] text-orange-600 hover:text-orange-500 hover:underline font-bold"
                  >
                    รีเซ็ตตัวกรองทั้งหมด
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Search text input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="admin-search-input"
                      type="text"
                      className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 font-sans"
                      placeholder="ค้นหาชื่อโรงงาน, ไอดีเคส หรือพิกัด..."
                      value={adminSearch}
                      onChange={(e) => setAdminSearch(e.target.value)}
                    />
                  </div>

                  {/* Priority selector */}
                  <div>
                    <select
                      id="admin-priority-filter"
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 font-sans"
                      value={adminPriorityFilter}
                      onChange={(e) => setAdminPriorityFilter(e.target.value as any)}
                    >
                      <option value="all">ความสำคัญทั้งหมด (Priority: All)</option>
                      <option value="high">ด่วนที่สุด (High)</option>
                      <option value="medium">ปานกลาง (Medium)</option>
                      <option value="low">ปกติ (Low)</option>
                    </select>
                  </div>

                  {/* Case Type selector */}
                  <div>
                    <select
                      id="admin-type-filter"
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 font-sans"
                      value={adminTypeFilter}
                      onChange={(e) => setAdminTypeFilter(e.target.value as any)}
                    >
                      <option value="all">ประเภทการเอาเปรียบทั้งหมด (Type: All)</option>
                      <option value="wage">ค่าจ้างและผลประโยชน์ (Wage)</option>
                      <option value="forced_labor">บังคับใช้แรงงาน (Forced Labor)</option>
                      <option value="safety">ความปลอดภัยในการทำงาน (Safety)</option>
                      <option value="child_labor">แรงงานเด็ก (Child Labor)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400">ค้นหาด่วน:</span>
                  <input
                    type="text"
                    className="w-full max-w-[280px] text-[10.5px] px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg font-sans"
                    placeholder="พิมพ์กรองด่วนตรงนี้..."
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Administrative Case Database Table matching design layout */}
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 text-[11px] font-bold uppercase tracking-wider font-sans">
                        <th className="p-4">Case ID</th>
                        <th className="p-4">ผู้ถูกกล่าวหา / สถานที่</th>
                        <th className="p-4">ประเภทประพฤติกรรม</th>
                        <th className="p-4">ความเร่งด่วน</th>
                        <th className="p-4">สถานะคดี (ปรับเปลี่ยนได้ทันที)</th>
                        <th className="p-4 text-right">การจัดการ</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredCases.length > 0 ? (
                        filteredCases.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/50 transition-all">
                            
                            {/* Case ID */}
                            <td className="p-4 whitespace-nowrap">
                              <div className="flex flex-col gap-0.5">
                                <span className="font-mono font-bold text-slate-800">
                                  {item.id}
                                </span>
                                <span className="text-[9px] text-slate-400 font-mono">
                                  รหัสลับ: {item.secretCode}
                                </span>
                              </div>
                            </td>

                            {/* Business Information */}
                            <td className="p-4">
                              <div className="space-y-0.5 max-w-[220px]">
                                <span className="font-bold text-slate-800 block truncate" title={item.businessName}>
                                  {item.businessName}
                                </span>
                                <span className="text-slate-500 text-[10.5px] block truncate flex items-center gap-0.5">
                                  <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                                  {item.location}
                                </span>
                              </div>
                            </td>

                            {/* Type of Incident badge */}
                            <td className="p-4 whitespace-nowrap">
                              <span className={`inline-block text-[10.5px] font-semibold px-2 py-0.5 rounded border ${getReportTypeBadgeColor(item.type)}`}>
                                {getReportTypeLabel(item.type).split(' (')[0]}
                              </span>
                            </td>

                            {/* Priority setting drop selector */}
                            <td className="p-4 whitespace-nowrap">
                              <select
                                id={`admin-set-priority-${item.id}`}
                                className="bg-white border border-slate-200 rounded-lg text-[11px] py-1 px-1.5 focus:outline-none focus:border-orange-500 font-sans"
                                value={item.priority}
                                onChange={(e) => updateCasePriority(item.id, e.target.value as CasePriority)}
                              >
                                <option value="high">🔴 ด่วนที่สุด (High)</option>
                                <option value="medium">🟡 ปานกลาง (Medium)</option>
                                <option value="low">⚪ ปกติ (Low)</option>
                              </select>
                            </td>

                            {/* Live Status dropdown - updates Screen 3 immediately */}
                            <td className="p-4 whitespace-nowrap">
                              <select
                                id={`admin-set-status-${item.id}`}
                                className={`font-semibold border rounded-lg text-[11px] py-1 px-2 focus:outline-none focus:border-orange-500 ${
                                  item.status === 'closed' 
                                    ? 'bg-green-50 text-green-700 border-green-200' 
                                    : item.status === 'action_taken'
                                      ? 'bg-orange-50 text-orange-700 border-orange-200'
                                      : item.status === 'investigating'
                                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                        : 'bg-blue-50 text-blue-700 border-blue-200'
                                }`}
                                value={item.status}
                                onChange={(e) => updateCaseStatus(item.id, e.target.value as CaseStatus)}
                              >
                                <option value="received">📥 รับเรื่องเข้าระบบ (Received)</option>
                                <option value="investigating">🔍 กำลังตรวจสอบ (Investigating)</option>
                                <option value="action_taken">⚡ ดำเนินการแก้ไข (Action Taken)</option>
                                <option value="closed">✔ ปิดเคสสำเร็จ (Closed)</option>
                              </select>
                            </td>

                            {/* Actions / Utilities */}
                            <td className="p-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  id={`admin-track-redirect-${item.id}`}
                                  onClick={() => triggerFastTrack(item.id, item.secretCode)}
                                  className="p-1.5 text-slate-500 hover:text-orange-500 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                                  title="ทดสอบติดตามเคสนี้แบบประหนึ่งผู้ร้องเรียนชม"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  id={`admin-delete-btn-${item.id}`}
                                  onClick={() => deleteCase(item.id)}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                                  title="ลบรายงานเบาะแสออกจากระบบจำลอง"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>

                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-500">
                            <AlertCircle className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                            ไม่พบข้อมูลเคสแรงงานที่ตรงตามตัวกรอง กรุณาลองปรับเปลี่ยนตัวกรองของท่านใหม่
                          </td>
                        </tr>
                      )}
                    </tbody>

                  </table>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 font-sans flex flex-col sm:flex-row items-center justify-between gap-2">
                  <span>* ข้อมูลสถานภาพและไทม์ไลน์จะซิงก์โดยตรงกับหน้าจอ "ระบบติดตามสถานะ (หน้า 3)" ทันทีเมื่อท่านปรับเปลี่ยน</span>
                  <span className="font-semibold text-orange-600">สิทธิและเสรีภาพแรงงานเท่าเทียมกันภายใต้กฎหมายคุ้มครอง</span>
                </div>
              </div>

              {/* Back to landing screen button to reset the sequential flow */}
              <div className="text-center pt-2">
                <button
                  id="admin-reset-to-landing-btn"
                  onClick={() => setActiveTab(1)}
                  className="bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold py-3 px-6 rounded-2xl border border-slate-200 shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-orange-500 animate-spin" style={{ animationDuration: '4s' }} />
                  <span>เริ่มการนำเสนอ/ใช้งานใหม่อีกครั้งที่ หน้าแรก (LANDING PAGE)</span>
                </button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER & ACCESSIBILITY BAR */}
      <footer className="bg-slate-900 text-white mt-12 py-10 px-6 border-t border-slate-800 shrink-0 font-sans">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-slate-400">
          
          <div className="space-y-3">
            <span className="text-white font-bold text-sm block">คุ้มครองสิทธิมนุษยชนแรงงาน</span>
            <p className="leading-relaxed text-[11px]">
              พอร์ทัลลงทะเบียนแจ้งเบาะแสการเอาเปรียบเพื่อปกป้องสิทธิประโยชน์ ได้รับแรงบันดาลใจจากสภาวการณ์ความต้องการตรวจสอบสภาพการทำงานและความเป็นธรรมทางอัตราค่าจ้างขั้นต่ำ
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-white font-bold text-sm block">เบอร์ติดต่อด่วน / หน่วยงานช่วยเหลือ</span>
            <ul className="space-y-1.5 text-[11px]">
              <li className="flex items-center gap-1.5 text-slate-300">
                📞 สายด่วนกระทรวงแรงงาน: <span className="font-mono font-bold text-orange-400">1506</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                📞 สายด่วนช่วยแรงงานต่างชาติ/ค้ามนุษย์: <span className="font-mono font-bold text-orange-400">1149</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                🏢 กองคุ้มครองสิทธิและสิทธิแรงงานสตรีและเด็ก: <span className="font-mono text-slate-400">02-245-xxxx</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="text-white font-bold text-sm block">ขั้นตอนการใช้งานแนะแนว</span>
            <p className="leading-relaxed text-[11px]">
              ท่านสามารถทดสอบระบบโดยเริ่มแจ้งเหตุการณ์ที่หน้า 2 คัดลอกรหัสเคสไปตรวจสอบในหน้า 3 และสามารถสลับบทบาทเป็นพนักงานตรวจราชการในหน้า 4 เพื่อเลื่อนอนุมัติสถานะได้อย่างเสรี
            </p>
            <span className="block text-[10px] text-orange-500 font-mono">
              ⚡ Sandbox Simulation Environment Enabled (UTC 2026)
            </span>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-800 mt-8 pt-4 text-center text-[10px] text-slate-500">
          ระบบสารสนเทศความปลอดภัยแรงงานจำลอง © 2026 - สงวนลิขสิทธิ์ความปลอดภัยแรงงาน
        </div>
      </footer>

      {/* SUCCESS POPUP MODAL (Triggers upon submitting a report on Screen 2) */}
      <AnimatePresence>
        {showSuccessModal && submittedCase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4"
              id="success-credentials-modal"
            >
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xl shadow-sm font-bold">
                  ✓
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-sans">
                  บันทึกรับแจ้งเบาะแสเข้าระบบสำเร็จ!
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  ข้อมูลข้อร้องเรียนของท่านได้รับการจัดส่งไปยังหน่วยคุ้มครองแรงงานด่วนพิเศษเรียบร้อยแล้ว กรุณาแคปหน้าจอหรือคัดลอกรหัสด้านล่างนี้เพื่อใช้สืบค้นติดตามสถานะ
                </p>
              </div>

              {/* Beautiful credential box representing the flowchart's Tracking ID */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-3.5">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                    หมายเลขอ้างอิงติดตามเคส
                  </span>
                  <span className="font-mono text-xl font-extrabold text-slate-800 tracking-wider">
                    {submittedCase.id}
                  </span>
                </div>

                <div className="border-t border-slate-200/60 pt-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                    รหัสผ่านเข้าถึงประวัติลับ
                  </span>
                  <span className="font-mono text-base font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 inline-block mt-1">
                    {submittedCase.secretCode}
                  </span>
                </div>
              </div>

              <div className="bg-orange-50 text-orange-950 p-3 rounded-xl border border-orange-100 text-[10.5px] leading-relaxed">
                ℹ️ <strong>วิธีสืบค้นความคืบหน้า:</strong> คลิกปุ่มด้านล่างเพื่อไปหน้าติดตามสถานะทันที ระบบจะใส่ข้อมูลรหัสเหล่านี้ให้ท่านโดยอัตโนมัติเพื่ออำนวยความสะดวกในการตรวจสอบ
              </div>

              <div className="flex gap-2">
                <button
                  id="modal-close-keep-btn"
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-3 rounded-xl transition-all cursor-pointer"
                >
                  ปิดหน้านี้
                </button>
                <button
                  id="modal-goto-tracking-btn"
                  onClick={() => {
                    setShowSuccessModal(false);
                    setActiveTab(3); // Navigate to Track Status Page 3
                    
                    // Trigger search
                    setFoundCase(submittedCase);
                    setTrackError('');
                  }}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>ไปตรวจสอบสถานะเคส (หน้า 3)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-orange-500" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
