import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useExercise } from "@/contexts/useExercise.tsx";

const ExerciseRecommendationAssistant = ({
  onSportClick,
}: {
  onSportClick: (id: string) => void;
}) => {
  const { userData } = useExercise();
  const [gender, setGender] = useState(userData.gender);
  const [age, setAge] = useState(userData.age);
  const [weight, setWeight] = useState(userData.weight);
  const [height, setHeight] = useState(userData.height);
  const [recommendedSports, setRecommendedSports] = useState<
    { id: string; name: string }[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);

  const getRecommendation = async () => {
    if (!gender || !age || !weight || !height) {
      alert("請填寫所有欄位以獲得建議。");
      return;
    }
    setIsLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(
        import.meta.env.VITE_GEMINI_API_KEY!,
      );
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Given a ${gender} aged ${age}, weighing ${weight}kg and ${height}cm tall, recommend 2-3 suitable sports or exercises. Return the response as a JSON array of objects, each with 'id' and 'name' properties, also note that the name of the sports should be limited to [籃球,棒球,游泳,健身,羽球,網球,足球,桌球,自行車]. for example: [{"id": "1", "name": "自行車"}, {"id": "2", "name": "游泳"}]`;
      const result = await model.generateContent(prompt);
      const data = result.response;
      setRecommendedSports(JSON.parse(data.text()));
    } catch (error) {
      console.error("Error getting recommendations:", error);
      alert("獲取建議時出錯。請稍後再試。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-11/12 mx-auto px-4 py-6 bg-white rounded-lg">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Bot className="mr-2" />
        運動建議助手
      </h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="gender">性別</Label>
          <Select onValueChange={setGender} value={gender}>
            <SelectTrigger>
              <SelectValue placeholder="選擇您的性別" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">男性</SelectItem>
              <SelectItem value="female">女性</SelectItem>
              <SelectItem value="other">其他</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="age">年齡</Label>
          <Input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="輸入您的年齡"
          />
        </div>
        <div>
          <Label htmlFor="weight">體重 (公斤)</Label>
          <Input
            id="weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="輸入您的體重"
          />
        </div>
        <div>
          <Label htmlFor="height">身高 (公分)</Label>
          <Input
            id="height"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="輸入您的身高"
          />
        </div>
        <Button
          onClick={getRecommendation}
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "獲取中..." : "獲取運動建議"}
        </Button>
        <AnimatePresence>
          {recommendedSports.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {recommendedSports.map((sport) => (
                <motion.div
                  key={sport.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-100 p-4 rounded-md cursor-pointer text-center"
                  onClick={() => onSportClick(sport.name)}
                >
                  {sport.name}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExerciseRecommendationAssistant;
