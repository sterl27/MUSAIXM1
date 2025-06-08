import jsPDF from 'jspdf';

interface ComplexityScore {
  overall: number;
  linguistic: number;
  structural: number;
  semantic: number;
  creative: number;
  grade: string;
  insights: string[];
  suggestions: string[];
  timestamp?: Date;
}

interface PDFReportData {
  lyrics: string;
  complexityScore: ComplexityScore;
  improvedLyrics?: string;
  artistName?: string;
  songTitle?: string;
}

export class AdvancedPDFGenerator {
  private doc: jsPDF;
  private currentY: number = 20;
  private pageHeight: number;
  private margin: number = 20;
  private lineHeight: number = 6;

  constructor() {
    this.doc = new jsPDF();
    this.pageHeight = this.doc.internal.pageSize.height;
  }

  async generateComplexityReport(data: PDFReportData): Promise<void> {
    this.setupDocument();
    this.addHeader(data);
    this.addComplexityAnalysis(data.complexityScore);
    this.addVisualScoreChart(data.complexityScore);
    this.addOriginalLyrics(data.lyrics);
    
    if (data.improvedLyrics) {
      this.addImprovedLyrics(data.improvedLyrics);
      this.addImprovementComparison(data);
    }
    
    this.addInsightsAndSuggestions(data.complexityScore);
    this.addFooter();
  }

  private setupDocument(): void {
    this.doc.setProperties({
      title: 'Musaix Rap Pro - Lyric Complexity Analysis',
      subject: 'AI-Powered Lyric Analysis Report',
      author: 'Musaix Rap Pro',
      creator: 'Musaix Rap Pro Platform'
    });
    this.doc.setFont('helvetica');
  }

  private addHeader(data: PDFReportData): void {
    // Musaix logo area (placeholder for brand colors)
    this.doc.setFillColor(63, 81, 181); // Musaix purple
    this.doc.rect(this.margin, this.currentY, 170, 3, 'F');
    this.currentY += 8;

    // Title
    this.doc.setFontSize(24);
    this.doc.setTextColor(63, 81, 181);
    this.doc.text('Musaix Rap Pro', this.margin, this.currentY);
    
    this.currentY += 8;
    this.doc.setFontSize(16);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text('AI-Powered Lyric Complexity Analysis Report', this.margin, this.currentY);
    
    this.currentY += 15;
    
    // Song info
    if (data.songTitle || data.artistName) {
      this.doc.setFontSize(12);
      this.doc.setTextColor(60, 60, 60);
      if (data.songTitle) {
        this.doc.text(`Song: ${data.songTitle}`, this.margin, this.currentY);
        this.currentY += this.lineHeight;
      }
      if (data.artistName) {
        this.doc.text(`Artist: ${data.artistName}`, this.margin, this.currentY);
        this.currentY += this.lineHeight;
      }
      this.currentY += 8;
    }
    
    // Analysis date
    this.doc.setFontSize(10);
    this.doc.setTextColor(128, 128, 128);
    const date = data.complexityScore.timestamp || new Date();
    this.doc.text(`Generated: ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`, this.margin, this.currentY);
    
    this.currentY += 15;
  }

  private addComplexityAnalysis(score: ComplexityScore): void {
    this.checkPageBreak(50);
    
    // Section header
    this.doc.setFillColor(255, 64, 129); // Musaix pink
    this.doc.rect(this.margin, this.currentY - 2, 170, 12, 'F');
    
    this.doc.setFontSize(14);
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('COMPLEXITY ANALYSIS', this.margin + 3, this.currentY + 6);
    this.currentY += 15;
    
    // Overall score
    this.doc.setFontSize(12);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(`Overall Complexity Score: ${score.overall}/100`, this.margin, this.currentY);
    
    this.doc.setFontSize(16);
    this.doc.setTextColor(255, 64, 129);
    this.doc.text(`Grade: ${score.grade}`, this.margin + 100, this.currentY);
    
    this.currentY += 12;
  }

