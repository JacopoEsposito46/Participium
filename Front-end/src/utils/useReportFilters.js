import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook to manage report filtering logic
 * @param {Array} reports - Array of reports to filter
 * @param {Object} options - Additional filter options
 * @returns {Object} - Filtered reports and filter controls
 */
const useReportFilters = (reports, options = {}) => {
  const [filteredReports, setFilteredReports] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [statusFilter, setStatusFilter] = useState(
    options.statusFilter || null
  );
  const [categoryFilter, setCategoryFilter] = useState(
    options.categoryFilter || null
  );

  const applyFilters = useCallback(() => {
    let filtered = [...reports];

    // Filtro per status (se presente)
    if (statusFilter && statusFilter !== "All") {
      filtered = filtered.filter((report) => report.status === statusFilter);
    }

    // Filtro per categoria (se presente)
    if (categoryFilter) {
      filtered = filtered.filter(
        (report) => report.category.name === categoryFilter
      );
    }

    // Filtro per data inizio
    if (startDate) {
      filtered = filtered.filter(
        (report) => new Date(report.createdAt) >= startDate
      );
    }

    // Filtro per data fine
    if (endDate) {
      const endDateCopy = new Date(endDate);
      endDateCopy.setHours(23, 59, 59, 999);
      filtered = filtered.filter(
        (report) => new Date(report.createdAt) <= endDateCopy
      );
    }

    // Ordinamento per data
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    setFilteredReports(filtered);
  }, [reports, startDate, endDate, sortOrder, statusFilter, categoryFilter]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSortOrder("desc");
    if (options.statusFilter !== undefined) {
      setStatusFilter("All");
    }
    if (options.categoryFilter !== undefined) {
      setCategoryFilter("");
    }
  };

  return {
    filteredReports,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    sortOrder,
    setSortOrder,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    resetFilters,
  };
};

export default useReportFilters;
