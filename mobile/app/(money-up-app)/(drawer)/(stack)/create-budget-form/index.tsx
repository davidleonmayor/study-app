import { CreateBudgetForm } from "@/presentation";
import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

const MAX_NOTE_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_NOTE_EXTENSIONS = new Set(["pdf", "txt", "md"]);
const ALLOWED_NOTE_MIME_TYPES = new Set([
  "application/pdf",
  "text/plain",
  "text/markdown",
]);

type NoteFile = {
  name: string;
  mimeType: string | undefined;
  size: number | undefined;
  uri: string;
};

const getExtension = (name: string) =>
  name.split(".").pop()?.toLowerCase() ?? "";

const validateNoteFile = (file: NoteFile): NoteFile => {
  const fileName = file.name.trim();
  const extension = getExtension(fileName);

  if (
    !fileName ||
    fileName.length > 120 ||
    /[\u0000-\u001f\u007f/\\]/.test(fileName)
  ) {
    throw new Error("El nombre del archivo no es válido.");
  }

  if (!ALLOWED_NOTE_EXTENSIONS.has(extension)) {
    throw new Error("Solo se permiten archivos PDF, TXT o Markdown.");
  }

  if (file.mimeType && !ALLOWED_NOTE_MIME_TYPES.has(file.mimeType)) {
    throw new Error("El tipo de archivo no está permitido.");
  }

  if (
    typeof file.size !== "number" ||
    file.size <= 0 ||
    file.size > MAX_NOTE_FILE_SIZE
  ) {
    throw new Error("El archivo debe pesar más de 0 y hasta 10 MB.");
  }

  if (!/^(content|file|blob):\/\//.test(file.uri)) {
    throw new Error("La ubicación del archivo no es válida.");
  }

  return { ...file, name: fileName };
};

const CreateBudgetFormScreen = () => {
  const [topic, setTopic] = useState("");
  const [noteText, setNoteText] = useState("");
  const [selectedFile, setSelectedFile] = useState<NoteFile | null>(null);

  const selectFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: Array.from(ALLOWED_NOTE_MIME_TYPES),
      copyToCacheDirectory: false,
      multiple: false,
    });

    if (result.canceled) {
      return;
    }

    try {
      const asset = result.assets[0];
      setSelectedFile(
        validateNoteFile({
          name: asset.name,
          mimeType: asset.mimeType,
          size: asset.size,
          uri: asset.uri,
        }),
      );
    } catch (error) {
      Alert.alert(
        "Archivo rechazado",
        error instanceof Error
          ? error.message
          : "No se pudo validar el archivo.",
      );
      setSelectedFile(null);
    }
  };

  const saveNote = () => {
    if (!topic.trim() || !noteText.trim()) {
      Alert.alert(
        "Apunte incompleto",
        "Completa el tema y el texto del apunte.",
      );
      return;
    }

    Alert.alert(
      "Apunte listo",
      selectedFile
        ? `El apunte "${topic.trim()}" tiene el archivo ${selectedFile.name}.`
        : `El apunte "${topic.trim()}" está listo para guardarse.`,
    );
  };

  const dropZone = (
    <Pressable
      onPress={selectFile}
      className="mt-3 w-full rounded-xl border-2 border-dashed border-primaryDark bg-quaternary p-5"
      accessibilityRole="button"
      accessibilityLabel="Seleccionar archivo para el apunte"
    >
      <Text className="text-center font-bold">
        Arrastra un archivo aquí o selecciónalo
      </Text>
      <Text className="mt-1 text-center text-gray-600">
        PDF, TXT o Markdown · máximo 10 MB
      </Text>
    </Pressable>
  );

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1">
      <Text className="text-3xl font-extrabold mt-10 text-center">
        Nuevo Aprendizaje
      </Text>
      <Text className="font-semibold mt-2 text-center">
        LLena tu cerebro de nuevo{" "}
        <Text className="font-bold text-primaryDark">conocimiento</Text>
      </Text>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* 
                <CreateBudgetForm />
                */}

        <View className="mt-8 mb-10 bg-white p-6 rounded-xl w-full mx-12">
          <Text className="font-bold mt-5">Tema</Text>
          <TextInput
            value={topic}
            onChangeText={setTopic}
            placeholder="Ej. Finanzas personales"
            maxLength={100}
            className="mt-2 rounded-xl border border-gray-300 p-4"
          />

          <Text className="font-bold mt-5">Texto del apunte</Text>
          <TextInput
            value={noteText}
            onChangeText={setNoteText}
            placeholder="Escribe el contenido del apunte"
            multiline
            maxLength={5000}
            textAlignVertical="top"
            className="mt-2 min-h-32 rounded-xl border border-gray-300 p-4"
          />

          {Platform.OS === "web"
            ? React.createElement(
                "div",
                {
                  onDragOver: (event: React.DragEvent<HTMLDivElement>) => {
                    event.preventDefault();
                  },
                  onDrop: (event: React.DragEvent<HTMLDivElement>) => {
                    event.preventDefault();
                    const file = event.dataTransfer.files[0];
                    if (!file) return;

                    try {
                      setSelectedFile(
                        validateNoteFile({
                          name: file.name,
                          mimeType: file.type || undefined,
                          size: file.size,
                          uri: URL.createObjectURL(file),
                        }),
                      );
                    } catch (error) {
                      Alert.alert(
                        "Archivo rechazado",
                        error instanceof Error
                          ? error.message
                          : "No se pudo validar el archivo.",
                      );
                      setSelectedFile(null);
                    }
                  },
                },
                dropZone,
              )
            : dropZone}

          {selectedFile && (
            <View className="mt-3 rounded-lg bg-gray-100 p-3">
              <Text className="font-semibold">{selectedFile.name}</Text>
              <Pressable onPress={() => setSelectedFile(null)}>
                <Text className="mt-1 text-primaryDark">Quitar archivo</Text>
              </Pressable>
            </View>
          )}

          <Pressable
            onPress={saveNote}
            className="mt-5 rounded-xl bg-primary p-4 active:bg-primaryDark"
          >
            <Text className="text-center font-bold uppercase">
              Guardar apunte
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateBudgetFormScreen;
