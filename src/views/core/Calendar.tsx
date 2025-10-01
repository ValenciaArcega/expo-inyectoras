// // import { View } from "react-native"

// // const Calendar = function(){
// //     return <View>

// //     </View>
// // }
// // export default Calendar;

// //1 columna de das con scrolling
// import React from "react";
// import { View, Text, FlatList, StyleSheet } from "react-native";

// const Calendar = () => {
//   const today = new Date();
//   const currentDay = today.getDate();
//   const currentMonth = today.getMonth();
//   const currentYear = today.getFullYear();

// //   días del mes
//   const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
//   const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
//     const date = new Date(currentYear, currentMonth, i + 1);
//     const dayOfWeek = date.toLocaleDateString("es-MX", { weekday: "short" });
//     return { dayOfWeek, date: i + 1 };
//   });

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={daysArray}
//         horizontal
//         keyExtractor={(item) => item.date.toString()}
//         renderItem={({ item }) => (
//           <View
//             style={[
//               styles.dayBox,
//               item.date === currentDay && styles.todayBox,
//             ]}
//           >
//             <Text style={styles.dayText}>{item.dayOfWeek}</Text>
//             <Text
//               style={[
//                 styles.dateText,
//                 item.date === currentDay && styles.todayText,
//               ]}
//             >
//               {item.date}
//             </Text>
//           </View>
//         )}
//         showsHorizontalScrollIndicator={false}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginVertical: 20,
//   },
//   dayBox: {
//     padding: 10,
//     marginHorizontal: 5,
//     backgroundColor: "#f0f0f0",
//     borderRadius: 10,
//     alignItems: "center",
//     width: 60,
//   },
//   todayBox: {
//     backgroundColor: "#4CAF50",
//   },
//   dayText: {
//     fontSize: 12,
//     color: "#333",
//   },
//   dateText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   todayText: {
//     color: "#fff",
//   },
// });

// export default Calendar;

//Este codigo es con la fila debajo del celular
// import React, { useState } from "react";
// import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, Button, } from "react-native";

// type Event = { title: string; day: number; start: number; end: number };

// const hours = Array.from({ length: 24 }, (_, i) => i); // 24 horas

// const Calendar: React.FC = () => {
//     const today = new Date();
//     const currentDay = today.getDate();
//     const currentMonth = today.getMonth();
//     const currentYear = today.getFullYear();

//     // Días del mes actual
//     const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
//     const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
//         const date = new Date(currentYear, currentMonth, i + 1);
//         const dayOfWeek = date.toLocaleDateString("es-MX", { weekday: "short" });
//         return { dayOfWeek, date: i + 1 };
//     });

//     const [events, setEvents] = useState<Event[]>([]);
//     const [showForm, setShowForm] = useState(false);
//     const [newEvent, setNewEvent] = useState<Event>({
//         title: "", day: currentDay - 1, start: 8, end: 9,
//     });

//     const addEvent = () => {
//         if (!newEvent.title) return Alert.alert("Error", "Agrega un título");
//         setEvents([...events, newEvent]);
//         setShowForm(false);
//         setNewEvent({ title: "", day: currentDay - 1, start: 8, end: 9 });
//     };

//     const handleCellPress = (day: number, hour: number) => {
//         setNewEvent({ ...newEvent, day, start: hour, end: hour + 1 });
//         setShowForm(true);
//     };

//     const EventBox: React.FC<{ title: string; duration: number }> = ({
//         title,
//         duration,
//     }) => (
//         <View
//             style={{
//                 backgroundColor: "#4A90E2",
//                 borderRadius: 5,
//                 padding: 3,
//                 height: duration * 60,
//             }}
//         >
//             <Text style={{ color: "white", fontSize: 12 }}>{title}</Text>
//         </View>
//     );

