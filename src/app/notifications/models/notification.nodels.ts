export interface NotificationModel {
    id: string;
    type: string;
    message: string;
    referenceId: string;
    isRead: boolean;
    createdAt: string;
}

export interface NotificationPage {
    content: NotificationModel[];
    totalElements: number;
    totalPages: number;
    number: number;
}