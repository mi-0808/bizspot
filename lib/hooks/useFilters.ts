"use client";

import { useState, useCallback } from "react";
import { DEFAULT_FILTERS, type FilterState, type Purpose, type PriceFilter } from "@/lib/types/filters";

export function useFilters() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const togglePurpose = useCallback((purpose: Purpose) => {
    setFilters((f) => ({
      ...f,
      purposes: f.purposes.includes(purpose)
        ? f.purposes.filter((p) => p !== purpose)
        : [...f.purposes, purpose],
    }));
  }, []);

  const togglePrice = useCallback((price: PriceFilter) => {
    setFilters((f) => ({
      ...f,
      prices: f.prices.includes(price)
        ? f.prices.filter((p) => p !== price)
        : [...f.prices, price],
    }));
  }, []);

  const setOpenNow = useCallback((value: boolean) => {
    setFilters((f) => ({ ...f, openNow: value }));
  }, []);

  const setStartTime = useCallback((value: string) => {
    setFilters((f) => ({ ...f, startTime: value }));
  }, []);

  const setEndTime = useCallback((value: string) => {
    setFilters((f) => ({ ...f, endTime: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const hasActiveFilters =
    filters.purposes.length > 0 ||
    filters.openNow ||
    filters.startTime !== "" ||
    filters.endTime !== "" ||
    filters.prices.length > 0;

  return {
    filters,
    togglePurpose,
    togglePrice,
    setOpenNow,
    setStartTime,
    setEndTime,
    resetFilters,
    hasActiveFilters,
  };
}