//     const HourCell: React.FC<{ hour: number }> = ({ hour }) => (
//         <View style={{ width: 55, alignItems: "flex-end", paddingRight: 5 }}>
//             <Text style={{ fontSize: 12, color: "#999" }}>
//                 {hour === 0 ? "12 a.m." : hour < 12 ? `${hour} a.m.` : hour === 12 ? "12 p.m." : `${hour - 12} p.m.`}
//             </Text>
//         </View>
//     );

//     return (
//         <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 20 }}>
//             {/* Encabezado de días con scroll lateral */}
//             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                 <View
//                     style={{
//                         flexDirection: "row",
//                         borderBottomWidth: 1,
//                         borderColor: "#ddd",
//                         paddingBottom: 5,
//                     }}
//                 >
//                     <View style={{ width: 55 }} />
//                     {daysArray.map((item, idx) => (
//                         <View
//                             key={idx}
//                             style={{
//                                 width: 100,
//                                 padding: 5,
//                                 alignItems: "center",
//                                 backgroundColor:
//                                     item.date === currentDay ? "#4CAF50" : "transparent",
//                                 borderRadius: item.date === currentDay ? 10 : 0,
//                             }}
//                         >
//                             <Text style={{ fontSize: 12, color: "#333" }}>
//                                 {item.dayOfWeek}
//                             </Text>
//                             <Text
//                                 style={{
//                                     fontSize: 14,
//                                     fontWeight: "bold",
//                                     color: item.date === currentDay ? "#fff" : "#333",
//                                 }}
//                             >
//                                 {item.date}
//                             </Text>
//                         </View>
//                     ))}
//                 </View>
//             </ScrollView>

//             {/* Cuerpo con scroll lateral + vertical */}
//             <ScrollView horizontal>
//                 <ScrollView>
//                     {hours.map((h, hi) => (
//                         <View
//                             key={hi}
//                             style={{
//                                 flexDirection: "row",
//                                 borderBottomWidth: 1,
//                                 borderColor: "#eee",
//                                 minHeight: 60,
//                             }}
//                         >
//                             {/* Columna fija con la hora */}
//                             <HourCell hour={h} />

//                             {/* Columnas de días */}
//                             {daysArray.map((day, di) => (
//                                 <TouchableOpacity
//                                     key={di}
//                                     style={{
//                                         width: 100,
//                                         borderLeftWidth: 1,
//                                         borderColor: "#eee",
//                                         padding: 2,
//                                     }}
//                                     onPress={() => handleCellPress(di, h)}
//                                 >
//                                     {events
//                                         .filter((ev) => ev.day === di && ev.start === h)
//                                         .map((ev, idx) => (
//                                             <EventBox
//                                                 key={idx}
//                                                 title={ev.title}
//                                                 duration={ev.end - ev.start}
//                                             />
//                                         ))}
//                                 </TouchableOpacity>
//                             ))}
//                         </View>
//                     ))}
//                 </ScrollView>
//             </ScrollView>

//             {/* Formulario flotante */}
//             {showForm && (
//                 <View
//                     style={{
//                         position: "absolute",
//                         top: 0,
//                         left: 0,
//                         right: 0,
//                         bottom: 0,
//                         backgroundColor: "rgba(0,0,0,0.5)",
//                         justifyContent: "center",
//                         alignItems: "center",
//                     }}
//                 >
//                     <View
//                         style={{
//                             backgroundColor: "#fff",
//                             padding: 20,
//                             borderRadius: 10,
//                             width: "80%",
//                         }}
//                     >
//                         <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
//                             Nuevo evento
//                         </Text>
//                         <TextInput
//                             placeholder="Título del evento"
//                             value={newEvent.title}
//                             onChangeText={(t) => setNewEvent({ ...newEvent, title: t })}
//                             style={{
//                                 borderWidth: 1,
//                                 borderColor: "#ccc",
//                                 borderRadius: 5,
//                                 padding: 8,
//                                 marginBottom: 10,
//                             }}
//                         />
//                         <Button title="Guardar" onPress={addEvent} />
//                         <Button
//                             title="Cancelar"
//                             color="red"
//                             onPress={() => setShowForm(false)}
//                         />
//                     </View>
//                 </View>
//             )}
//         </View>
//     );
// };

