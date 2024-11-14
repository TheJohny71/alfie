// src/types/index.ts

export type ViewMode = 'day' | 'week' | 'month';
export type Region = 'UK' | 'US' | 'EU';

export interface CalendarState {
    currentDate: Date;
    selectedDate?: Date;
    viewMode: ViewMode;
    region: Region;
}

export interface Holiday {
    date: Date;
    name: string;
    region: Region;
}

export interface WeekViewProps {
    state: CalendarState;
    holidays: Holiday[];
}

// You can add more type definitions as needed
