
import { useState, useEffect, useMemo } from 'react';
import { Announcement } from './useAnnouncements';
import { DateRange } from 'react-day-picker';

type SortField = 'sessionDate' | 'court' | 'announcer' | 'caseNumber';
type SortDirection = 'asc' | 'desc';

export const useFilteredAnnouncements = (announcements: Announcement[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courtFilter, setCourtFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [sortField, setSortField] = useState<SortField>('sessionDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const filteredAndSortedAnnouncements = useMemo(() => {
    let filtered = [...announcements];

    // Apply filters
    if (searchTerm) {
      filtered = filtered.filter(announcement =>
        announcement.caseNumber.includes(searchTerm) ||
        announcement.announcer.includes(searchTerm) ||
        announcement.description.includes(searchTerm)
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(announcement => announcement.announcementType === typeFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(announcement => announcement.status === statusFilter);
    }

    if (courtFilter !== 'all') {
      filtered = filtered.filter(announcement => announcement.court === courtFilter);
    }

    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter(announcement => 
        announcement.sessionDate >= dateRange.from! && 
        announcement.sessionDate <= dateRange.to!
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle date sorting
      if (sortField === 'sessionDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Handle string sorting
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [announcements, searchTerm, typeFilter, statusFilter, courtFilter, dateRange, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setStatusFilter('all');
    setCourtFilter('all');
    setDateRange(undefined);
  };

  return {
    filteredAnnouncements: filteredAndSortedAnnouncements,
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    courtFilter,
    setCourtFilter,
    dateRange,
    setDateRange,
    sortField,
    sortDirection,
    handleSort,
    resetFilters
  };
};