// export default Calendar;



//este es con (SafeAreaView)

// import React, { useState } from "react";
// import {Text, ScrollView, TouchableOpacity, Alert, TextInput, Button, View,} from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// type Event = { title: string; day: number; start: number; end: number };

// const hours = Array.from({ length: 24 }, (_, i) => i); // 24 horas

// const Calendar: React.FC = () => {
//   const today = new Date();
//   const currentDay = today.getDate();
//   const currentMonth = today.getMonth();
//   const currentYear = today.getFullYear();

//   Días del mes actual
//   const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
//   const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
//     const date = new Date(currentYear, currentMonth, i + 1);
//     const dayOfWeek = date.toLocaleDateString("es-MX", { weekday: "short" });
//     return { dayOfWeek, date: i + 1 };
//   });

//   const [events, setEvents] = useState<Event[]>([]);
//   const [showForm, setShowForm] = useState(false);
//   const [newEvent, setNewEvent] = useState<Event>({
//     title: "",
//     day: currentDay - 1,
//     start: 8,
//     end: 9,
//   });

//   const addEvent = () => {
//     if (!newEvent.title) return Alert.alert("Error", "Agrega un título");
//     setEvents([...events, newEvent]);
//     setShowForm(false);
//     setNewEvent({ title: "", day: currentDay - 1, start: 8, end: 9 });
//   };

//   const handleCellPress = (day: number, hour: number) => {
//     setNewEvent({ ...newEvent, day, start: hour, end: hour + 1 });
//     setShowForm(true);
//   };

//   const EventBox: React.FC<{ title: string; duration: number }> = ({
//     title,
//     duration,
//   }) => (
//     <View
//       style={{
//         backgroundColor: "#4A90E2",
//         borderRadius: 5,
//         padding: 3,
//         height: duration * 60,
//       }}
//     >
//       <Text style={{ color: "white", fontSize: 12 }}>{title}</Text>
//     </View>
//   );

//   const HourCell: React.FC<{ hour: number }> = ({ hour }) => (
//     <View style={{ width: 55, alignItems: "flex-end", paddingRight: 5 }}>
//       <Text style={{ fontSize: 12, color: "#999" }}>
//         {hour === 0
//           ? "12 a.m."
//           : hour < 12
//           ? `${hour} a.m.`
//           : hour === 12
//           ? "12 p.m."
//           : `${hour - 12} p.m.`}
//       </Text>
//     </View>
//   );

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
//       {/* Encabezado de días con scroll lateral */}
//       <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//         <View
//           style={{
//             flexDirection: "row",
//             borderBottomWidth: 1,
//             borderColor: "#ddd",
//             paddingBottom: 5,
//           }}
//         >
//           <View style={{ width: 55 }} />
//           {daysArray.map((item, idx) => (
//             <View
//               key={idx}
//               style={{
//                 width: 100,
//                 padding: 5,
//                 alignItems: "center",
//                 backgroundColor:
//                   item.date === currentDay ? "#4CAF50" : "transparent",
//                 borderRadius: item.date === currentDay ? 10 : 0,
//               }}
//             >
//               <Text style={{ fontSize: 12, color: "#333" }}>
//                 {item.dayOfWeek}
//               </Text>
//               <Text
//                 style={{
//                   fontSize: 14,
//                   fontWeight: "bold",
//                   color: item.date === currentDay ? "#fff" : "#333",
//                 }}
//               >
//                 {item.date}
//               </Text>
//             </View>
//           ))}
//         </View>
//       </ScrollView>

