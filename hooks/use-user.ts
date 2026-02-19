"use client";

import { useEffect, useMemo, useState } from "react";
import { User, AuthChangeEvent, Session } from "@supabase/supabase-js";

import { createClient } from "@/utils/supabase/client";

export const useUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        let isMounted = true;
        const getUser = async () => {
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();
                if (!isMounted) return;
                setUser(user);
                setLoading(false);
            } catch (err: unknown) {
                // AbortError is expected when navigation happens mid-refresh; ignore it
                if (err instanceof Error && err.name === 'AbortError') return;
                if (!isMounted) return;
                setUser(null);
                setLoading(false);
            }
        };

        getUser();

        const { data: subscription } = supabase.auth.onAuthStateChange(
            (_event: AuthChangeEvent, session: Session | null) => {
                if (!isMounted) return;
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        return () => {
            isMounted = false;
            subscription.subscription.unsubscribe();
        };
    }, [supabase]);

    return { user, loading };
};
