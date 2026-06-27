'use client';

import React, { useState, useMemo } from 'react';
import styles from './calendar.module.css';
import { useApplications } from '@/contexts/ApplicationContext';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Calendar() {
  const { applications, loading } = useApplications();
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const getApplicationsForDay = (day: Date) => {
    return applications.filter(app => {
      const appDate = new Date(app.appliedDate);
      return isSameDay(appDate, day);
    });
  };

  if (loading) return <div>Loading calendar...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Application Calendar</h1>
        <div className={styles.monthNav}>
          <button onClick={prevMonth}><ChevronLeft size={20} /></button>
          <div className={styles.monthLabel}>{format(currentDate, 'MMMM yyyy')}</div>
          <button onClick={nextMonth}><ChevronRight size={20} /></button>
        </div>
      </header>

      <div className={styles.calendar}>
        <div className={styles.calendarInner}>
          <div className={styles.weekdays}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className={styles.weekday}>{day}</div>
            ))}
          </div>
          
          <div className={styles.daysGrid}>
            {days.map(day => {
              const dayApps = getApplicationsForDay(day);
              const isCurrMonth = isSameMonth(day, currentDate);
              const isCurrDay = isToday(day);

              return (
                <div 
                  key={day.toISOString()} 
                  className={`
                    ${styles.dayCell} 
                    ${!isCurrMonth ? styles.otherMonth : ''} 
                    ${isCurrDay ? styles.today : ''}
                  `}
                >
                  <div className={styles.dayNumber}>{format(day, 'd')}</div>
                  <div className={styles.eventsContainer}>
                    {dayApps.map(app => (
                      <div 
                        key={app.id} 
                        className={`
                          ${styles.event} 
                          ${app.status === 'Interviewing' ? styles.eventInterviewing : ''}
                          ${app.status === 'Offer' ? styles.eventOffer : ''}
                        `}
                        title={`${app.company} - ${app.position}`}
                      >
                        {app.company}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
