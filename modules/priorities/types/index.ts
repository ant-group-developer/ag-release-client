export interface PriorityData {
    id: string;
    nameVi?: string;
    nameEn?: string;
    color: string;
    order_count: number;
    note?: string;
}

export interface PriorityCountData
    extends Pick<PriorityData, 'id' | 'nameVi' | 'nameEn'> {
    count: number;
}
