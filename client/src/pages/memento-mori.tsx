import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, RefreshCw } from "lucide-react";
import html2canvas from "html2canvas";

const LIFE_EXPECTANCY = 70;
const WEEKS_PER_YEAR = 52;
const TOTAL_WEEKS = LIFE_EXPECTANCY * WEEKS_PER_YEAR;

function calculateWeeksLived(birthDate: Date): number {
  const now = new Date();
  const diffTime = now.getTime() - birthDate.getTime();
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
  return Math.max(0, Math.min(diffWeeks, TOTAL_WEEKS));
}

function getBirthDateFromAge(age: number): Date {
  const now = new Date();
  const birthYear = now.getFullYear() - age;
  return new Date(birthYear, now.getMonth(), now.getDate());
}

export default function MementoMori() {
  const [age, setAge] = useState<number>(25);
  const [weeksLived, setWeeksLived] = useState<number>(() => {
    return age * WEEKS_PER_YEAR;
  });
  const [isGenerated, setIsGenerated] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  const handleGenerate = useCallback(() => {
    const birthDate = getBirthDateFromAge(age);
    const weeks = calculateWeeksLived(birthDate);
    setWeeksLived(weeks);
    setIsGenerated(true);
  }, [age]);

  const handleDownload = useCallback(async () => {
    if (!boardRef.current) return;
    
    try {
      const canvas = await html2canvas(boardRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      
      const link = document.createElement("a");
      link.download = `memento-mori-${age}years.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Failed to download:", error);
    }
  }, [age]);

  const yearsLived = Math.floor(weeksLived / WEEKS_PER_YEAR);
  const remainingWeeks = TOTAL_WEEKS - weeksLived;
  const remainingYears = Math.floor(remainingWeeks / WEEKS_PER_YEAR);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl font-bold mb-4" data-testid="text-memento-heading">
          Memento Mori
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          "Remember that you will die." This ancient practice reminds us to live fully, 
          appreciating each week as the precious gift it is. Each box represents one week of a {LIFE_EXPECTANCY}-year life.
        </p>
      </div>

      <Card className="mb-8 max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-lg">Generate Your Board</CardTitle>
          <CardDescription>Enter your age to see your life in weeks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="age">Your Age</Label>
              <Input
                id="age"
                type="number"
                min={1}
                max={LIFE_EXPECTANCY}
                value={age}
                onChange={(e) => setAge(Math.min(LIFE_EXPECTANCY, Math.max(1, parseInt(e.target.value) || 1)))}
                data-testid="input-age"
              />
            </div>
            <Button onClick={handleGenerate} data-testid="button-generate">
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </div>
        </CardContent>
      </Card>

      {isGenerated && (
        <>
          <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary rounded-sm" />
              <span>Weeks Lived: <strong>{weeksLived.toLocaleString()}</strong> ({yearsLived} years)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border border-muted-foreground/30 rounded-sm" />
              <span>Weeks Remaining: <strong>{remainingWeeks.toLocaleString()}</strong> ({remainingYears} years)</span>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <Button variant="outline" onClick={handleDownload} data-testid="button-download">
              <Download className="h-4 w-4 mr-2" />
              Download as Image
            </Button>
          </div>

          <div 
            ref={boardRef} 
            className="bg-background p-6 rounded-lg"
            data-testid="memento-board"
          >
            <div className="text-center mb-4">
              <h2 className="font-serif text-xl font-semibold">My Life in Weeks</h2>
              <p className="text-sm text-muted-foreground">{LIFE_EXPECTANCY} years = {TOTAL_WEEKS.toLocaleString()} weeks</p>
            </div>
            
            <div className="overflow-x-auto">
              <div className="min-w-fit mx-auto">
                <div className="flex mb-1">
                  <div className="w-8 text-xs text-muted-foreground text-right pr-2">Year</div>
                  <div className="flex gap-px">
                    {Array.from({ length: WEEKS_PER_YEAR }, (_, i) => (
                      <div 
                        key={i} 
                        className="w-2 text-center text-[6px] text-muted-foreground"
                        title={`Week ${i + 1}`}
                      >
                        {(i + 1) % 10 === 0 ? (i + 1) : ""}
                      </div>
                    ))}
                  </div>
                </div>
                
                {Array.from({ length: LIFE_EXPECTANCY }, (_, yearIndex) => {
                  const yearStartWeek = yearIndex * WEEKS_PER_YEAR;
                  
                  return (
                    <div key={yearIndex} className="flex items-center">
                      <div className="w-8 text-xs text-muted-foreground text-right pr-2">
                        {yearIndex + 1}
                      </div>
                      <div className="flex gap-px">
                        {Array.from({ length: WEEKS_PER_YEAR }, (_, weekIndex) => {
                          const absoluteWeek = yearStartWeek + weekIndex;
                          const isLived = absoluteWeek < weeksLived;
                          const isCurrentWeek = absoluteWeek === weeksLived;
                          
                          return (
                            <div
                              key={weekIndex}
                              className={`w-2 h-2 rounded-sm transition-colors ${
                                isCurrentWeek
                                  ? "bg-primary ring-1 ring-primary ring-offset-1"
                                  : isLived
                                  ? "bg-primary"
                                  : "border border-muted-foreground/20 bg-muted/30"
                              }`}
                              title={`Year ${yearIndex + 1}, Week ${weekIndex + 1} (Week ${absoluteWeek + 1} of life)`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-center mt-6 text-sm text-muted-foreground italic">
              "You could leave life right now. Let that determine what you do and say and think."
              <br />
              <span className="text-xs">— Marcus Aurelius</span>
            </div>
          </div>
        </>
      )}

      {!isGenerated && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Enter your age above and click Generate to see your life in weeks.</p>
        </div>
      )}
    </div>
  );
}
