import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList,
  Image,
  SafeAreaView
} from 'react-native';
import { theme, globalStyles } from '@/constants/Theme';
import { format, parseISO } from 'date-fns';

// Message interface
interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

// Conversation interface
interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar: string;
  }[];
  lastMessage: Message;
  unreadCount: number;
}

// Mock conversations data
const mockConversations: Conversation[] = [
  {
    id: '1',
    participants: [
      {
        id: 'owner1',
        name: 'John Smith',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg',
      }
    ],
    lastMessage: {
      id: 'm1',
      conversationId: '1',
      senderId: 'owner1',
      receiverId: 'renter1',
      content: 'Buddy is excited to meet you tomorrow!',
      timestamp: '2025-05-19T14:30:00Z',
      read: false,
    },
    unreadCount: 2,
  },
  {
    id: '2',
    participants: [
      {
        id: 'owner2',
        name: 'Emily Johnson',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      }
    ],
    lastMessage: {
      id: 'm2',
      conversationId: '2',
      senderId: 'renter1',
      receiverId: 'owner2',
      content: 'What time should I pick Luna up?',
      timestamp: '2025-05-18T09:15:00Z',
      read: true,
    },
    unreadCount: 0,
  },
  {
    id: '3',
    participants: [
      {
        id: 'owner3',
        name: 'Paws Shelter',
        avatar: 'https://images.pexels.com/photos/1612846/pexels-photo-1612846.jpeg',
      }
    ],
    lastMessage: {
      id: 'm3',
      conversationId: '3',
      senderId: 'owner3',
      receiverId: 'renter1',
      content: 'Max loves the park by 5th Avenue. You should take him there!',
      timestamp: '2025-05-17T16:45:00Z',
      read: true,
    },
    unreadCount: 0,
  },
];

function formatTimestamp(timestamp: string) {
  const date = parseISO(timestamp);
  const now = new Date();
  
  // Today
  if (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  ) {
    return format(date, 'h:mm a');
  }
  
  // This week
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffInDays < 7) {
    return format(date, 'EEE');
  }
  
  // Older
  return format(date, 'MMM d');
}

export default function MessagesScreen() {
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>
      
      <FlatList
        data={mockConversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const participant = item.participants[0];
          
          return (
            <TouchableOpacity style={styles.conversationItem} activeOpacity={0.7}>
              <Image source={{ uri: participant.avatar }} style={styles.avatar} />
              
              <View style={styles.conversationContent}>
                <View style={styles.conversationHeader}>
                  <Text style={styles.name}>{participant.name}</Text>
                  <Text style={styles.timestamp}>
                    {formatTimestamp(item.lastMessage.timestamp)}
                  </Text>
                </View>
                
                <View style={styles.messageRow}>
                  <Text 
                    style={[
                      styles.message, 
                      item.unreadCount > 0 && styles.unreadMessage
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.lastMessage.content}
                  </Text>
                  
                  {item.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.conversationsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No messages yet</Text>
            <Text style={styles.emptyStateSubtitle}>
              When you book a dog, you'll be able to message with the owner here
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: theme.spacing.l,
    paddingBottom: theme.spacing.m,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },
  conversationsList: {
    padding: theme.spacing.l,
    paddingTop: 0,
  },
  conversationItem: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey[200],
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: theme.spacing.m,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    ...theme.typography.subtitle1,
  },
  timestamp: {
    ...theme.typography.caption,
    color: theme.colors.grey[500],
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message: {
    ...theme.typography.body2,
    color: theme.colors.grey[600],
    flex: 1,
    marginRight: theme.spacing.s,
  },
  unreadMessage: {
    color: theme.colors.text,
    fontFamily: 'Inter-SemiBold',
  },
  unreadBadge: {
    backgroundColor: theme.colors.primary[500],
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadgeText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
  },
  emptyState: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyStateTitle: {
    ...theme.typography.h4,
    color: theme.colors.grey[700],
    marginBottom: theme.spacing.s,
  },
  emptyStateSubtitle: {
    ...theme.typography.body1,
    color: theme.colors.grey[500],
    textAlign: 'center',
  },
});