import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList,
  Image,
  SafeAreaView,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { theme, globalStyles } from '@/constants/Theme';
import { format, parseISO } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Database } from '@/types/supabase';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type Message = Database['public']['Tables']['messages']['Row'];
type UserProfile = Database['public']['Tables']['users']['Row'];

interface ConversationWithDetails extends Conversation {
  otherUser: UserProfile;
  lastMessage: Message | null;
  unreadCount: number;
}

export default function MessagesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchConversations();
      
      // Subscribe to real-time updates
      const subscription = supabase
        .channel('messages')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'messages' }, 
          () => {
            fetchConversations();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      // Fetch conversations where user is a participant
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (conversationsError) throw conversationsError;

      const conversationsWithDetails: ConversationWithDetails[] = [];

      for (const conversation of conversationsData || []) {
        // Get the other user
        const otherUserId = conversation.user1_id === user.id 
          ? conversation.user2_id 
          : conversation.user1_id;

        const { data: otherUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', otherUserId)
          .single();

        // Get last message
        const { data: lastMessage } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversation.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        // Get unread count
        const { count: unreadCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conversation.id)
          .eq('is_read', false)
          .neq('sender_id', user.id);

        if (otherUser) {
          conversationsWithDetails.push({
            ...conversation,
            otherUser,
            lastMessage,
            unreadCount: unreadCount || 0,
          });
        }
      }

      setConversations(conversationsWithDetails);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
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
  };

  const handleConversationPress = (conversation: ConversationWithDetails) => {
    router.push(`/messages/${conversation.id}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>
      
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.conversationItem} 
            onPress={() => handleConversationPress(item)}
            activeOpacity={0.7}
          >
            <Image 
              source={{ 
                uri: item.otherUser.profile_pic_url || 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg' 
              }} 
              style={styles.avatar} 
            />
            
            <View style={styles.conversationContent}>
              <View style={styles.conversationHeader}>
                <Text style={styles.name}>{item.otherUser.name || 'Anonymous'}</Text>
                {item.lastMessage && (
                  <Text style={styles.timestamp}>
                    {formatTimestamp(item.lastMessage.created_at)}
                  </Text>
                )}
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
                  {item.lastMessage?.content || 'No messages yet'}
                </Text>
                
                {item.unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...theme.typography.body1,
    color: theme.colors.grey[600],
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