//       {/* Cuerpo con scroll lateral + vertical */}
//       <ScrollView horizontal>
//         <ScrollView>
//           {hours.map((h, hi) => (
//             <View
//               key={hi}
//               style={{
//                 flexDirection: "row",
//                 borderBottomWidth: 1,
//                 borderColor: "#eee",
//                 minHeight: 60,
//               }}
//             >
//               {/* Columna fija con la hora */}
//               <HourCell hour={h} />

//               {/* Columnas de días */}
//               {daysArray.map((day, di) => (
//                 <TouchableOpacity
//                   key={di}
//                   style={{
//                     width: 100,
//                     borderLeftWidth: 1,
//                     borderColor: "#eee",
//                     padding: 2,
//                   }}
//                   onPress={() => handleCellPress(di, h)}
//                 >
//                   {events
//                     .filter((ev) => ev.day === di && ev.start === h)
//                     .map((ev, idx) => (
//                       <EventBox
//                         key={idx}
//                         title={ev.title}
//                         duration={ev.end - ev.start}
//                       />
//                     ))}
//                 </TouchableOpacity>
//               ))}
//             </View>
//           ))}
//         </ScrollView>
//       </ScrollView>

//       {/* Formulario flotante */}
//       {showForm && (
//         <View
//           style={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: "rgba(0,0,0,0.5)",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <View
//             style={{
//               backgroundColor: "#fff",
//               padding: 20,
//               borderRadius: 10,
//               width: "80%",
//             }}
//           >
//             <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
//               Nuevo evento
//             </Text>
//             <TextInput
//               placeholder="Título del evento"
//               value={newEvent.title}
//               onChangeText={(t) => setNewEvent({ ...newEvent, title: t })}
//               style={{
//                 borderWidth: 1,
//                 borderColor: "#ccc",
//                 borderRadius: 5,
//                 padding: 8,
//                 marginBottom: 10,
//               }}
//             />
//             <Button title="Guardar" onPress={addEvent} />
//             <Button
//               title="Cancelar"
//               color="red"
//               onPress={() => setShowForm(false)}
//             />
//           </View>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// };

