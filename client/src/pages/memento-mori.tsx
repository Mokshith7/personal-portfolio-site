import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, RefreshCw } from "lucide-react";
import html2canvas from "html2canvas";

const MY_AGE = 25;
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

function WeekGrid({ weeksLived }: { weeksLived: number }) {
  return (
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
  );
}

export default function MementoMori() {
  const myWeeksLived = calculateWeeksLived(getBirthDateFromAge(MY_AGE));
  const myYearsLived = Math.floor(myWeeksLived / WEEKS_PER_YEAR);
  const myRemainingWeeks = TOTAL_WEEKS - myWeeksLived;
  const myRemainingYears = Math.floor(myRemainingWeeks / WEEKS_PER_YEAR);

  const [userAge, setUserAge] = useState<number>(25);
  const [userWeeksLived, setUserWeeksLived] = useState<number | null>(null);
  const userBoardRef = useRef<HTMLDivElement>(null);

  const handleGenerate = useCallback(() => {
    const birthDate = getBirthDateFromAge(userAge);
    const weeks = calculateWeeksLived(birthDate);
    setUserWeeksLived(weeks);
  }, [userAge]);

  const handleDownload = useCallback(async () => {
    if (!userBoardRef.current) return;
    
    try {
      const canvas = await html2canvas(userBoardRef.current, {
        backgroundColor: "#1a1a1a",
        scale: 2,
      });
      
      const link = document.createElement("a");
      link.download = `memento-mori-${userAge}years.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Failed to download:", error);
    }
  }, [userAge]);

  const userYearsLived = userWeeksLived ? Math.floor(userWeeksLived / WEEKS_PER_YEAR) : 0;
  const userRemainingWeeks = userWeeksLived ? TOTAL_WEEKS - userWeeksLived : 0;
  const userRemainingYears = userWeeksLived ? Math.floor(userRemainingWeeks / WEEKS_PER_YEAR) : 0;

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

      <div className="grid lg:grid-cols-[1fr,320px] gap-8">
        <div>
          <div className="mb-6">
            <h2 className="font-serif text-xl font-semibold text-center mb-2">My Life in Weeks</h2>
            <p className="text-sm text-muted-foreground text-center mb-4">
              {LIFE_EXPECTANCY} years = {TOTAL_WEEKS.toLocaleString()} weeks
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary rounded-sm" />
                <span>Weeks Lived: <strong>{myWeeksLived.toLocaleString()}</strong> ({myYearsLived} years)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-muted-foreground/30 rounded-sm" />
                <span>Weeks Remaining: <strong>{myRemainingWeeks.toLocaleString()}</strong> ({myRemainingYears} years)</span>
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-lg p-6" data-testid="memento-board-main">
            <WeekGrid weeksLived={myWeeksLived} />
            
            <div className="text-center mt-6 text-sm text-muted-foreground italic">
              "You could leave life right now. Let that determine what you do and say and think."
              <br />
              <span className="text-xs">— Marcus Aurelius</span>
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Generate Your Board</CardTitle>
              <CardDescription>Create your own life-in-weeks visualization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="age">Your Age</Label>
                <Input
                  id="age"
                  type="number"
                  min={1}
                  max={LIFE_EXPECTANCY}
                  value={userAge}
                  onChange={(e) => setUserAge(Math.min(LIFE_EXPECTANCY, Math.max(1, parseInt(e.target.value) || 1)))}
                  data-testid="input-age"
                />
              </div>
              <Button onClick={handleGenerate} className="w-full" data-testid="button-generate">
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate
              </Button>

              {userWeeksLived !== null && (
                <>
                  <div 
                    ref={userBoardRef}
                    className="bg-background p-4 rounded-lg border"
                    data-testid="memento-board-user"
                  >
                    <div className="text-center mb-3">
                      <p className="text-xs text-muted-foreground">Your Life at Age {userAge}</p>
                    </div>
                    
                    <div className="text-xs space-y-1 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-primary rounded-sm" />
                        <span>Lived: {userWeeksLived.toLocaleString()} weeks ({userYearsLived} yrs)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border border-muted-foreground/30 rounded-sm" />
                        <span>Remaining: {userRemainingWeeks.toLocaleString()} weeks ({userRemainingYears} yrs)</span>
                      </div>
                    </div>

                    <div className="scale-[0.4] origin-top-left h-[280px] overflow-hidden">
                      <WeekGrid weeksLived={userWeeksLived} />
                    </div>
                    
                    <div className="text-center text-[10px] text-muted-foreground italic mt-2">
                      "Memento Mori"
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    onClick={handleDownload} 
                    className="w-full"
                    data-testid="button-download"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download as Image
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