  private addVisualScoreChart(score: ComplexityScore): void {
    this.checkPageBreak(60);
    
    const scores = [
      { label: 'Linguistic', value: score.linguistic, color: [255, 64, 129] },
      { label: 'Structural', value: score.structural, color: [171, 71, 188] },
      { label: 'Semantic', value: score.semantic, color: [255, 193, 7] },
      { label: 'Creative', value: score.creative, color: [63, 81, 181] }
    ];
    
    this.doc.setFontSize(12);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text('Detailed Score Breakdown:', this.margin, this.currentY);
    this.currentY += 10;
    
    scores.forEach((item, index) => {
      this.checkPageBreak(12);
      
      // Label
      this.doc.setTextColor(0, 0, 0);
      this.doc.text(`${item.label}:`, this.margin, this.currentY);
      
      // Score value
      this.doc.setTextColor(item.color[0], item.color[1], item.color[2]);
      this.doc.text(`${item.value}/100`, this.margin + 60, this.currentY);
      
      // Progress bar background
      const barX = this.margin + 100;
      const barY = this.currentY - 3;
      const barWidth = 80;
      const barHeight = 6;
      
      this.doc.setFillColor(240, 240, 240);
      this.doc.rect(barX, barY, barWidth, barHeight, 'F');
      
      // Progress bar fill
      const progressWidth = (item.value / 100) * barWidth;
      this.doc.setFillColor(item.color[0], item.color[1], item.color[2]);
      this.doc.rect(barX, barY, progressWidth, barHeight, 'F');
      
      this.currentY += 10;
    });
    
    this.currentY += 8;
  }

  private addOriginalLyrics(lyrics: string): void {
    this.checkPageBreak(30);
    
    // Section header
    this.doc.setFillColor(171, 71, 188); // Purple
    this.doc.rect(this.margin, this.currentY - 2, 170, 12, 'F');
    
    this.doc.setFontSize(14);
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('ORIGINAL LYRICS', this.margin + 3, this.currentY + 6);
    this.currentY += 15;
    
    this.addLyricsContent(lyrics);
    this.currentY += 10;
  }

  private addImprovedLyrics(improvedLyrics: string): void {
    this.checkPageBreak(30);
    
    // Section header
    this.doc.setFillColor(76, 175, 80); // Green for improved
    this.doc.rect(this.margin, this.currentY - 2, 170, 12, 'F');
    
    this.doc.setFontSize(14);
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('AI-ENHANCED LYRICS', this.margin + 3, this.currentY + 6);
    this.currentY += 15;
    
    this.addLyricsContent(improvedLyrics);
    this.currentY += 10;
  }

  private addLyricsContent(lyrics: string): void {
    this.doc.setFontSize(10);
    this.doc.setTextColor(60, 60, 60);
    
    const lines = lyrics.split('\n');
    const maxWidth = this.doc.internal.pageSize.width - (this.margin * 2);
    
    lines.forEach(line => {
      this.checkPageBreak(this.lineHeight);
      
      if (line.trim() === '') {
        this.currentY += this.lineHeight / 2;
        return;
      }
      
      const wrappedLines = this.doc.splitTextToSize(line, maxWidth);
      wrappedLines.forEach((wrappedLine: string) => {
        this.checkPageBreak(this.lineHeight);
        this.doc.text(wrappedLine, this.margin, this.currentY);
        this.currentY += this.lineHeight;
      });
    });
  }

  private addImprovementComparison(data: PDFReportData): void {
    this.checkPageBreak(40);
    
    // Section header
    this.doc.setFillColor(255, 193, 7); // Yellow
    this.doc.rect(this.margin, this.currentY - 2, 170, 12, 'F');
    
    this.doc.setFontSize(14);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text('IMPROVEMENT ANALYSIS', this.margin + 3, this.currentY + 6);
    this.currentY += 15;
    
    this.doc.setFontSize(11);
    this.doc.setTextColor(60, 60, 60);
    
    const improvements = [
      '✓ Enhanced vocabulary sophistication and linguistic complexity',
      '✓ Improved structural patterns and advanced rhyme schemes',
      '✓ Deeper semantic layers and metaphorical content',
      '✓ Increased creative innovation and artistic expression',
      '✓ Optimized flow patterns and rhythmic consistency'
    ];
    
    improvements.forEach(improvement => {
      this.checkPageBreak(this.lineHeight);
      this.doc.text(improvement, this.margin, this.currentY);
      this.currentY += this.lineHeight;
    });
    
    this.currentY += 10;
  }

