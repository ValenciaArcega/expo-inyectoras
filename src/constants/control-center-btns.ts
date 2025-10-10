
import {Ionicons} from "@expo/vector-icons";

type BtnControlCenter = {
    id: number,
    title: string,
    subtitle: string,
    route: string
    icon: keyof typeof Ionicons.glyphMap,
    iconColor: string,
}

export const buttonsData: BtnControlCenter[]  = [
    {
        id: 1,
        title: "Andon Inyección",
        subtitle: "Monitorea producción con alertas para una respuesta rápida.",
        route: 'Andon',
        icon: "storefront-sharp",
        iconColor: 'text-teal-500',
    },
    {
        id: 2,
        title: "Cronograma",
        subtitle: "Planifica actividades y recordatorios que optimizan tu gestión diaria.",
        icon: "calendar-outline",
        route: 'Calendar',
        iconColor: 'text-yellow-400',
    },
    {
        id: 3,
        title: "Dashboard",
        subtitle: "Observa el rendimiento de tus procesos en tiempo real.",
        icon: "bar-chart-sharp",
        route:'Dashboard',
        iconColor: 'text-orange-400',
    },
    {
        id: 4,
        title: "Variables de Inyección",
        subtitle: "Supervisa los parámetros clave del proceso con precisión total.",
        icon: "construct",
        route:'Variables',
        iconColor: 'text-red-400',
    },
    {
        id: 5,
        title: "Visor de Archivos",
        subtitle: "Visualiza y gestiona tus documentos de forma rápida y segura.",
        icon: "documents",
        route:'FileViewer',
        iconColor: 'text-cyan-500',
    },
];