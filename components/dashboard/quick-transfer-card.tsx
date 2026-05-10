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
  "mt-2 w-full rounded-xl border border-surface-border bg-elevated px-3 py-2 text-sm text-copy-primary transition-colors hover:border-copy-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-base";

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
    <section className="rounded-2xl border border-surface-border bg-surface p-6">
      <div className="max-w-2xl">
        <h2 className="text-lg font-semibold tracking-tight text-copy-primary">
          Start a playlist transfer
        </h2>
        <p className="mt-2 text-sm text-copy-secondary">
          Choose a source platform, destination platform, and playlist to begin.
        </p>
      </div>
      <div className="mt-6 space-y-4">
        <div className="grid gap-4 lg:grid-cols-3">
          <div>
            <label
              className="text-xs font-medium text-copy-secondary"
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
              className="text-xs font-medium text-copy-secondary"
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
              className="text-xs font-medium text-copy-secondary"
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
            className="inline-flex items-center rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-copy-primary transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-base"
          >
            Start Transfer
          </button>
        </div>
      </div>
    </section>
  );
}
