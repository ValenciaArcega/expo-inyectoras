import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, Button, ScrollView, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { mmkv } from "@/src/utils/mmkv";

type CalendarItem = {
    title: string;
    date: string;
    type: "evento" | "recordatorio";
    hour?: number;
    minute?: number;
    ampm?: "AM" | "PM";
    notification?: string;
    category?: "inyeccion" | "ensamble" | "pintura";
};

const Calendar: React.FC = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const [items, setItems] = useState<CalendarItem[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState("");
    const [newType, setNewType] = useState<"evento" | "recordatorio">("evento");

    const [selectedHour, setSelectedHour] = useState<number>(1);
    const [selectedMinute, setSelectedMinute] = useState<number>(0);
    const [selectedAMPM, setSelectedAMPM] = useState<"AM" | "PM">("AM");
    const [selectedNotification, setSelectedNotification] = useState<string>("10 min antes");

    const [selectedCategory, setSelectedCategory] = useState<"inyeccion" | "ensamble" | "pintura">("inyeccion");
    const [categoryDropdown, setCategoryDropdown] = useState(false);

    const categoryOptions = [
        { label: "Inyección", value: "inyeccion", color: "green" },
        { label: "Ensamble", value: "ensamble", color: "blue" },
        { label: "Pintura", value: "pintura", color: "orange" },
    ];

    const [hourDropdown, setHourDropdown] = useState(false);
    const [minuteDropdown, setMinuteDropdown] = useState(false);
    const [ampmDropdown, setAMPMDropdown] = useState(false);
    const [notifDropdown, setNotifDropdown] = useState(false);

    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingDate, setEditingDate] = useState<string | null>(null);

    // ALERTA
    const [alertActive, setAlertActive] = useState(false);
    const [activeReminder, setActiveReminder] = useState<CalendarItem | null>(null);
    const alertInterval = useRef<number | null>(null);

    // campana animada
    const bellScale = useSharedValue(1);
    const bellRotate = useSharedValue(0);
    const bellShake = useSharedValue(0);

    const bellAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: bellScale.value },
            { rotate: `${bellRotate.value}deg` },
            { translateX: bellShake.value },
        ],
    }));

    // fondo parpadeante
    const bgRed = useSharedValue(0);
    const bgAnimatedStyle = useAnimatedStyle(() => ({
        backgroundColor: bgRed.value ? "rgba(240,62,62,0.6)" : "transparent",
    }));

    const triggerBell = () => {
        bellScale.value = withSpring(1.5, { damping: 2, stiffness: 150 }, () => {
            bellScale.value = withSpring(1);
        });
        bellRotate.value = withSequence(
            withSpring(15, { damping: 3, stiffness: 100 }),
            withSpring(-10, { damping: 3, stiffness: 100 }),
            withSpring(0, { damping: 3, stiffness: 100 })
        );
        bellShake.value = withSequence(
            withSpring(-8, { damping: 2, stiffness: 120 }),
            withSpring(8, { damping: 2, stiffness: 120 }),
            withSpring(-5, { damping: 2, stiffness: 120 }),
            withSpring(0, { damping: 2, stiffness: 120 })
        );
    };

    const triggerAlert = (item: CalendarItem) => {
        setActiveReminder(item);
        setAlertActive(true);

        // parpadeo fondo
        if (alertInterval.current) clearInterval(alertInterval.current);
        let blink = true;
        alertInterval.current = setInterval(() => {
            bgRed.value = blink ? 1 : 0;
            blink = !blink;
        }, 500);

        triggerBell();
    };

    const stopAlert = () => {
        if (alertInterval.current) {
            clearInterval(alertInterval.current);
            alertInterval.current = null;
        }
        bgRed.value = 0;
        setAlertActive(false);
        setActiveReminder(null);
    };

    // cargar datos de MMKV
    useEffect(() => {
        const passEvents = mmkv.getString("mmkkv-events");
        if (!passEvents) return;
        setItems(JSON.parse(passEvents));
    }, []);

    const scrollRef = useRef<ScrollView>(null);
    const monthLayouts = useRef<{ [key: number]: number }>({});
    useEffect(() => {
        const timeout = setTimeout(() => {
            const y = monthLayouts.current[currentMonth];
            if (scrollRef.current && y !== undefined) {
                scrollRef.current.scrollTo({ y, animated: false });
            }
        }, 300);
        return () => clearTimeout(timeout);
    }, []);

    // check recordatorios
    useEffect(() => {
        const triggeredReminders = new Set<string>();

        const checkReminders = () => {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const currentDateStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

            items.forEach((item, idx) => {
                if (
                    item.type === "recordatorio" &&
                    item.date === currentDateStr &&
                    item.hour !== undefined &&
                    item.minute !== undefined
                ) {
                    let itemHour = item.hour % 12;
                    if (item.ampm === "PM") itemHour += 12;

                    const reminderKey = `${item.date}-${itemHour}-${item.minute}-${idx}`;

                    if (
                        itemHour === currentHour &&
                        item.minute === currentMinute &&
                        !triggeredReminders.has(reminderKey)
                    ) {
                        triggeredReminders.add(reminderKey);
                        triggerAlert(item);
                    }
                }
            });
        };

        const interval = setInterval(checkReminders, 1000);
        return () => clearInterval(interval);
    }, [items]);

    // agregar o editar evento
    const addItem = () => {
        try {
            if (!newTitle || !newTitle.trim()) throw new Error("Asegúrate de ingresar un título");
            if (!selectedDate) throw new Error("Selecciona una fecha");

            let newItems = [...items];

            if (editingIndex !== null && editingDate === selectedDate) {
                newItems[editingIndex] = {
                    title: newTitle,
                    date: selectedDate,
                    type: newType,
                    hour: selectedHour,
                    minute: selectedMinute,
                    ampm: selectedAMPM,
                    notification: selectedNotification,
                    category: selectedCategory,
                };
            } else {
                newItems.push({
                    title: newTitle,
                    date: selectedDate,
                    type: newType,
                    hour: selectedHour,
                    minute: selectedMinute,
                    ampm: selectedAMPM,
                    notification: selectedNotification,
                    category: selectedCategory,
                });
            }

            setItems(newItems);
            mmkv.set("mmkkv-events", JSON.stringify(newItems));

            // reset
            setNewTitle("");
            setNewType("evento");
            setSelectedHour(1);
            setSelectedMinute(0);
            setSelectedAMPM("AM");
            setSelectedNotification("10 min antes");
            setSelectedCategory("inyeccion");
            setEditingIndex(null);
            setEditingDate(null);
            setModalVisible(false);

        } catch (ex: any) {
            Alert.alert("Atención", ex.message);
        }
    };

    const deleteItem = (index: number, date: string) => {
        const newItems = items.filter((it, idx) => !(it.date === date && idx === index));
        setItems(newItems);
        mmkv.set("mmkkv-events", JSON.stringify(newItems));
    };

    const startEditing = (item: CalendarItem, index: number) => {
        setNewTitle(item.title);
        setNewType(item.type);
        setSelectedHour(item.hour || 1);
        setSelectedMinute(item.minute || 0);
        setSelectedAMPM(item.ampm || "AM");
        setSelectedNotification(item.notification || "10 min antes");
        setSelectedCategory(item.category || "inyeccion");

        setEditingIndex(index);
        setEditingDate(item.date);
        setSelectedDate(item.date);
        setModalVisible(true);
    };

    const handleEventPress = (item: CalendarItem, index: number) => {
        Alert.alert(
            "Evento",
            item.title,
            [
                { text: "Editar", onPress: () => startEditing(item, index) },
                { text: "Borrar", style: "destructive", onPress: () => deleteItem(index, item.date) },
                { text: "Cancelar", style: "cancel" },
            ]
        );
    };

    // render meses
    const renderMonth = (month: number, year: number) => {
        const firstDay = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();
        const daysArray: (number | null)[] = Array(firstDay)
            .fill(null)
            .concat(Array.from({ length: totalDays }, (_, i) => i + 1));

        const monthName = new Date(year, month).toLocaleDateString("es-MX", { month: "long", year: "numeric" });
        const formattedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase();

        const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

        return (
            <View
                key={`${year}-${month}`}
                style={{ marginBottom: 40 }}
                onLayout={(event) => { monthLayouts.current[month] = event.nativeEvent.layout.y; }}
            >
                <Text style={{ fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>
                    {formattedMonth}
                </Text>

                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                    {weekDays.map((d, i) => (
                        <Text key={i} style={{ fontWeight: "bold", width: 40, textAlign: "center", color: "#555" }}>
                            {d}
                        </Text>
                    ))}
                </View>

                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {daysArray.map((day, i) => {
                        if (!day) return (
                            <View key={i} style={{ width: "14.2%", borderWidth: 0.5, borderColor: "#eee", minHeight: 120 }} />
                        );

                        const dateStr = `${year}-${month + 1}-${day}`;
                        const dayItems = items.filter((it) => it.date === dateStr);
                        const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

                        return (
                            <TouchableOpacity
                                key={i}
                                style={{
                                    width: "14.2%",
                                    borderWidth: 0.5,
                                    borderColor: "#eee",
                                    minHeight: 120,
                                    padding: 2,
                                    borderRadius: isToday ? 6 : 0,
                                }}
                                onPress={() => { setSelectedDate(dateStr); setModalVisible(true); }}
                            >
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        color: isToday ? "#fff" : "#000",
                                        backgroundColor: isToday ? "#f03e3e" : "white",
                                        borderRadius: 999,
                                        height: 24,
                                        width: 24,
                                        lineHeight: 24,
                                        textAlignVertical: "center",
                                        alignSelf: "center",
                                        marginBottom: 4,
                                    }}
                                >
                                    {day}
                                </Text>
                                {dayItems.map((it, idx) => (
                                    <TouchableOpacity
                                        key={idx}
                                        style={{
                                            backgroundColor: it.type === "evento" ? "#BFECF5" : "#F5D6BF",
                                            borderRadius: 8,
                                            paddingHorizontal: 3,
                                            marginTop: 2,
                                            flexDirection: "row",
                                            alignItems: "center",
                                        }}
                                        onPress={() => handleEventPress(it, idx)}
                                    >
                                        {it.category && (
                                            <View
                                                style={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: 4,
                                                    backgroundColor: categoryOptions.find((c) => c.value === it.category)?.color || "gray",
                                                    marginRight: 4,
                                                }}
                                            />
                                        )}
                                        <Text style={{ fontSize: 12, color: "#333", flexShrink: 1, flexWrap: "wrap" }}>
                                            {it.title}{" "}
                                            {it.type === "recordatorio" && `- ${it.hour}:${it.minute?.toString().padStart(2, "0")} ${it.ampm}`}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        );
    };

    // ComboBox genérico
    const ComboBox = ({ label, selected, setSelected, options, dropdownOpen, setDropdownOpen }: any) => (
        <View style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: "bold", marginBottom: 5 }}>{label}</Text>
            <TouchableOpacity
                style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, backgroundColor: "#f9f9f9" }}
                onPress={() => setDropdownOpen(!dropdownOpen)}
            >
                <Text>{selected}</Text>
            </TouchableOpacity>

            {dropdownOpen && (
                <ScrollView
                    style={{ maxHeight: 150, borderWidth: 1, borderColor: "#ccc", marginTop: 5, borderRadius: 5 }}
                    nestedScrollEnabled={true}
                >
                    {options.map((opt: any, idx: number) => (
                        <TouchableOpacity
                            key={idx}
                            style={{ padding: 10, backgroundColor: selected === opt ? "#eee" : "#fff" }}
                            onPress={() => { setSelected(opt); setDropdownOpen(false); }}
                        >
                            <Text>{opt}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    );

    const CategoryComboBox = () => (
        <View style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Categoría</Text>
            <TouchableOpacity
                style={{
                    borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5,
                    backgroundColor: "#f9f9f9", flexDirection: "row", alignItems: "center",
                }}
                onPress={() => setCategoryDropdown(!categoryDropdown)}
            >
                <View
                    style={{
                        width: 12, height: 12, borderRadius: 6,
                        backgroundColor: categoryOptions.find((c) => c.value === selectedCategory)?.color || "gray",
                        marginRight: 8,
                    }}
                />
                <Text>{categoryOptions.find((c) => c.value === selectedCategory)?.label}</Text>
            </TouchableOpacity>
            {categoryDropdown && (
                <ScrollView style={{ maxHeight: 120, borderWidth: 1, borderColor: "#ccc", marginTop: 5 }}>
                    {categoryOptions.map((opt, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={{
                                padding: 10,
                                backgroundColor: selectedCategory === opt.value ? "#eee" : "#fff",
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                            onPress={() => { setSelectedCategory(opt.value as any); setCategoryDropdown(false); }}
                        >
                            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: opt.color, marginRight: 8 }} />
                            <Text>{opt.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            {/* Fondo parpadeante */}
            <Animated.View style={[StyleSheet.absoluteFill, bgAnimatedStyle]} />

            {/* campana */}
            <Animated.View style={[{ position: "absolute", top: 10, right: 20, zIndex: 10 }, bellAnimatedStyle]}>
                <Ionicons name="notifications-outline" size={44} color="#F03E3E" />
            </Animated.View>

            {/* overlay alerta */}
            {alertActive && activeReminder && (
                <Animated.View
                    style={{
                        position: "absolute",
                        top: "30%",
                        left: "10%",
                        right: "10%",
                        backgroundColor: "#fff",
                        padding: 20,
                        borderRadius: 12,
                        alignItems: "center",
                        zIndex: 20,
                        elevation: 10,
                    }}
                >
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>{activeReminder.title}</Text>
                    <Text style={{ marginTop: 10 }}>
                        {activeReminder.hour}:{activeReminder.minute?.toString().padStart(2, "0")} {activeReminder.ampm}
                    </Text>
                    <TouchableOpacity
                        style={{
                            marginTop: 20,
                            backgroundColor: "#F03E3E",
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            borderRadius: 8,
                        }}
                        onPress={stopAlert}
                    >
                        <Text style={{ color: "#fff", fontWeight: "bold" }}>Detener</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}

            {/* calendario */}
            <ScrollView ref={scrollRef}>
                {Array.from({ length: 12 }, (_, i) => renderMonth(i, currentYear))}
            </ScrollView>

            {/* modal */}
            {modalVisible && (
                <View
                    style={{
                        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center",
                    }}
                >
                    <ScrollView
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: 10,
                            padding: 20,
                            width: "85%",
                            maxHeight: "90%",
                        }}
                        contentContainerStyle={{ paddingBottom: 50 }}
                    >
                        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
                            {editingIndex !== null ? "Editar" : "Nuevo"} {newType === "recordatorio" ? "Recordatorio" : "Evento"}
                        </Text>

                        <TextInput
                            style={{ borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 10, borderRadius: 5 }}
                            placeholder="Título"
                            value={newTitle}
                            onChangeText={setNewTitle}
                        />

                        <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 10 }}>
                            <Button
                                title="Evento"
                                onPress={() => setNewType("evento")}
                                disabled={newType === "evento"}
                                color={newType === "evento" ? "#505050" : "#ccc"}
                            />
                            <Button
                                title="Recordatorio"
                                onPress={() => setNewType("recordatorio")}
                                disabled={newType === "recordatorio"}
                                color={newType === "recordatorio" ? "#505050" : "#ccc"}
                            />
                        </View>

                        {newType === "recordatorio" && (
                            <>
                                <ComboBox
                                    label="Hora" selected={selectedHour} setSelected={setSelectedHour}
                                    options={Array.from({ length: 12 }, (_, i) => i + 1)}
                                    dropdownOpen={hourDropdown} setDropdownOpen={setHourDropdown}
                                />
                                <ComboBox
                                    label="Minutos" selected={selectedMinute} setSelected={setSelectedMinute}
                                    options={Array.from({ length: 60 }, (_, i) => i)}
                                    dropdownOpen={minuteDropdown} setDropdownOpen={setMinuteDropdown}
                                />
                                <ComboBox
                                    label="AM/PM" selected={selectedAMPM} setSelected={setSelectedAMPM}
                                    options={["AM", "PM"]}
                                    dropdownOpen={ampmDropdown} setDropdownOpen={setAMPMDropdown}
                                />
                                <ComboBox
                                    label="Notificación" selected={selectedNotification} setSelected={setSelectedNotification}
                                    options={["-", "10 min antes", "30 min antes", "1 hora antes"]}
                                    dropdownOpen={notifDropdown} setDropdownOpen={setNotifDropdown}
                                />
                                <CategoryComboBox />
                            </>
                        )}

                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 10 }}>
                            <Button title="Guardar" onPress={addItem} />
                            <Button title="Cancelar" color="#F03E3E" onPress={() => setModalVisible(false)} />
                        </View>
                    </ScrollView>
                </View>
            )}
        </SafeAreaView>
    );
};

export default Calendar;
