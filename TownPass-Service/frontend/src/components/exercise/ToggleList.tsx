import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useExercise } from "@/contexts/useExercise";
import { cn } from "@/lib/utils";
import { courts, sports } from "@/data";
import Court from "./Court";
import CourtInfo from "./CourtInfo";
import ExerciseRecommendationAssistant from "./RecommendAgent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

function ToggleList() {
  const {
    exercise,
    setExercise,
    isExpanded,
    setIsExpanded,
    isVisible,
    setIsVisible,
    isCourtInfoVisible,
    setIsCourtInfoVisible,
    filteredCourts,
    setFilteredCourts,
    setShowBicycleKML,
    setFocusSingle,
  } = useExercise();
  const [isRecommendationModalOpen, setIsRecommendationModalOpen] =
    useState(false);

  const handleSelectExercise = (sport: string) => {
    setIsVisible(false);
    setIsExpanded(false);
    setIsCourtInfoVisible(false);
    setFocusSingle(false);

    setTimeout(() => {
      setExercise(sport);
      setShowBicycleKML(sport === "🚲 自行車");
      setFilteredCourts(
        courts.filter((court) => court.sports.includes(sport.split(" ")[1])),
      );
      setIsVisible(true);
    }, 200);
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleRecommendationClick = () => {
    setIsRecommendationModalOpen(true);
  };

  const handleSportRecommendation = (sportName: string) => {
    const recommendedSport = sports.find((sport) => sport.name == sportName);
    if (recommendedSport) {
      handleSelectExercise(recommendedSport.icon + " " + recommendedSport.name);
    }
    setIsRecommendationModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col mb-2">
        <div className="w-full flex flex-row gap-2">
          <Select onValueChange={handleSelectExercise} value={exercise}>
            <SelectTrigger className="text-xl">
              <SelectValue placeholder={exercise || "運動一覽"}/>
            </SelectTrigger>
            <SelectContent>
              {sports.map((sport, index) => (
                <SelectItem
                  key={index}
                  value={sport.icon + " " + sport.name}
                  className="text-xl"
                >
                  {sport.icon + " " + sport.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            className="w-3/12 bg-[#5ab4c5] text-white p-1 text-base font-semibold"
            onClick={handleRecommendationClick}
          >
            建議
          </button>
        </div>
      </div>
      <div
        className={cn(
          "w-full fixed inset-x-0 transform transition-transform duration-300 ease-in-out z-50",
          isVisible ? "translate-y-0" : "translate-y-full",
          isExpanded ? "top-0 h-full" : "bottom-0 h-[13%]",
        )}
      >
        {isVisible && (
          <div
            className={cn(
              "flex flex-col gap-4 bg-gray-100 shadow-lg h-full ",
              !isExpanded && "justify-center rounded-t-xl",
            )}
          >
            <div
              className={cn(
                "flex flex-row justify-between items-center",
                isExpanded && "mt-5",
              )}
            >
              <p className="font-semibold text-zinc-950 text-4xl ml-2">
                {exercise}
              </p>
              {exercise.split(" ")[1] !== "自行車" && (
                <>
                  <button className="border border-[#5ab4c5] text-[#5ab4c5] bg-transparent p-2 rounded-full text-sm">
                    {filteredCourts.length} 筆結果
                  </button>
                  <button
                    className="border border-[#5ab4c5] text-[#5ab4c5] bg-transparent p-2 mr-4"
                    onClick={handleExpand}
                  >
                    {isExpanded ? "收回列表" : "展開列表"}
                  </button>
                </>
              )}
            </div>

            {isExpanded && (
              <div className="flex flex-col p-4 gap-2 overflow-scroll">
                {filteredCourts.map((court) => (
                  <Court key={court.K} court={court} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div
        className={cn(
          "w-full fixed inset-x-0 transform transition-transform duration-500 ease-in-out bg-gray-100 rounded-lg z-50",
          isCourtInfoVisible
            ? "translate-y-0 bottom-0 h-[33%]"
            : "translate-y-full",
        )}
      >
        {isCourtInfoVisible && <CourtInfo />}
      </div>
      {isRecommendationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-md w-full">
            <ExerciseRecommendationAssistant
              onSportClick={handleSportRecommendation}
            />
            <button
              className="mt-4 w-full bg-gray-200 text-black p-2 rounded"
              onClick={() => setIsRecommendationModalOpen(false)}
            >
              關閉
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ToggleList;
