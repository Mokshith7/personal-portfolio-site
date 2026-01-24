export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="/images/kintsugi-bowl.png"
            alt="Kintsugi Bowl"
            className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-md"
            data-testid="img-kintsugi-bowl"
          />
        </div>
        
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-foreground" data-testid="text-heading">
            The Art of <span className="text-primary">Kintsugi</span>
          </h1>
          
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg" data-testid="text-description">
            Kintsugi is the Japanese art of repairing broken pottery with lacquer dusted or mixed with powdered gold, silver, or platinum. As a philosophy, it treats breakage and repair as part of the history of an object, rather than something to disguise. It embraces the flawed and imperfect, celebrating the beauty found in the cracks of our lives. Rather than hiding our wounds, we highlight them with gold, transforming our scars into something beautiful and meaningful.
          </p>
        </div>
      </div>
    </div>
  );
}
