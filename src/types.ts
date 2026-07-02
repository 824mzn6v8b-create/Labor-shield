/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CaseType = 'wage' | 'forced_labor' | 'safety' | 'child_labor';

export type CaseStatus = 'received' | 'investigating' | 'action_taken' | 'closed';

export type CasePriority = 'high' | 'medium' | 'low';

export interface TimelineEvent {
  status: CaseStatus;
  title: string;
  description: string;
  timestamp: string;
  isCompleted: boolean;
}

export interface WhistleblowingCase {
  id: string;
  type: CaseType;
  location: string;
  gps: string;
  businessName: string;
  evidenceUrl: string | null;
  evidenceType: 'photo' | 'video' | 'document' | null;
  details: string;
  identity: 'anonymous' | 'confidential';
  status: CaseStatus;
  priority: CasePriority;
  createdAt: string;
  secretCode: string; // Used to track status
  timeline: TimelineEvent[];
}

export interface Statistics {
  totalCases: number;
  closedPercent: number;
  fastClosedPercent: number;
  inProgressCount: number;
  highPriorityCount: number;
  mediumPriorityCount: number;
}
