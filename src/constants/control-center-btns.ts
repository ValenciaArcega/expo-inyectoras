
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { BtnControlCenter } from "../types/elements";



export const buttonsData: BtnControlCenter[] = [
    {
        id: 1,
        title: "01.Tablero",
        subtitle: "Visualiza y gestiona tus documentos de forma rápida y segura.",
        icon: "tablet-portrait-sharp",
        route: 'Board',
        iconColor: 'text-red-400',

    },
    {
        id: 2,
        title: "02.Cronograma",
        subtitle: "Planifica actividades y recordatorios que optimizan tu gestión diaria.",
        icon: "calendar-outline",
        route: 'Calendar',
        iconColor: 'text-orange-400',
    },
    {
        id: 3,
        title: "03.Visor de Archivos",
        subtitle: "Visualiza y gestiona tus documentos de forma rápida y segura.",
        icon: "documents",
        route: 'FileViewer',
        iconColor: 'text-yellow-500',
    },
    {
        id: 4,
        title: "04.Variables",
        subtitle: "Supervisa los parámetros clave del proceso con precisión total.",
        icon: "construct",
        route: 'Variables',
        iconColor: 'text-violet-400',
    },
    {
        id: 5,
        title: "05.Dashboard",
        subtitle: "Observa el rendimiento de tus procesos en tiempo real.",
        icon: "bar-chart-sharp",
        route: 'Dashboard',
        iconColor: 'text-blue-400',
    },
    {
        id: 6,
        title: "06.Andon",
        subtitle: "Monitorea producción con alertas para una respuesta rápida.",
        route: 'Andon',
        icon: "storefront-sharp",
        iconColor: 'text-teal-500',
    },
];



