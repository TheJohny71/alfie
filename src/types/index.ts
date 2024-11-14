// src/types/index.ts

export interface DateRange {
  start: Date;
  end: Date;
}

export interface CalendarProps {
  selectedDate?: Date;
  handleDateChange?: (date: Date) => void;
  handleDateSelect?: (date: Date) => void;
}

export interface WeekViewProps {
  viewMode?: 'week' | 'month';
  region?: string;
  index?: number;
}

export interface LeaveRequest {
  id: string;
  startDate: Date;
  endDate: Date;
  type: string;
  status: string;
}

export type ViewMode = 'week' | 'month' | 'year';
