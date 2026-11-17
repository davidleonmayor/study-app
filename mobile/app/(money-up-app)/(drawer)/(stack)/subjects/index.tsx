import { SubjectCard, useSubjectsStore } from '@/presentation';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, useWindowDimensions, View } from 'react-native';

export default function SubjectsScreen() {
  const { width } = useWindowDimensions();
  const {
    subjects,
    page,
    totalPages,
    isLoading,
    error,
    loadSubjects,
  } = useSubjectsStore();
  const horizontalPadding = 16;
  const columnGap = 16;
  const columns = width >= 900 ? 3 : width >= 560 ? 2 : 1;
  const cardWidth =
    (width - horizontalPadding * 2 - columnGap * (columns - 1)) / columns;

  useFocusEffect(
    React.useCallback(() => {
      loadSubjects(1);
    }, [loadSubjects]),
  );

  const changePage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || isLoading) {
      return;
    }

    loadSubjects(nextPage);
  };

  if (isLoading && subjects.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#7AAC28" />
        <Text className="mt-4">Cargando subjects...</Text>
      </View>
    );
  }

  if (error && subjects.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-center text-red-600">{error}</Text>
        <Pressable
          className="mt-4 rounded-lg bg-primary px-5 py-3"
          onPress={() => loadSubjects(page)}
        >
          <Text className="font-bold text-tertiary">Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlatList
        data={subjects}
        keyExtractor={(subject) => subject.id}
        numColumns={columns}
        key={columns}
        contentContainerStyle={{
          padding: horizontalPadding,
          gap: columnGap,
        }}
        columnWrapperStyle={columns > 1 ? { gap: columnGap } : undefined}
        renderItem={({ item }) => (
          <View style={{ width: cardWidth }}>
            <SubjectCard subject={item} />
          </View>
        )}
        ListEmptyComponent={
          <Text className="mt-10 text-center text-gray-500">
            No hay subjects disponibles.
          </Text>
        }
        showsVerticalScrollIndicator={false}
      />

      {totalPages > 0 && (
        <View className="flex-row items-center justify-center gap-4 border-t border-gray-200 px-4 py-4">
          <Pressable
            accessibilityLabel="Página anterior"
            className="rounded-lg bg-primary px-4 py-2 disabled:bg-gray-200"
            disabled={page === 1 || isLoading}
            onPress={() => changePage(page - 1)}
          >
            <Text className="font-bold text-tertiary">Anterior</Text>
          </Pressable>

          <Text className="font-semibold text-tertiary">
            Página {page} de {totalPages}
          </Text>

          <Pressable
            accessibilityLabel="Página siguiente"
            className="rounded-lg bg-primary px-4 py-2 disabled:bg-gray-200"
            disabled={page === totalPages || isLoading}
            onPress={() => changePage(page + 1)}
          >
            <Text className="font-bold text-tertiary">Siguiente</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
