import { Subject } from '@/core';
import React from 'react';
import { Image, Text, View } from 'react-native';

interface SubjectCardProps {
  subject: Subject;
}

export function SubjectCard({ subject }: SubjectCardProps) {
  return (
    <View className="overflow-hidden rounded-2xl bg-white shadow-lg">
      <View className="aspect-video w-full overflow-hidden bg-quaternary">
        <Image
          source={require('@/assets/images/logo.png')}
          className="h-full w-full"
          resizeMode="cover"
        />
      </View>

      <View className="min-h-16 justify-center px-4 py-3">
        <Text className="text-lg font-bold text-tertiary" numberOfLines={2}>
          {subject.name}
        </Text>
      </View>
    </View>
  );
}
