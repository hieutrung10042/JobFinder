export function formatDate(dateStr: string): string {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getFullYear()}`;
}

export function formatDateVN(dateStr: string): string {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('vi-VN');
}

export function getInitials(name: string): string {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
}

export function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Hôm nay';
    if (days === 1) return '1 ngày trước';
    if (days < 7) return `${days} ngày trước`;
    if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
    return `${Math.floor(days / 30)} tháng trước`;
}