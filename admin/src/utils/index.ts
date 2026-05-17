// Tạo chữ viết tắt từ tên (VD: "Global Logistics" -> "GL")
export function getInitials(name: string): string {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
}

// Hiển thị thời gian tương đối (VD: "5 phút trước")
export function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Vừa xong';
    if (mins < 60) return `${mins} phút trước`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} giờ trước`;
    return `${Math.floor(hrs / 24)} ngày trước`;
}

// Format ngày theo kiểu Việt Nam
export function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('vi-VN');
}

// Format lương (VD: 20000000 -> "20M")
export function formatSalary(min: number, max: number): string {
    if (!min && !max) return 'Thỏa thuận';
    return `${(min / 1_000_000).toFixed(0)}M – ${(max / 1_000_000).toFixed(0)}M`;
}

// Parse requirements từ JSON array hoặc plain text
export function parseRequirements(raw: string): string[] {
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
    } catch { }
    return raw.split('\n').filter(Boolean);
}

// Auto-generate slug từ tên tiếng Việt
export function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
}