interface GritterSettings {
    title: string;
    text: string;
    image: string;
    sticky: boolean;
    class_name: string
}

interface GritterMethods {
    add(settings: GritterSettings): void;
}

interface JQueryStatic {
    gritter: GritterMethods;
}