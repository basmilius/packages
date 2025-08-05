const DB_MAX = 0.0;
const DB_MIN = -30.0;

export function dbFromPercentage(percentage: number): number {
    percentage = Math.max(0, Math.min(100, percentage));

    return (percentage / 100) * (DB_MAX - DB_MIN) + DB_MIN;
}

export function dbToPercentage(db: number): number {
    db = Math.max(DB_MIN, Math.min(DB_MAX, db));

    return ((db - DB_MIN) / (DB_MAX - DB_MIN)) * 100;
}
