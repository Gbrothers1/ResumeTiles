import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Trophy, Mail, Briefcase } from 'lucide-react';
import { useMobileDetection } from '@/hooks/use-mobile-detection';
import { useSwipeGesture } from '@/hooks/use-swipe-gesture';

export interface TileSection {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  content: React.ReactNode;
  color: string;
  accentColor: string;
}

interface SwipeableTilesProps {
  sections: TileSection[];
  onRewardUnlocked: () => void;
  personalInfo: { name: string; email: string };
}

export function SwipeableTiles({ sections, onRewardUnlocked, personalInfo }: SwipeableTilesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasCompletedJourney, setHasCompletedJourney] = useState(false);
  const [viewedSections, setViewedSections] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const { isMobile, deviceType } = useMobileDetection();

  // Track section views for reward system
  useEffect(() => {
    const currentSection = sections[currentIndex];
    if (currentSection) {
      setViewedSections(prev => new Set([...prev, currentSection.id]));
    }
  }, [currentIndex, sections]);

  // Check if journey is complete (viewed all sections) and not swiped back
  useEffect(() => {
    const allSectionsViewed = viewedSections.size === sections.length;
    const isAtLastSection = currentIndex === sections.length - 1;
    
    if (allSectionsViewed && isAtLastSection && !hasCompletedJourney) {
      setHasCompletedJourney(true);
      onRewardUnlocked();
    } else if (hasCompletedJourney && currentIndex < sections.length - 1) {
      // Hide reward if user swipes back from last section
      setHasCompletedJourney(false);
    }
  }, [viewedSections, sections.length, hasCompletedJourney, onRewardUnlocked, currentIndex]);

  const goToNext = () => {
    if (currentIndex < sections.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToSection = (index: number) => {
    setCurrentIndex(index);
  };

  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
    threshold: 50
  });

  const handleHireMe = () => {
    window.open(`mailto:${personalInfo.email}?subject=Let's%20Work%20Together!&body=Hi%20${personalInfo.name},%20I'd%20love%20to%20discuss%20working%20together.`, '_blank');
  };

  const currentSection = sections[currentIndex];
  const progress = ((currentIndex + 1) / sections.length) * 100;

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-white via-ios-gray/20 to-white">
      {/* Progress Bar */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-ios-gray/30">
        <div className="px-5 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-ios-subtle">
              {isMobile ? '👈 Swipe to explore' : '← → Navigate'}
            </span>
            <span className="text-sm text-ios-blue font-medium">
              {currentIndex + 1} of {sections.length}
            </span>
          </div>
          <div className="w-full bg-ios-gray rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-ios-blue to-ios-green h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Tile Container */}
      <div 
        ref={containerRef}
        className="relative overflow-hidden px-5 py-6"
        {...(isMobile ? swipeHandlers : {})}
      >
        {/* Current Tile */}
        <div className="relative">
          <Card className={`${isMobile ? currentSection.color : 'bg-white'} border-0 rounded-ios shadow-2xl transform transition-all duration-500 animate-slide-in-up`}>
            <CardContent className="p-8">
              {/* Tile Header */}
              <div className="flex items-center mb-6">
                <div className={`w-16 h-16 ${currentSection.accentColor} rounded-full flex items-center justify-center shadow-lg mr-4`}>
                  <currentSection.icon className="text-white h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-ios-black">{currentSection.title}</h2>
                  <p className="text-ios-subtle">{currentSection.description}</p>
                </div>
              </div>

              {/* Tile Content */}
              <div className="mb-8">
                {currentSection.content}
              </div>

              {/* Navigation Dots (Mobile) or Buttons (Desktop) */}
              {isMobile ? (
                <div className="flex justify-center space-x-2">
                  {sections.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSection(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentIndex 
                          ? 'bg-ios-blue shadow-lg' 
                          : viewedSections.has(sections[index].id)
                            ? 'bg-ios-green'
                            : 'bg-ios-gray'
                      }`}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <Button
                    onClick={goToPrevious}
                    disabled={currentIndex === 0}
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  
                  <div className="flex space-x-2">
                    {sections.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSection(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentIndex 
                            ? 'bg-ios-blue shadow-lg' 
                            : viewedSections.has(sections[index].id)
                              ? 'bg-ios-green'
                              : 'bg-ios-gray'
                        }`}
                      />
                    ))}
                  </div>

                  <Button
                    onClick={goToNext}
                    disabled={currentIndex === sections.length - 1}
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reward System - Hire Me Button */}
      {hasCompletedJourney && (
        <div className="fixed bottom-6 left-5 right-5 z-50 animate-slide-in-up">
          <Card className="bg-gradient-to-r from-ios-green to-ios-blue border-0 shadow-2xl">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
                  <Trophy className="text-white h-8 w-8" />
                </div>
                <div className="text-white">
                  <h3 className="text-xl font-bold">Journey Complete! 🎉</h3>
                  <p className="text-white/90">Ready to work together?</p>
                </div>
              </div>
              <Button
                onClick={handleHireMe}
                className="w-full bg-white text-ios-green hover:bg-white/90 font-bold py-4 rounded-ios shadow-lg active:scale-95 transition-all duration-200"
              >
                <Briefcase className="mr-2 h-5 w-5" />
                Hire Me Now
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mobile Swipe Hint */}
      {isMobile && currentIndex === 0 && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
          <div className="bg-ios-black/80 text-white px-4 py-2 rounded-full text-sm backdrop-blur-md">
            👈 Swipe left to continue
          </div>
        </div>
      )}

      {/* Quick Contact Float Button (Always Visible) */}
      <div className="fixed bottom-6 right-5 z-40">
        <Button
          onClick={() => window.open(`mailto:${personalInfo.email}`, '_blank')}
          className="w-14 h-14 bg-ios-blue hover:bg-ios-blue/90 text-white rounded-full shadow-lg active:scale-95 transition-transform"
          size="icon"
        >
          <Mail className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}