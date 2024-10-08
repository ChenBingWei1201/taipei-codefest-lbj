import { useExercise } from "@/contexts/useExercise";
import { CourtType } from "@/shared/type";
import { MapPin } from "lucide-react";
import { distance } from "@/lib/utils";

function Court({ court }: { court: CourtType }) {
  const {
    setSelectedCourt,
    setIsExpanded,
    setIsVisible,
    setIsCourtInfoVisible,
    setViewState,
    userLocation,
  } = useExercise();
  const handleClick = () => {
    setIsCourtInfoVisible(false);
    setSelectedCourt(court);
    setIsExpanded(false);
    setIsVisible(false);
    setViewState({
      latitude: court.lat - 0.002,
      longitude: court.lng,
      zoom: 16,
    });
    setTimeout(() => {
      setIsCourtInfoVisible(true);
    }, 200);
  };
  return (
    <div
      className="flex flex-col border-gray-200 border-b p-2 gap-2 cursor-pointer"
      onClick={handleClick}
    >
      <p className="text-xl flex flex-row underline font-semibold">
        {court.name.length > 15 ? court.name.slice(0, 14) + " ..." : court.name}
      </p>
      <p className="flex flex-row gap-1">
        <MapPin size={20} />
        <span className="underline">
          {court.location.length > 20
            ? court.location.slice(0, 19) + " ..."
            : court.location}
        </span>
      </p>
      <p className="flex flex-row text-gray-500">
        {distance(
          userLocation.latitude,
          userLocation.longitude,
          court?.lat,
          court?.lng,
        ).toFixed(2)}
        公里
      </p>
    </div>
  );
}

export default Court;
