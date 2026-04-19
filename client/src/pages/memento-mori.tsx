import { Card } from "@/components/ui/card";

const MY_BIRTH_DATE = new Date(2000, 6, 6); // July 6, 2000
const LIFE_EXPECTANCY = 70;
const WEEKS_PER_YEAR = 52;
const TOTAL_WEEKS = LIFE_EXPECTANCY * WEEKS_PER_YEAR;

function calculateWeeksLived(birthDate: Date): number {
  const now = new Date();
  const diffTime = now.getTime() - birthDate.getTime();
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
  return Math.max(0, Math.min(diffWeeks, TOTAL_WEEKS));
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
                className="w-3 text-center text-[7px] text-muted-foreground"
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
                      className={`w-3 h-3 rounded-sm transition-colors ${
                        isCurrentWeek
                          ? "bg-primary ring-1 ring-primary ring-offset-1"
                          : isLived
                          ? "bg-primary"
                          : "border border-muted-foreground/20 bg-muted/30"
                      }`}
                      title={`Year ${yearIndex + 1}, Week ${weekIndex + 1}`}
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
  const weeksLived = calculateWeeksLived(MY_BIRTH_DATE);
  const yearsLived = Math.floor(weeksLived / WEEKS_PER_YEAR);
  const remainingWeeks = TOTAL_WEEKS - weeksLived;
  const remainingYears = Math.floor(remainingWeeks / WEEKS_PER_YEAR);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl font-bold mb-4" data-testid="text-memento-heading">
          Memento Mori
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          "Remember that you will die." This ancient practice reminds us to live
          fully, appreciating each week as the precious gift it is. Each box
          represents one week of a {LIFE_EXPECTANCY}-year life.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary rounded-sm" />
          <span>
            Weeks Lived: <strong>{weeksLived.toLocaleString()}</strong> ({yearsLived} years)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border border-muted-foreground/30 rounded-sm" />
          <span>
            Weeks Remaining: <strong>{remainingWeeks.toLocaleString()}</strong> ({remainingYears} years)
          </span>
        </div>
      </div>

      <Card className="p-6" data-testid="memento-board-main">
        <WeekGrid weeksLived={weeksLived} />

        <div className="text-center mt-6 text-sm text-muted-foreground italic">
          "You could leave life right now. Let that determine what you do and say and think."
          <br />
          <span className="text-xs">— Marcus Aurelius</span>
        </div>
      </Card>
    </div>
  );
}
