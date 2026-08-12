"use client";

import {
  useCallback,
  useRef,
  useState,
} from "react";

import {
  GoogleMap,
  Marker,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";

interface EventLocationPickerProps {
  address: string;
  latitude?: number;
  longitude?: number;
  onAddressChange: (value: string) => void;
  onLocationChange: (
    latitude: number,
    longitude: number,
  ) => void;
}

const defaultCenter = {
  lat: 6.5244,
  lng: 3.3792,
};

const mapContainerStyle = {
  width: "100%",
  height: "360px",
};

export default function EventLocationPicker({
  address,
  latitude,
  longitude,
  onAddressChange,
  onLocationChange,
}: EventLocationPickerProps) {
  const { isLoaded, loadError } =
    useJsApiLoader({
      googleMapsApiKey:
        process.env
          .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
      libraries: ["places"],
    });

  const autocompleteRef =
    useRef<google.maps.places.Autocomplete | null>(
      null,
    );

  const [position, setPosition] =
    useState({
      lat:
        latitude ??
        defaultCenter.lat,
      lng:
        longitude ??
        defaultCenter.lng,
    });

  const onAutocompleteLoad =
    useCallback(
      (
        autocomplete: google.maps.places.Autocomplete,
      ) => {
        autocompleteRef.current =
          autocomplete;
      },
      [],
    );

  const onPlaceChanged =
    useCallback(() => {
      const autocomplete =
        autocompleteRef.current;

      if (!autocomplete) {
        return;
      }

      const place =
        autocomplete.getPlace();

      const location =
        place.geometry?.location;

      if (!location) {
        return;
      }

      const lat =
        location.lat();

      const lng =
        location.lng();

      const formattedAddress =
        place.formatted_address ??
        address;

      setPosition({
        lat,
        lng,
      });

      onAddressChange(
        formattedAddress,
      );

      onLocationChange(
        lat,
        lng,
      );
    }, [
      address,
      onAddressChange,
      onLocationChange,
    ]);

  const onMapClick = useCallback(
    (
      event: google.maps.MapMouseEvent,
    ) => {
      if (
        event.latLng == null
      ) {
        return;
      }

      const lat =
        event.latLng.lat();

      const lng =
        event.latLng.lng();

      setPosition({
        lat,
        lng,
      });

      onLocationChange(
        lat,
        lng,
      );
    },
    [onLocationChange],
  );

  if (!process.env
        .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.07] p-5 text-sm text-red-300">
        Google Maps API key is not
        configured.
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.07] p-5 text-sm text-red-300">
        Unable to load Google Maps.
        Check your Google Maps API
        configuration.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-[360px] items-center justify-center rounded-2xl border border-white/10 bg-black/30">
        <div className="text-sm text-white/40">
          Loading map...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-white/70">
          Search Venue Location
        </label>

        <Autocomplete
          onLoad={
            onAutocompleteLoad
          }
          onPlaceChanged={
            onPlaceChanged
          }
        >
          <input
            value={address}
            onChange={(event) =>
              onAddressChange(
                event.target.value,
              )
            }
            placeholder="Search for your venue or address"
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-black/30
              px-4
              py-3.5
              text-sm
              text-white
              outline-none
              transition
              placeholder:text-white/25
              focus:border-[#3E86A4]/60
              focus:ring-1
              focus:ring-[#3E86A4]/20
            "
          />
        </Autocomplete>

        <p className="mt-2 text-xs text-white/35">
          Search for the venue, select the
          correct Google Maps result, or
          click directly on the map.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <GoogleMap
          mapContainerStyle={
            mapContainerStyle
          }
          center={position}
          zoom={15}
          onClick={onMapClick}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          <Marker
            position={position}
          />
        </GoogleMap>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-white/35">
            Selected Coordinates
          </p>

          <p className="mt-1 text-sm text-white/70">
            {position.lat.toFixed(6)},{" "}
            {position.lng.toFixed(6)}
          </p>
        </div>

        <div className="rounded-full border border-[#3E86A4]/30 bg-[#3E86A4]/10 px-3 py-1 text-xs text-[#53A6C7]">
          Location selected
        </div>
      </div>
    </div>
  );
}