// src/components/calendar/WeekView.tsx
import React from 'react';
import type { WeekViewProps } from '../types';

export const WeekView: React.FC<WeekViewProps> = ({ state, holidays }) => {
    const { currentDate, selectedDate, region } = state;

    // Get the start of the week (Sunday)
    const getWeekStart = (date: Date): Date => {
        const newDate = new Date(date);
        const day = newDate.getDay();
        const diff = newDate.getDate() - day;
        return new Date(newDate.setDate(diff));
    };

    // Get array of dates for the week
    const getWeekDates = (startDate: Date): Date[] => {
        const dates: Date[] = [];
        for (let i = 0; i < 7; i++) {
            const newDate = new Date(startDate);
            newDate.setDate(startDate.getDate() + i);
            dates.push(newDate);
        }
        return dates;
    };

    const weekStart = getWeekStart(currentDate);
    const weekDates = getWeekDates(weekStart);

    const isHoliday = (date: Date): string | null => {
        const holiday = holidays.find(h => 
            h.date.toDateString() === date.toDateString() && 
            h.region === region
        );
        return holiday ? holiday.name : null;
    };

    return (
        <div className="week-view">
            <div className="week-header">
                {weekDates.map(date => (
                    <div key={date.toISOString()} className="week-day-header">
                        <div className="day-name">
                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="day-date">
                            {date.getDate()}
                        </div>
                    </div>
                ))}
            </div>
            <div className="week-body">
                {weekDates.map(date => {
                    const holidayName = isHoliday(date);
                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                    const isToday = new Date().toDateString() === date.toDateString();
                    
                    return (
                        <div 
                            key={date.toISOString()}
                            className={`week-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                        >
                            {holidayName && (
                                <div className="holiday-marker">
                                    {holidayName}
                                </div>
                            )}
                            {/* Add your day content here */}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WeekView;
