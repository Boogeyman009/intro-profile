"use client";

import { useCallback, useEffect, useState } from "react";
import { Profile } from "@/lib/profile";

export function useProfile(initial?: Profile) {
  const [profile, setProfile] = useState<Profile | null>(initial ?? null);
  const [loading, setLoading] = useState(!initial);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(initial ? new Date() : null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profile", { cache: "no-store" });
      const data = await res.json();
      setProfile(data);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initial) refresh();
  }, [initial, refresh]);

  return { profile, loading, lastUpdated, refresh, setProfile };
}
