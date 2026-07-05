import { useEffect, useState } from 'react';
import { supabase } from '@shared/services/supabase';
import { useAuthUser } from '@shared/hooks/auth/useAuthUser';

export function useAdminUnreadSupportCount() {
    const { user } = useAuthUser();
    const [count, setCount] = useState(0);
    const userId = user?.id;

    useEffect(() => {
        if (!userId) return;

        const fetchCount = async () => {
            const { data } = await supabase
                .from('support_conversations')
                .select('unread_by_admin');

            const total = (data ?? []).reduce(
                (sum, row) => sum + (row.unread_by_admin ?? 0),
                0
            );

            setCount(total);
        };
        fetchCount();

        const topic = `admin-unread:${userId}`;
        const existing = supabase.getChannels().find(
            (ch) => ch.topic === `realtime:${topic}`
        );
        if (existing) supabase.removeChannel(existing);

        const channel = supabase
            .channel(topic)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'support_conversations',
            }, () => {
                fetchCount();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [userId]);

    return count;
}