  private addInsightsAndSuggestions(score: ComplexityScore): void {
    this.checkPageBreak(30);
    
    // AI Insights section
    if (score.insights.length > 0) {
      this.doc.setFillColor(63, 81, 181); // Blue
      this.doc.rect(this.margin, this.currentY - 2, 170, 12, 'F');
      
      this.doc.setFontSize(14);
      this.doc.setTextColor(255, 255, 255);
      this.doc.text('AI INSIGHTS', this.margin + 3, this.currentY + 6);
      this.currentY += 15;
      
      this.doc.setFontSize(10);
      this.doc.setTextColor(60, 60, 60);
      
      score.insights.forEach(insight => {
        this.checkPageBreak(this.lineHeight * 2);
        const wrappedText = this.doc.splitTextToSize(`• ${insight}`, this.doc.internal.pageSize.width - (this.margin * 2));
        wrappedText.forEach((line: string) => {
          this.doc.text(line, this.margin, this.currentY);
          this.currentY += this.lineHeight;
        });
      });
      
      this.currentY += 8;
    }
    
    // Suggestions section
    if (score.suggestions.length > 0) {
      this.checkPageBreak(20);
      
      this.doc.setFillColor(255, 152, 0); // Orange
      this.doc.rect(this.margin, this.currentY - 2, 170, 12, 'F');
      
      this.doc.setFontSize(14);
      this.doc.setTextColor(255, 255, 255);
      this.doc.text('IMPROVEMENT SUGGESTIONS', this.margin + 3, this.currentY + 6);
      this.currentY += 15;
      
      this.doc.setFontSize(10);
      this.doc.setTextColor(60, 60, 60);
      
      score.suggestions.forEach(suggestion => {
        this.checkPageBreak(this.lineHeight * 2);
        const wrappedText = this.doc.splitTextToSize(`• ${suggestion}`, this.doc.internal.pageSize.width - (this.margin * 2));
        wrappedText.forEach((line: string) => {
          this.doc.text(line, this.margin, this.currentY);
          this.currentY += this.lineHeight;
        });
      });
    }
  }

  private addFooter(): void {
    const pageCount = this.doc.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      
      // Footer line
      this.doc.setDrawColor(200, 200, 200);
      this.doc.line(this.margin, this.doc.internal.pageSize.height - 20, 
                   this.doc.internal.pageSize.width - this.margin, this.doc.internal.pageSize.height - 20);
      
      this.doc.setFontSize(8);
      this.doc.setTextColor(128, 128, 128);
      
      // Page number
      this.doc.text(
        `Page ${i} of ${pageCount}`,
        this.doc.internal.pageSize.width - 30,
        this.doc.internal.pageSize.height - 10
      );
      
      // Footer text
      this.doc.text(
        'Generated by Musaix Rap Pro - AI-Powered Lyric Enhancement Platform | www.musaix.com',
        this.margin,
        this.doc.internal.pageSize.height - 10
      );
    }
  }

  private checkPageBreak(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - 30) {
      this.doc.addPage();
      this.currentY = 20;
    }
  }

  save(filename: string): void {
    this.doc.save(filename);
  }

  output(): string {
    return this.doc.output('datauristring');
  }
}

// Export function for easy use
export async function downloadAdvancedComplexityReport(data: PDFReportData): Promise<void> {
  const generator = new AdvancedPDFGenerator();
  await generator.generateComplexityReport(data);
  
  const timestamp = new Date().toISOString().split('T')[0];
  const songTitle = data.songTitle ? data.songTitle.toLowerCase().replace(/\s+/g, '-') : 'lyrics';
  const filename = `musaix-${songTitle}-complexity-report-${timestamp}.pdf`;
  
  generator.save(filename);
}