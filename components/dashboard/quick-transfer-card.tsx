"use client";

import { useState, type ChangeEvent } from "react";

type PlatformValue = "spotify" | "apple-music";

type PlatformOption = {
  value: PlatformValue;
  label: string;
};

const PLATFORM_OPTIONS: PlatformOption[] = [
  { value: "spotify", label: "Spotify" },
  { value: "apple-music", label: "Apple Music" },
];

const SELECT_BASE_CLASS_NAME =
  "mt-2 w-full rounded-xl border border-surface-border/80 bg-base/50 px-3 py-2.5 text-sm text-copy-primary shadow-sm shadow-base/20 transition-all duration-200 hover:border-copy-secondary/40 hover:bg-base/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-base";

export function QuickTransferCard() {
  const [sourcePlatform, setSourcePlatform] = useState<PlatformValue | "">("");
  const [destinationPlatform, setDestinationPlatform] = useState<
    PlatformValue | ""
  >("");

  function handleSourcePlatformChange(event: ChangeEvent<HTMLSelectElement>) {
    const selectedSource = event.target.value as PlatformValue | "";
    setSourcePlatform(selectedSource);

    if (selectedSource !== "" && destinationPlatform === selectedSource) {
      setDestinationPlatform("");
    }
  }

  function handleDestinationPlatformChange(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    const selectedDestination = event.target.value as PlatformValue | "";
    setDestinationPlatform(selectedDestination);
  }

  return (
    <section className="rounded-2xl border border-surface-border/80 bg-elevated/70 p-6 shadow-md shadow-base/35 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-base/45 sm:p-7">
      <div className="max-w-2xl">
        <p className="inline-flex items-center rounded-full border border-surface-border/70 bg-surface px-2.5 py-1 text-xs font-medium text-copy-secondary">
          Primary action
        </p>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-copy-primary">
          Start a playlist transfer
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-copy-secondary">
          Choose a source platform, destination platform, and playlist to begin.
        </p>
      </div>
      <div className="mt-7 space-y-5">
        <div className="grid gap-4 lg:grid-cols-3">
          <div>
            <label
              className="text-xs font-medium tracking-wide text-copy-secondary"
              htmlFor="source-platform"
            >
              Source platform
            </label>
            <select
              id="source-platform"
              className={SELECT_BASE_CLASS_NAME}
              value={sourcePlatform}
              onChange={handleSourcePlatformChange}
            >
              <option value="">Select source</option>
              {PLATFORM_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="text-xs font-medium tracking-wide text-copy-secondary"
              htmlFor="destination-platform"
            >
              Destination platform
            </label>
            <select
              id="destination-platform"
              className={SELECT_BASE_CLASS_NAME}
              value={destinationPlatform}
              onChange={handleDestinationPlatformChange}
            >
              <option value="">Select destination</option>
              {PLATFORM_OPTIONS.map((option) => {
                const isDisabled = option.value === sourcePlatform;

                return (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={isDisabled}
                  >
                    {isDisabled
                      ? `${option.label} (selected as source)`
                      : option.label}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label
              className="text-xs font-medium tracking-wide text-copy-secondary"
              htmlFor="playlist-selection"
            >
              Playlist selection
            </label>
            <select id="playlist-selection" className={SELECT_BASE_CLASS_NAME}>
              <option value="">Select playlist</option>
              <option value="favorites">Favorites (Placeholder)</option>
              <option value="commute">Daily Commute (Placeholder)</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end pt-1">
          <button
            type="button"
            className="inline-flex items-center rounded-xl border border-transparent bg-brand px-4 py-2 text-sm font-semibold text-copy-primary shadow-sm shadow-base/25 transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-base"
          >
            Start Transfer
          </button>
        </div>
      </div>
    </section>
  );
}
