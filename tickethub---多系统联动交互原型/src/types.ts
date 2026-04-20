/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TicketType = 'error' | 'question' | 'suggestion';
export type TicketStatus = 'pending' | 'processing' | 'awaiting_user' | 'forwarded' | 'resolved' | 'closed';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type OpsType = 'none' | 'bug' | 'feature' | 'task';

export interface Ticket {
  id: string;
  type: TicketType;
  opsType?: OpsType;
  title: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  creator: string;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
  associatedBId?: string;
  bSystemInfo?: {
    businessLine: string;
    product: string;
    system: string;
  };
  context?: {
    userId: string;
    page: string;
    browser: string;
    resolution: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'agent';
  content: string;
  timestamp: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}
