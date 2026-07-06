import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { formatWorkoutTime } from '../../components/WorkoutHelper';
import { Ionicons } from '@expo/vector-icons';

dayjs.extend(relativeTime);

export default function FeedCard({
  post,
  isDark,
  onPress,
  onLike,
  onComment,
  liked,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[styles.card, { backgroundColor: isDark ? '#111' : '#fff' }]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={{ uri: post.photoURL || 'https://i.imgur.com/V4RclNb.png' }}
          style={styles.avatar}
        />

        <View style={{ flex: 1 }}>
          <Text style={[styles.username, { color: isDark ? '#fff' : '#000' }]}>
            {'@' + (post.username || 'Unknown')}
          </Text>

          <Text style={[styles.time, { color: isDark ? '#888' : '#666' }]}>
            {post.createdAt
              ? dayjs(post.createdAt.toDate?.() || post.createdAt).fromNow()
              : ''}
          </Text>
        </View>

        <View
          style={[
            styles.badge,
            { backgroundColor: post.isPublic ? '#1f6fff' : '#444' },
          ]}
        >
          <Text style={styles.badgeText}>
            {post.isPublic ? 'Public' : 'Private'}
          </Text>
        </View>
      </View>

      {/* TITLE */}
      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
        {post.title || 'Workout'}
      </Text>

      {/* STATS */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: isDark ? '#fff' : '#000' }]}>
            {post.exercises?.length || 0}
          </Text>
          <Text style={styles.statLabel}>Exercises</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: isDark ? '#fff' : '#000' }]}>
            {Math.round(post.totalVolume || 0)}
          </Text>
          <Text style={styles.statLabel}>Volume</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: isDark ? '#fff' : '#000' }]}>
            {formatWorkoutTime(post.elapsed) || 0}
          </Text>
          <Text style={styles.statLabel}>Elapsed</Text>
        </View>
      </View>

      {/* ACTION ROW */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onLike} style={styles.actionBtn}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={22}
            color={liked ? '#ff3b30' : isDark ? '#fff' : '#000'}
          />
          <Text style={styles.actionText}>
            {post.likeCount || 0}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onComment} style={styles.actionBtn}>
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color={isDark ? '#fff' : '#000'}
          />
          <Text style={styles.actionText}>
            {post.commentCount || 0}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
    backgroundColor: '#333',
  },

  username: {
    fontSize: 14,
    fontWeight: '700',
  },

  time: {
    fontSize: 12,
    marginTop: 2,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statBox: {
    alignItems: 'center',
    flex: 1,
  },

  statValue: {
    fontSize: 14,
    fontWeight: '700',
  },

  statLabel: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },

  actions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 18,
  },

  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  actionText: {
    fontSize: 13,
    color: '#888',
  },
});