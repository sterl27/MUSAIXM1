import React from 'react';
import UnifiedPageLayout from '@/components/layout/UnifiedPageLayout';
import ComplexityScoring from '@/components/ComplexityScoring';

export default function ComplexityScoringPage() {
  return (
    <UnifiedPageLayout 
      title="AI-Powered Lyric Complexity Scoring"
      description="Analyze the linguistic sophistication, structural complexity, and creative depth of your lyrics using advanced AI"
    >
      <ComplexityScoring className="w-full" />
    </UnifiedPageLayout>
  );
}