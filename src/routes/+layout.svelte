<script lang="ts">
    import Header from "$components/Layout/Header.svelte";
    import "./../app.css"
    import { invalidate } from '$app/navigation'
    import { setUserState } from "$lib/state/user-state.svelte";

    let { data, children } = $props()

    let { session, supabase, user } = $derived(data)

    let userState = setUserState({session: data.session, supabase: data.supabase, user: data.user});

    $effect(() => {
        const { data } = supabase.auth.onAuthStateChange((_, newSession) => {

        console.log("This has updated")
        
        userState.updateState({session: newSession, supabase, user: newSession?.user || null})
        
        console.log("This has updated")

        if (newSession?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth')
      }
    });

    return () => data.subscription.unsubscribe()
    })

</script>

<Header/>
{@render children()}
