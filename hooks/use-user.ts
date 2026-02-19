"use client";

import { useEffect, useMemo, useState } from "react";
import { User } from "@supabase/supabase-js";

import { createClient } from "@/utils/supabase/client";

export const useUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        let isMounted = true;
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!isMounted) return;
            setUser(user);
            setLoading(false);
        };

        getUser();

        const { data: subscription } = supabase.auth.onAuthStateChange(
            (_event: any, session: any) => {
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
