import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { addComment, getComments } from '../../components/PostInteractions';
import { useTheme } from '../ThemeProvider';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function CommentsScreen({ route }) {
  const { postId } = route.params;
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  const loadComments = async () => {
    const data = await getComments(postId);
    setComments(data);
  };

  useEffect(() => {
    loadComments();
  }, []);

  const handleSend = async () => {
    if (!text.trim()) return;

    await addComment(postId, text);
    setText('');
    loadComments();
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#000' : '#f5f5f5' },
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={15}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.empty}>
                Be the first to comment.
              </Text>
            }
            renderItem={({ item }) => (
              <View style={styles.comment}>
                <Image
                  source={{
                    uri:
                      item.photoURL ||
                      'https://i.imgur.com/V4RclNb.png',
                  }}
                  style={styles.avatar}
                />

                <View style={styles.body}>
                  <View style={styles.header}>
                    <Text
                      style={[
                        styles.username,
                        { color: isDark ? '#fff' : '#000' },
                      ]}
                    >
                      @{item.username || 'Unknown'}
                    </Text>

                    <Text style={styles.time}>
                      {item.createdAt
                        ? dayjs(
                            item.createdAt.toDate?.() ||
                              item.createdAt
                          ).fromNow()
                        : ''}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.commentText,
                      { color: isDark ? '#fff' : '#000' },
                    ]}
                  >
                    {item.text}
                  </Text>
                </View>
              </View>
            )}
          />

          <View
            style={[
              styles.inputWrapper,
              {
                backgroundColor: isDark ? '#000' : '#fff',
                borderTopColor: isDark ? '#222' : '#ddd',
              },
            ]}
          >
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Write a comment..."
              placeholderTextColor="#888"
              multiline
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? '#111' : '#f0f0f0',
                  color: isDark ? '#fff' : '#000',
                },
              ]}
            />

            <TouchableOpacity
              onPress={handleSend}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  list: {
    paddingHorizontal: 16,
    paddingTop: 100,
    paddingBottom: 100,
  },

  comment: {
    flexDirection: 'row',
    marginBottom: 18,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#444',
    marginRight: 12,
  },

  body: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  username: {
    fontWeight: '700',
    fontSize: 14,
  },

  time: {
    fontSize: 11,
    color: '#888',
  },

  commentText: {
    fontSize: 15,
    lineHeight: 22,
  },

  empty: {
    marginTop: 40,
    textAlign: 'center',
    color: '#888',
    fontSize: 15,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    borderTopWidth: 1,
  },

  input: {
    flex: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 120,
    marginRight: 10,
    fontSize: 15,
  },

  button: {
    backgroundColor: '#007AFF',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});