import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function FeedCard({ post, isDark, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: isDark ? '#1a1a1a' : '#fff',
        padding: 14,
        borderRadius: 12,
        marginBottom: 12,
      }}
    >
      <Text style={{ color: isDark ? '#fff' : '#000', fontWeight: '700', fontSize: 16 }}>
        {post.title}
      </Text>

      <Text style={{ color: isDark ? '#aaa' : '#666', marginTop: 6 }}>
        {post.exercises?.length || 0} exercises
      </Text>

      <Text style={{ color: isDark ? '#888' : '#999', marginTop: 6, fontSize: 12 }}>
        ❤️ {post.likeCount || 0}  ·  💬 {post.commentCount || 0}
      </Text>
    </TouchableOpacity>
  );
}