export declare const ServiceSliderServices: {
    upsertServiceSlider: (payload: any) => Promise<({
        items: {
            number: string;
            createdAt: Date;
            updatedAt: Date;
            category: string;
            image: string;
            id: string;
            description: string | null;
            imageId: string | null;
            title: string;
            order: number;
            sliderId: string;
        }[];
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: string;
        title: string;
    }) | null>;
    getServiceSlider: () => Promise<({
        items: {
            number: string;
            createdAt: Date;
            updatedAt: Date;
            category: string;
            image: string;
            id: string;
            description: string | null;
            imageId: string | null;
            title: string;
            order: number;
            sliderId: string;
        }[];
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: string;
        title: string;
    }) | null>;
};
//# sourceMappingURL=serviceSlider.service.d.ts.map