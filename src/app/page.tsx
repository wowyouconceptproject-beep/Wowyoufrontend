"use client";

import { useEffect, useState } from "react";

import HeroCarousel from "@/components/discovery/HeroCarousel";
import FeaturedEvent from "@/components/discovery/FeaturedEvent";
import EventRail from "@/components/discovery/EventRail";
import CategoryStrip from "@/components/discovery/CategoryStrip";

import {
  getDiscovery,
  DiscoveryResponse,
} from "@/services/discovery";

export default function HomePage() {
  const [data, setData] =
    useState<DiscoveryResponse>();

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function load() {
      try {
        const result =
          await getDiscovery();

        setData(result);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-background" />
    );
  }

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center">

        Unable to load discovery.

      </main>
    );
  }

  return (
    <main className="space-y-32 pb-32">

      <HeroCarousel
        events={data.hero}
      />

      {data.featured && (
        <FeaturedEvent
          event={data.featured}
        />
      )}

      <EventRail
        title="Now Showing"
        subtitle="Experiences people are discovering this week."
        events={data.trending}
      />

      <CategoryStrip
        categories={data.categories}
      />

      <EventRail
        title="Coming Soon"
        subtitle="Plan your next experience."
        events={data.upcoming}
      />

    </main>
  );
}