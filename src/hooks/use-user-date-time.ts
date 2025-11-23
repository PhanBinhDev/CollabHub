import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { useMemo } from 'react';

export function useUserDateTime() {
  const settings = useQuery(api.users.getUserSettings);

  const formatDate = useMemo(() => {
    return (date: Date | string) => {
      const d = typeof date === 'string' ? new Date(date) : date;

      if (!settings) {
        return d.toLocaleDateString();
      }

      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();

      switch (settings.dateFormat) {
        case 'dd/mm/yyyy':
          return `${day}/${month}/${year}`;
        case 'mm/dd/yyyy':
          return `${month}/${day}/${year}`;
        case 'yyyy-mm-dd':
          return `${year}-${month}-${day}`;
        default:
          return d.toLocaleDateString();
      }
    };
  }, [settings]);

   const formatTime = useMemo(() => {
     return (date: Date | string, showSeconds = false) => {
       const d = typeof date === 'string' ? new Date(date) : date;

       if (!settings) {
         return d.toLocaleTimeString();
       }

       const hours = d.getHours();
       const minutes = String(d.getMinutes()).padStart(2, '0');
       const seconds = String(d.getSeconds()).padStart(2, '0');

       const timeString = showSeconds ? `${minutes}:${seconds}` : minutes;

       if (settings.timeFormat === '12h') {
         const period = hours >= 12 ? 'PM' : 'AM';
         const displayHours = hours % 12 || 12;
         return showSeconds
           ? `${displayHours}:${timeString} ${period}`
           : `${displayHours}:${timeString} ${period}`;
       } else {
         const displayHours = String(hours).padStart(2, '0');
         return showSeconds
           ? `${displayHours}:${timeString}`
           : `${displayHours}:${minutes}`;
       }
     };
   }, [settings]);

  const formatDateTime = useMemo(() => {
    return (date: Date | string) => {
      return `${formatDate(date)} ${formatTime(date)}`;
    };
  }, [formatDate, formatTime]);

  const getCurrentTime = useMemo(() => {
    return () => {
      if (!settings) return new Date();

      // Get current time in UTC
      const now = new Date();

      // Parse timezone offset (e.g., "UTC+7" -> 7)
      const timezoneMatch = settings.timezone.match(/UTC([+-]\d+)/);
      if (!timezoneMatch) return now;

      const offset = parseInt(timezoneMatch[1]);

      // Apply timezone offset
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      return new Date(utc + 3600000 * offset);
    };
  }, [settings]);

  return {
    formatDate,
    formatTime,
    formatDateTime,
    getCurrentTime,
    settings,
  };
}
