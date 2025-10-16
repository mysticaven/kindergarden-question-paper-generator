import heroImage from '@assets/generated_images/Kindergarten_educational_activities_illustration_76fb9cba.png';

export default function Hero() {
  return (
    <div className="relative w-full h-[60vh] min-h-[400px] overflow-hidden rounded-2xl">
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Kindergarten educational activities" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
      </div>
      
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
          Kindergarten Question Paper Maker
        </h1>
        <p className="text-lg sm:text-xl text-white/90 max-w-2xl mb-8">
          Create engaging question papers with AI-generated images in one click
        </p>
      </div>
    </div>
  );
}
