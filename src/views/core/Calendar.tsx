import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator, Image, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useReminder, CalendarItem } from "@/src/context/ReminderContext";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing, } from "react-native-reanimated";

const Calendar: React.FC = () => {
    const { addReminder, updateReminder, deleteReminder, items } = useReminder();

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false); // modal para agregar/editar
    const [modalDayVisible, setModalDayVisible] = useState(false);

    const [newTitle, setNewTitle] = useState("");
    const [selectedHour, setSelectedHour] = useState<number>(1);
    const [selectedMinute, setSelectedMinute] = useState<number>(0);
    const [selectedAMPM, setSelectedAMPM] = useState<"AM" | "PM">("AM");
    const [selectedNotification, setSelectedNotification] = useState<string>("10 min antes");
    const [selectedCategory, setSelectedCategory] = useState<string>("inyeccion");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [showHourList, setShowHourList] = useState(false);
    const [showMinuteList, setShowMinuteList] = useState(false);
    const [showNotifList, setShowNotifList] = useState(false);
    const [showCatList, setShowCatList] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [showPersonal, setshowPersonal] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true)
    const scale = useSharedValue(1);


    useEffect(function () {
        sugarLoader()
    }, [])

    // const [showDeptList, setShowDeptList] = useState(false);
    const [showPersonalList, setshowPersonalList] = useState(false);

    const addItem = () => {
        if (!newTitle || newTitle.trim() === "") {
            Alert.alert("Campos requeridos", "Asegúrate de ingresar un nombre válido.");
            return;
        }

        if (!selectedDate) {
            Alert.alert("Fecha no seleccionada", "Por favor selecciona una fecha antes de guardar.");
            return;
        }

        const newItem: CalendarItem = {
            title: newTitle.trim(),
            date: selectedDate,
            type: "recordatorio",
            hour: selectedHour,
            minute: selectedMinute,
            ampm: selectedAMPM,
            notification: selectedNotification,
            category: selectedCategory,
        };

        if (editingIndex !== null) {
            updateReminder(editingIndex, newItem);
        } else {
            addReminder(newItem);
        }

        resetForm();
    };

    const resetForm = () => {
        setNewTitle("");
        setSelectedHour(1);
        setSelectedMinute(0);
        setSelectedAMPM("AM");
        setSelectedNotification("10 min antes");
        setSelectedCategory("inyeccion");
        setEditingIndex(null);
        setModalVisible(false);
    };

    const scrollRef = useRef<ScrollView>(null);
    const [monthPositions, setMonthPositions] = useState<number[]>([]);
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    useEffect(() => {
        scale.value = withRepeat(
            withSequence(
                withTiming(1.2, { duration: 600, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));
    useEffect(() => {
        if (scrollRef.current && monthPositions.length === 12) {
            scrollRef.current.scrollTo({ y: monthPositions[currentMonth], animated: false });
        }
    }, [monthPositions]);

    const renderMonth = (month: number, year: number) => {
        const firstDay = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();
        const daysArray: (number | null)[] = Array(firstDay)
            .fill(null)
            .concat(Array.from({ length: totalDays }, (_, i) => i + 1));

        const monthName = new Date(year, month).toLocaleDateString("es-MX", {
            month: "long",
            year: "numeric",
        });
        const formattedMonth =
            monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase();
        const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

        return (
            <View
                key={`${year}-${month}`}
                style={{ marginBottom: 40 }}
                onLayout={(e) => {
                    const y = e.nativeEvent.layout.y;
                    setMonthPositions((prev) => {
                        const copy = [...prev];
                        copy[month] = y;
                        return copy;
                    });
                }}
            >
                <Text className="text-[22px] font-bold text-center mb-2">
                    {formattedMonth}
                </Text>
                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                    {weekDays.map((d, i) => (
                        <Text key={i} style={{ fontWeight: "bold", width: 40, textAlign: "center", color: "#000000" }}>
                            {d}
                        </Text>
                    ))}
                </View>

                <View className="flex-row flex-wrap">
                    {daysArray.map((day, i) => {
                        if (!day)
                            return <View key={i} style={{ width: "14.2%", minHeight: 120 }} />;

                        const dateStr = `${year}-${month + 1}-${day}`;
                        const isToday =
                            day === today.getDate() &&
                            month === today.getMonth() &&
                            year === today.getFullYear();
                        const dayItems = items.filter((it) => it.date === dateStr && it.type === "recordatorio");

                        return (
                            <View
                                key={i}
                                style={{
                                    width: "14.2%",
                                    borderWidth: 0.5,
                                    borderColor: "#eee",
                                    minHeight: 120,
                                    padding: 4,
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                }}
                            >
                                <Text className={`fond-bold text-center rounded-full w-6 h-6 leading-6 self-center ${isToday
                                    ? `bg-[#f03e3e] dark:bg-zinc-700 text-white`
                                    : 'bg-white dark:bg-[#495057] text-black'}`}
                                >
                                    {day}
                                </Text>

                                <View style={{ height: 6 }} />

                                {dayItems.length > 0 ? (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSelectedDate(dateStr);
                                            setModalDayVisible(true);
                                        }}
                                        style={{
                                            alignSelf: "center",
                                            marginTop: 5,
                                            paddingHorizontal: 8,
                                            paddingVertical: 6,
                                            borderRadius: 6,
                                            backgroundColor: "#F3FFEE",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            borderWidth: 1,
                                            borderColor: "#BBECA5",
                                        }}
                                    >
                                        <Text style={{ fontSize: 12, fontWeight: "bold", marginRight: 6 }}>Ver</Text>
                                        <View
                                            style={{
                                                backgroundColor: "#4CAF50",
                                                borderRadius: 10,
                                                paddingHorizontal: 6,
                                                paddingVertical: 2,
                                                minWidth: 20,
                                                alignItems: "center",
                                            }}
                                        >
                                            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 12 }}>
                                                {dayItems.length}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSelectedDate(dateStr);
                                            setEditingIndex(null);
                                            setNewTitle("");
                                            setModalVisible(true); // abre modal para nuevo recordatorio
                                        }}
                                        style={{
                                            width: "100%",
                                            minHeight: 60,
                                            marginTop: 5,
                                            borderRadius: 6,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: "transparent",
                                        }}
                                    />
                                )}
                            </View>
                        );
                    })}
                </View>
            </View>
        );
    };

    const sugarLoader = async function () {
        await new Promise(r => setTimeout(r, 2000));
        setIsLoading(false);
    }

    if (isLoading) return <View className="flex-1 justify-center items-center">
        <Animated.Image
            source={require("@/assets/images/golden/calendar.png")}
            className="w-28 h-28"
            style={animatedStyle}
        />

        <Text className="italic mt-4 font-semibold text-lg">
            Cargando Eventos...</Text>
        <Text className="text-gray-400 text-center mt-1 mb-5 w-72 text-sm">
            “Sincronizando tus eventos con el calendario para mantenerlo actualizado…”
        </Text>
        <ActivityIndicator />
    </View>

    const remindersForSelectedDay = items.filter((it) => it.date === selectedDate && it.type === "recordatorio");

    return (
        <View className="flex-1 bg-[#fff] dark:bg-[#495057]">
            <Animated.View style={[{ right: 20, position: "absolute", top: 20, zIndex: 10 }]}>
                <TouchableOpacity onPress={() => setMenuVisible(true)}>
                    <Ionicons name="menu-outline" size={40} color="#000000" />
                </TouchableOpacity>
            </Animated.View>

            <ScrollView ref={scrollRef}>
                {Array.from({ length: 12 }, (_, i) => renderMonth(i, currentYear))}
            </ScrollView>

            {/* Modal de lista */}
            {modalDayVisible && selectedDate && (
                <View className="absolute inset-0 justify-center items-center bg-[rgba(0,0,0,0.4)]">
                    <View className="bg-white rounded-xl p-5 w-3/4 max-h-[85%]">
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                                Evento - {selectedDate ? formatDate(selectedDate) : "-"}
                            </Text>

                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setEditingIndex(null);
                                        setNewTitle("");
                                        setModalVisible(true); // abre modal de agregar
                                        setModalDayVisible(false);
                                    }}
                                    style={{
                                        padding: 8,
                                        borderRadius: 8,
                                        backgroundColor: "#4CAF50",
                                        marginRight: 8,
                                    }}
                                >
                                    <Ionicons name="add" size={20} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setModalDayVisible(false)} style={{ padding: 8 }}>
                                    <Ionicons name="close" size={22} color="#333" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <ScrollView style={{ marginTop: 12 }}>
                            {remindersForSelectedDay.length === 0 ? (
                                <Text style={{ textAlign: "center", color: "#777", marginTop: 20 }}>
                                    No hay recordatorios en este día.
                                </Text>
                            ) : (
                                remindersForSelectedDay.map((it) => {
                                    const realIndex = items.findIndex((item) => item === it);
                                    return (
                                        <View
                                            key={realIndex}
                                            className="bg-[#fafafa] p-3 rounded-md mb-2.5 border border-[#eee]"
                                        >
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ fontWeight: "bold", fontSize: 15 }}>{it.title}</Text>
                                                    <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", marginTop: 6 }}>
                                                        <Text style={{ color: "#666" }}>
                                                            Recordatorio - {it.hour}:{it.minute?.toString().padStart(2, "0")} {it.ampm}
                                                        </Text>
                                                        {it.notification && (
                                                            <Text style={{ color: "#666", fontSize: 13, marginLeft: 8 }}>
                                                                ({it.notification})
                                                            </Text>
                                                        )}
                                                        {it.category && (
                                                            <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 8 }}>
                                                                <View
                                                                    style={{
                                                                        width: 10,
                                                                        height: 10,
                                                                        borderRadius: 5,
                                                                        backgroundColor:
                                                                            it.category === "inyeccion" ? "#94d82d" :
                                                                                it.category === "pintura" ? "#9684B8" :
                                                                                    it.category === "ensamble" ? "#FFD166" :
                                                                                        it.category === "sistemas" ? "#15aabf" :
                                                                                            "#666" // color por defecto
                                                                    }}
                                                                />
                                                                <Text style={{ color: "#666", fontSize: 13 }}>
                                                                    {it.category === "inyeccion" ? "Inyección" :
                                                                        it.category === "pintura" ? "Pintura" :
                                                                            it.category === "ensamble" ? "Ensamble" :
                                                                                it.category === "sistemas" ? "Sistemas" :
                                                                                    "Desconocido"}
                                                                </Text>

                                                            </View>
                                                        )}
                                                    </View>
                                                </View>

                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setEditingIndex(realIndex);
                                                            setNewTitle(it.title);
                                                            setSelectedHour(it.hour ?? 1);
                                                            setSelectedMinute(it.minute ?? 0);
                                                            setSelectedAMPM(it.ampm ?? "AM");
                                                            setSelectedNotification(it.notification ?? "10 min antes");
                                                            setSelectedCategory(it.category ?? "inyeccion");
                                                            setModalVisible(true); // abre modal para editar
                                                            setModalDayVisible(false);
                                                        }}
                                                        style={{ marginRight: 8 }}
                                                    >
                                                        <Ionicons name="pencil" size={20} color="#333" />
                                                    </TouchableOpacity>

                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            Alert.alert("Confirmar", "¿Eliminar este recordatorio?", [
                                                                { text: "Cancelar", style: "cancel" },
                                                                {
                                                                    text: "Eliminar",
                                                                    style: "destructive",
                                                                    onPress: () => deleteReminder(realIndex),
                                                                },
                                                            ])
                                                        }
                                                    >
                                                        <Ionicons name="trash" size={20} color="#F03E3E" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    );
                                })
                            )}
                        </ScrollView>
                    </View>
                </View>
            )}
            {/* Modal agregar/editar */}
            {modalVisible && (
                <View className="absolute inset-0 justify-center items-center bg-[rgba(0,0,0,0.4)]">
                    <ScrollView
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: 10,
                            padding: 20,
                            width: "80%",
                            maxHeight: "80%",
                        }}
                        contentContainerStyle={{ paddingBottom: 60 }}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: "bold",
                                marginBottom: 10,
                                textAlign: "center",
                            }}
                        >
                            {editingIndex !== null ? "Editar" : "Nuevo"} Evento
                        </Text>

                        <Text style={{ marginBottom: 6, color: "#333" }}>
                            Fecha: {selectedDate || "-"}
                        </Text>

                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: "#ccc",
                                padding: 10,
                                borderRadius: 6,
                                marginBottom: 10,
                            }}
                            placeholder="Título"
                            value={newTitle}
                            onChangeText={setNewTitle}
                        />

                        {/* COMBOBOX: HORA */}
                        <Text style={{ fontWeight: "bold", marginBottom: 6, marginTop: 10 }}>Hora:</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                            {/* Hora */}
                            <View style={{ flex: 1, marginRight: 5 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setShowHourList(!showHourList);
                                        setShowMinuteList(false);
                                        setShowNotifList(false);
                                        setShowCatList(false);
                                    }}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: "#ccc",
                                        borderRadius: 6,
                                        paddingVertical: 8,
                                        paddingHorizontal: 10,
                                        backgroundColor: "#fff",
                                    }}
                                >
                                    <Text>{selectedHour.toString().padStart(2, "0")}</Text>
                                </TouchableOpacity>
                                {showHourList && (
                                    <ScrollView
                                        style={{
                                            borderWidth: 1,
                                            borderColor: "#ccc",
                                            borderRadius: 6,
                                            backgroundColor: "#fff",
                                            position: "absolute",
                                            width: "100%",
                                            zIndex: 999,
                                            maxHeight: 150,
                                        }}
                                        nestedScrollEnabled={true}
                                    >
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                                            <TouchableOpacity
                                                key={h}
                                                onPress={() => {
                                                    setSelectedHour(h);
                                                    setShowHourList(false);
                                                }}
                                                style={{
                                                    paddingVertical: 8,
                                                    paddingHorizontal: 10,
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: "#eee",
                                                }}
                                            >
                                                <Text>{h.toString().padStart(2, "0")}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                )}
                            </View>

                            {/* Minutos */}
                            <View style={{ flex: 1, marginRight: 5 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setShowMinuteList(!showMinuteList);
                                        setShowHourList(false);
                                        setShowNotifList(false);
                                        setShowCatList(false);
                                    }}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: "#ccc",
                                        borderRadius: 6,
                                        paddingVertical: 8,
                                        paddingHorizontal: 10,
                                        backgroundColor: "#fff",
                                    }}
                                >
                                    <Text>{selectedMinute.toString().padStart(2, "0")}</Text>
                                </TouchableOpacity>
                                {showMinuteList && (
                                    <ScrollView
                                        style={{
                                            borderWidth: 1,
                                            borderColor: "#ccc",
                                            borderRadius: 6,
                                            backgroundColor: "#fff",
                                            position: "absolute",
                                            width: "100%",
                                            zIndex: 999,
                                            maxHeight: 200,
                                        }}
                                        nestedScrollEnabled={true}
                                    >
                                        {Array.from({ length: 59 }, (_, i) => i + 1).map((m) => (
                                            <TouchableOpacity
                                                key={m}
                                                onPress={() => {
                                                    setSelectedMinute(m);
                                                    setShowMinuteList(false);
                                                }}
                                                style={{
                                                    paddingVertical: 8,
                                                    paddingHorizontal: 10,
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: "#eee",
                                                }}
                                            >
                                                <Text>{m.toString().padStart(2, "0")}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                )}
                            </View>

                            {/* AM/PM */}
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity
                                    onPress={() => setSelectedAMPM(selectedAMPM === "AM" ? "PM" : "AM")}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: "#ccc",
                                        borderRadius: 6,
                                        paddingVertical: 8,
                                        paddingHorizontal: 10,
                                        backgroundColor: "#fff",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text>{selectedAMPM}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* COMBOBOX: NOTIFICACIÓN */}
                        <Text style={{ fontWeight: "bold", marginBottom: 6, marginTop: 10 }}>Notificación:</Text>
                        <View>
                            <TouchableOpacity
                                onPress={() => {
                                    setShowNotifList(!showNotifList);
                                    setShowHourList(false);
                                    setShowMinuteList(false);
                                    setShowCatList(false);
                                }}
                                style={{
                                    borderWidth: 1,
                                    borderColor: "#ccc",
                                    borderRadius: 6,
                                    paddingVertical: 8,
                                    paddingHorizontal: 10,
                                    backgroundColor: "#fff",
                                }}
                            >
                                <Text>{selectedNotification}</Text>
                            </TouchableOpacity>
                            {showNotifList && (
                                <ScrollView
                                    style={{
                                        borderWidth: 1,
                                        borderColor: "#ccc",
                                        borderRadius: 6,
                                        backgroundColor: "#fff",
                                        position: "absolute",
                                        width: "100%",
                                        zIndex: 999,
                                        maxHeight: 150,
                                    }}
                                    nestedScrollEnabled={true}
                                >
                                    {["-", "10 min", "30 min", "1 hora"].map((opt) => (
                                        <TouchableOpacity
                                            key={opt}
                                            onPress={() => {
                                                setSelectedNotification(opt);
                                                setShowNotifList(false);
                                            }}
                                            style={{
                                                paddingVertical: 8,
                                                paddingHorizontal: 10,
                                                borderBottomWidth: 1,
                                                borderBottomColor: "#eee",
                                            }}
                                        >
                                            <Text>{opt}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )}
                        </View>

                        {/* COMBOBOX: CATEGORÍA */}
                        <Text style={{ fontWeight: "bold", marginBottom: 6, marginTop: 10 }}>Área:</Text>
                        <View>
                            <TouchableOpacity
                                onPress={() => {
                                    setShowCatList(!showCatList);
                                    setShowHourList(false);
                                    setShowMinuteList(false);
                                    setShowNotifList(false);
                                }}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    borderWidth: 1,
                                    borderColor: "#ccc",
                                    borderRadius: 6,
                                    paddingVertical: 8,
                                    paddingHorizontal: 10,
                                    backgroundColor: "#fff",
                                }}
                            >
                                {/* Solo muestra el círculo si no es "-" */}
                                {selectedCategory !== "-" && (
                                    <View
                                        style={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: 5,
                                            backgroundColor:
                                                selectedCategory === "inyeccion"
                                                    ? "#94d82d"
                                                    : selectedCategory === "pintura"
                                                        ? "#9684B8"
                                                        : selectedCategory === "ensamble"
                                                            ? "#FFD166"
                                                            : selectedCategory === "sistemas"
                                                                ? "#15aabf"
                                                                : "#666", // color por defecto
                                            marginRight: 8,
                                        }}
                                    />
                                )}
                                <Text>{selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</Text>
                            </TouchableOpacity>
                            {showCatList && (
                                <ScrollView
                                    style={{
                                        borderWidth: 1,
                                        borderColor: "#ccc",
                                        borderRadius: 6,
                                        backgroundColor: "#fff",
                                        position: "absolute",
                                        width: "100%",
                                        zIndex: 999,
                                        maxHeight: 250,
                                    }}
                                    nestedScrollEnabled={true}
                                >

                                    {[
                                        { value: "-", label: "-" },
                                        { value: "inyeccion", label: "Inyección", color: "#94d82d" },
                                        { value: "pintura", label: "Pintura", color: "#9684B8" },
                                        { value: "ensamble", label: "Ensamble", color: "#FFD166" },
                                        { value: "sistemas", label: "Sistemas", color: "#15aabf" },

                                    ].map((cat) => (
                                        <TouchableOpacity
                                            key={cat.value}
                                            onPress={() => {
                                                setSelectedCategory(cat.value);
                                                setShowCatList(false);
                                            }}
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                paddingVertical: 8,
                                                paddingHorizontal: 10,
                                                borderBottomWidth: 1,
                                                borderBottomColor: "#eee",
                                            }}
                                        >
                                            <View
                                                style={{
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: 5,
                                                    backgroundColor: cat.color,
                                                    marginRight: 8,
                                                }}
                                            />
                                            <Text>{cat.label}</Text>

                                        </TouchableOpacity>

                                    ))}
                                </ScrollView>
                            )}
                        </View>
                        {/* COMBOBOX: DEPARTAMENTO */}
                        <Text style={{ fontWeight: "bold", marginBottom: 6, marginTop: 10 }}>Personal Solicitado:</Text>
                        <View>
                            <TouchableOpacity
                                onPress={() => {
                                    setshowPersonalList(!showPersonalList);
                                    setShowCatList(false);
                                    setShowHourList(false);
                                    setShowMinuteList(false);
                                    setShowNotifList(false);
                                }}
                                style={{
                                    borderWidth: 1,
                                    borderColor: "#ccc",
                                    borderRadius: 6,
                                    paddingVertical: 8,
                                    paddingHorizontal: 10,
                                    backgroundColor: "#fff",
                                }}
                            >
                                <Text>
                                    {showPersonal
                                        ? showPersonal.charAt(0).toUpperCase() + showPersonal.slice(1).replace("_", " ")
                                        : ""}
                                </Text>
                            </TouchableOpacity>

                            {showPersonalList && (
                                <ScrollView
                                    style={{
                                        borderWidth: 1,
                                        borderColor: "#ccc",
                                        borderRadius: 6,
                                        backgroundColor: "#fff",
                                        position: "absolute",
                                        width: "100%",
                                        zIndex: 999,
                                        maxHeight: 250,
                                    }}
                                    nestedScrollEnabled={true}
                                >
                                    {[
                                        "-", "Gerencia", "Administración", "Contaduría", "Operación de maquinaria", "Sistemas", "Recursos humanos", "Producción",
                                    ].map((dept) => (
                                        <TouchableOpacity
                                            key={dept}
                                            onPress={() => {
                                                setshowPersonal(dept);
                                                setshowPersonalList(false);
                                            }}
                                            style={{
                                                paddingVertical: 8,
                                                paddingHorizontal: 10,
                                                borderBottomWidth: 1,
                                                borderBottomColor: "#eee",
                                            }}
                                        >
                                            <Text>{dept}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )}
                        </View>

                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 20 }}>
                            <TouchableOpacity onPress={resetForm} style={{ paddingVertical: 10, paddingHorizontal: 25, borderRadius: 8 }}>
                                <Text style={{ color: "#9D0E0E", fontWeight: "bold" }}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={addItem} style={{ paddingVertical: 10, paddingHorizontal: 25, borderRadius: 8 }}>
                                <Text style={{ color: "#257D55", fontWeight: "bold" }}>Guardar</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </View>
            )}
            {menuVisible && (
                <View className="absolute inset-0 bg-[rgba(0,0,0,0.4)] flex-row justify-start z-[100]">
                    {/* Fondo clickeable para cerrar menú */}
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => setMenuVisible(false)}
                    />

                    {/* Contenedor del menú */}
                    <Animated.View
                        style={{
                            width: 250,
                            backgroundColor: "#fff",
                            padding: 20,
                            shadowColor: "#000",
                            shadowOpacity: 0.3,
                            shadowOffset: { width: 0, height: 2 },
                            shadowRadius: 5,
                            elevation: 8,
                            borderTopRightRadius: 12,
                            borderBottomRightRadius: 12,
                        }}
                    >
                        {/* Header del menú */}
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Menú</Text>
                            <TouchableOpacity onPress={() => setMenuVisible(false)}>
                                <Ionicons name="close" size={28} color="#000" />
                            </TouchableOpacity>
                        </View>

                        {/* Items del menú */}
                        <ScrollView>
                            {[
                                { icon: "calendar-outline", text: "Mes" },
                                { icon: "calendar-outline", text: "Semana" },
                                { icon: "calendar-outline", text: "Día" },
                            ].map((item, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        paddingVertical: 10,
                                        borderBottomWidth: 1,
                                        borderBottomColor: "#eee",
                                    }}
                                >
                                    <Ionicons
                                        name={item.icon as keyof typeof Ionicons.glyphMap}
                                        size={22}
                                        color="#000"
                                        style={{ marginRight: 12 }}
                                    />
                                    <Text style={{ fontSize: 16 }}>{item.text}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </Animated.View>
                </View>
            )}
        </View>
    );
};

export default Calendar;