// export default Calendar;
import React, { useState, useRef } from "react";
import {Text, ScrollView, TouchableOpacity, Alert, TextInput, Button, View, NativeSyntheticEvent, NativeScrollEvent,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Event = { title: string; day: number; start: number; end: number };

const hours = Array.from({ length: 24 }, (_, i) => i); // 24 horas

const Calendar: React.FC = () => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Días del mes actual
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(currentYear, currentMonth, i + 1);
        const dayOfWeek = date.toLocaleDateString("es-MX", { weekday: "short" });
        return { dayOfWeek, date: i + 1 };
    });

    const [events, setEvents] = useState<Event[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [newEvent, setNewEvent] = useState<Event>({
        title: "",
        day: currentDay - 1,
        start: 8,
        end: 9,
    });

    // sincronizar scroll
    const headerScrollRef = useRef<ScrollView | null>(null);
    const bodyScrollRef = useRef<ScrollView | null>(null);

    // Evita bucle infinito (cuando un scroll llama al otro)
    const isSyncing = useRef(false);

    const syncScroll = (
        ref: React.RefObject<ScrollView | null>,
        event: NativeSyntheticEvent<NativeScrollEvent>
    ) => {
        if (isSyncing.current) return;
        isSyncing.current = true;

        ref.current?.scrollTo({
            x: event.nativeEvent.contentOffset.x,
            animated: false,
        });

        setTimeout(() => {
            isSyncing.current = false;
        }, 0);
    };

    const addEvent = () => {
        if (!newEvent.title) return Alert.alert("Error", "Agrega un título");
        setEvents([...events, newEvent]);
        setShowForm(false);
        setNewEvent({ title: "", day: currentDay - 1, start: 8, end: 9 });
    };

    const handleCellPress = (day: number, hour: number) => {
        setNewEvent({ ...newEvent, day, start: hour, end: hour + 1 });
        setShowForm(true);
    };

    const EventBox: React.FC<{ title: string; duration: number }> = ({
        title,
        duration,
    }) => (
        <View
            style={{
                backgroundColor: "#BFECF5",
                borderRadius: 5,
                padding: 3,
                height: duration * 60,
            }}
        >
            <Text style={{ color: "#72A9C2", fontSize: 12, fontWeight: "bold" }}>{title}</Text>
        </View>
    );

    const HourCell: React.FC<{ hour: number }> = ({ hour }) => (
        <View style={{ width: 55, alignItems: "flex-end", paddingRight: 5 }}>
            <Text style={{ fontSize: 12, color: "#999" }}>
                {hour === 0
                    ? "12 a.m."
                    : hour < 12
                        ? `${hour} a.m.`
                        : hour === 12
                            ? "12 p.m."
                            : `${hour - 12} p.m.`}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            {/* días con scroll sincronizado */}
            <ScrollView
                horizontal
                ref={headerScrollRef}
                showsHorizontalScrollIndicator={false}
                onScroll={(e) => syncScroll(bodyScrollRef, e)}
                scrollEventThrottle={16}
            >
                <View
                    style={{
                        flexDirection: "row",
                        borderBottomWidth: 1,
                        borderColor: "#ddd",
                        paddingBottom: 5,
                    }}
                >
                    <View style={{ width: 55 }} />
                    {daysArray.map((item, idx) => (
                        <View
                            key={idx}
                            style={{
                                width: 100,
                                padding: 5,
                                alignItems: "center",
                                backgroundColor:
                                    item.date === currentDay ? "#4CAF50" : "transparent",
                                borderRadius: item.date === currentDay ? 10 : 0,
                            }}
                        >
                            <Text style={{ fontSize: 12, color: "#333" }}>
                                {item.dayOfWeek}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: "bold",
                                    color: item.date === currentDay ? "#fff" : "#333",
                                }}
                            >
                                {item.date}
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* scroll sincronizado */}
            <ScrollView
                horizontal
                ref={bodyScrollRef}
                onScroll={(e) => syncScroll(headerScrollRef, e)}
                scrollEventThrottle={16}
            >
                <ScrollView>
                    {hours.map((h, hi) => (
                        <View
                            key={hi}
                            style={{
                                flexDirection: "row",
                                borderBottomWidth: 1,
                                borderColor: "#eee",
                                minHeight: 60,
                            }}
                        >
                            <HourCell hour={h} />
                            {daysArray.map((day, di) => (
                                <TouchableOpacity
                                    key={di}
                                    style={{
                                        width: 100,
                                        borderLeftWidth: 1,
                                        borderColor: "#eee",
                                        padding: 2,
                                    }}
                                    onPress={() => handleCellPress(di, h)}
                                >
                                    {events
                                        .filter((ev) => ev.day === di && ev.start === h)
                                        .map((ev, idx) => (
                                            <EventBox
                                                key={idx}
                                                title={ev.title}
                                                duration={ev.end - ev.start}
                                            />
                                        ))}
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                </ScrollView>
            </ScrollView>

            {/* Formulario flotante */}
            {showForm && (
                <View
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "#fff",
                            padding: 20,
                            borderRadius: 10,
                            width: "80%",
                        }}
                    >
                        <Text
                            style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
                        >
                            Nuevo evento
                        </Text>
                        <TextInput
                            placeholder="Título del evento"
                            value={newEvent.title}
                            onChangeText={(t) => setNewEvent({ ...newEvent, title: t })}
                            placeholderTextColor="#ccc" 
                            style={{
                                borderWidth: 1,
                                borderColor: "#ccc",
                                borderRadius: 5,
                                padding: 8,
                                marginBottom: 10,
                            }}
                        />
                        <Button title="Guardar" onPress={addEvent} />
                        <Button title="Cancelar" color="red" onPress={() => setShowForm(false)}
                        />
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

export default Calendar;
