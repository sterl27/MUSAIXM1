import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  reportType: 'analysis' | 'improvement' | 'complete';
  artistName?: string;
  songTitle?: string;
}

export class PDFGenerator {
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
    this.addOriginalLyrics(data.lyrics);
    
    if (data.improvedLyrics && data.reportType !== 'analysis') {
      this.addImprovedLyrics(data.improvedLyrics);
      this.addImprovementComparison(data);
    }
    
    this.addInsights(data.complexityScore);
    this.addFooter();
  }

  private setupDocument(): void {
    // Set document properties
    this.doc.setProperties({
      title: 'Musaix Rap Pro - Lyric Complexity Analysis',
      subject: 'AI-Powered Lyric Analysis Report',
      author: 'Musaix Rap Pro',
      creator: 'Musaix Rap Pro Platform'
    });

    // Set default font
    this.doc.setFont('helvetica');
  }

  private addHeader(data: PDFReportData): void {
    // Title
    this.doc.setFontSize(24);
    this.doc.setTextColor(63, 81, 181); // Musaix purple
    this.doc.text('Musaix Rap Pro', this.margin, this.currentY);
    
    this.currentY += 8;
    this.doc.setFontSize(18);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text('Lyric Complexity Analysis Report', this.margin, this.currentY);
    
    this.currentY += 12;
    
    // Song info if provided
    if (data.songTitle || data.artistName) {
      this.doc.setFontSize(12);
      if (data.songTitle) {
        this.doc.text(`Song: ${data.songTitle}`, this.margin, this.currentY);
        this.currentY += this.lineHeight;
      }
      if (data.artistName) {
        this.doc.text(`Artist: ${data.artistName}`, this.margin, this.currentY);
        this.currentY += this.lineHeight;
      }
      this.currentY += 6;
    }
    
    // Analysis date
    this.doc.setFontSize(10);
    this.doc.setTextColor(128, 128, 128);
    const date = data.complexityScore.timestamp || new Date();
    this.doc.text(`Generated: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`, this.margin, this.currentY);
    
    this.currentY += 15;
    this.addSeparatorLine();
  }

  private addComplexityAnalysis(score: ComplexityScore): void {
    this.checkPageBreak(40);
    
    this.doc.setFontSize(16);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text('Complexity Analysis', this.margin, this.currentY);
    this.currentY += 10;
    
    // Overall score with grade
    this.doc.setFontSize(14);
    this.doc.text(`Overall Score: ${score.overall}/100 (Grade: ${score.grade})`, this.margin, this.currentY);
    this.currentY += 8;
    
    // Score breakdown
    this.doc.setFontSize(12);
    const scoreData = [
      { label: 'Linguistic Complexity', value: score.linguistic, color: [255, 64, 129] },
      { label: 'Structural Complexity', value: score.structural, color: [171, 71, 188] },
      { label: 'Semantic Depth', value: score.semantic, color: [255, 193, 7] },
      { label: 'Creative Innovation', value: score.creative, color: [63, 81, 181] }
    ];
    
    scoreData.forEach((item, index) => {
      this.checkPageBreak(15);
      
      // Score label
      this.doc.setTextColor(0, 0, 0);
      this.doc.text(`${item.label}:`, this.margin, this.currentY);
      
      // Score value
      this.doc.setTextColor(item.color[0], item.color[1], item.color[2]);
      this.doc.text(`${item.value}/100`, this.margin + 80, this.currentY);
      
      // Progress bar
      const barWidth = 80;
      const barHeight = 4;
      const barX = this.margin + 120;
      const barY = this.currentY - 3;
      
      // Background bar
      this.doc.setFillColor(240, 240, 240);
      this.doc.rect(barX, barY, barWidth, barHeight, 'F');
      
      // Progress bar
      const progressWidth = (item.value / 100) * barWidth;
      this.doc.setFillColor(item.color[0], item.color[1], item.color[2]);
      this.doc.rect(barX, barY, progressWidth, barHeight, 'F');
      
      this.currentY += 8;
    });
    
    this.currentY += 10;
  }

  private addOriginalLyrics(lyrics: string): void {
    this.checkPageBreak(30);
    
    this.doc.setFontSize(16);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text('Original Lyrics', this.margin, this.currentY);
    this.currentY += 10;
    
    this.addLyricsContent(lyrics);
    this.currentY += 10;
  }

  private addImprovedLyrics(improvedLyrics: string): void {
    this.checkPageBreak(30);
    
    this.doc.setFontSize(16);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text('AI-Enhanced Lyrics', this.margin, this.currentY);
    this.currentY += 10;
    
    this.addLyricsContent(improvedLyrics);
    this.currentY += 10;
  }

  private addLyricsContent(lyrics: string): void {
    this.doc.setFontSize(11);
    this.doc.setTextColor(60, 60, 60);
    
    const lines = lyrics.split('\n');
    const maxWidth = this.doc.internal.pageSize.width - (this.margin * 2);
    
    lines.forEach(line => {
      this.checkPageBreak(this.lineHeight);
      
      if (line.trim() === '') {
        this.currentY += this.lineHeight / 2;
        return;
      }
      
      // Handle long lines by wrapping text
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
    
    this.doc.setFontSize(16);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text('Improvement Analysis', this.margin, this.currentY);
    this.currentY += 10;
    
    this.doc.setFontSize(12);
    this.doc.setTextColor(60, 60, 60);
    
    const improvements = [
      'Enhanced vocabulary sophistication and linguistic complexity',
      'Improved structural patterns and rhyme schemes',
      'Deeper semantic layers and metaphorical content',
      'Increased creative innovation and artistic expression'
    ];
    
    improvements.forEach(improvement => {
      this.checkPageBreak(this.lineHeight);
      this.doc.text(`• ${improvement}`, this.margin, this.currentY);
      this.currentY += this.lineHeight;
    });
    
    this.currentY += 10;
  }

  private addInsights(score: ComplexityScore): void {
    this.checkPageBreak(30);
    
    this.doc.setFontSize(16);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text('AI Insights & Recommendations', this.margin, this.currentY);
    this.currentY += 10;
    
    // Insights
    if (score.insights.length > 0) {
      this.doc.setFontSize(14);
      this.doc.text('Key Insights:', this.margin, this.currentY);
      this.currentY += 8;
      
      this.doc.setFontSize(11);
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
    
    // Suggestions
    if (score.suggestions.length > 0) {
      this.checkPageBreak(20);
      
      this.doc.setFontSize(14);
      this.doc.setTextColor(0, 0, 0);
      this.doc.text('Improvement Suggestions:', this.margin, this.currentY);
      this.currentY += 8;
      
      this.doc.setFontSize(11);
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
        'Generated by Musaix Pro - AI-Powered Lyric Enhancement Platform',
        this.margin,
        this.doc.internal.pageSize.height - 10
      );
    }
  }

  private addSeparatorLine(): void {
    this.doc.setDrawColor(200, 200, 200);
    this.doc.line(this.margin, this.currentY, this.doc.internal.pageSize.width - this.margin, this.currentY);
    this.currentY += 8;
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

// Utility function to generate and download complexity report
export async function downloadComplexityReport(data: PDFReportData): Promise<void> {
  const generator = new PDFGenerator();
  await generator.generateComplexityReport(data);
  
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `musaix-complexity-report-${timestamp}.pdf`;
  
  generator.save(filename);
}