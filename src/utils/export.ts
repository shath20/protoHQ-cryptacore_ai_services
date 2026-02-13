
import { Comment } from '../types';

export function convertToCSV(data: Comment[]): string {
    const headers = [
        'ID',
        'Author',
        'Product',
        'Rating',
        'Date',
        'Verified Purchase',
        'Risk Score',
        'Flagged',
        'Indicators',
        'Content'
    ];

    const rows = data.map(comment => [
        comment.id,
        `"${comment.author.replace(/"/g, '""')}"`,
        `"${comment.product.replace(/"/g, '""')}"`,
        comment.rating,
        new Date(comment.timestamp).toLocaleDateString(),
        comment.verifiedPurchase ? 'Yes' : 'No',
        comment.aiScore,
        comment.flagged ? 'Yes' : 'No',
        `"${comment.indicators.join(', ').replace(/"/g, '""')}"`,
        `"${comment.content.replace(/"/g, '""')}"`
    ]);

    return [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');
}

export function downloadCSV(data: Comment[], filename: string) {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
