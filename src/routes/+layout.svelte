<script>
  import { Navigation, Footer, LoadingState } from "$lib/index.js";
  import { navigating } from '$app/stores';
  import { onNavigate } from "$app/navigation";

  let showLoading = false;
  let navigatingTimeout;
  
  // Watch the `navigating` store
  $: if ($navigating) {
    // Delay showing the loading state
    clearTimeout(navigatingTimeout);
    navigatingTimeout = setTimeout(() => {
      showLoading = true;
    }, 400); // Adjust delay for view-transition capture
  } else {
    clearTimeout(navigatingTimeout);
    showLoading = false; // Hide loading when navigation completes
  }
  
  onNavigate((navigation) => {
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

{#if showLoading}
  <Navigation />
  <main>
    <LoadingState />
  </main>
{:else} 
  <Navigation />
  <div class="content">
    <slot />
  </div>
{/if}

<div class="footer">
  <Footer />
</div>

<style>
  main {
    margin: auto;
  }
  
  .content {
    flex: 1;
  }

  .footer {
    background-color: var(--background-color);
  }

  @media only screen and (min-width: 600px) {
    .content {
      margin-bottom: 77px;
    }
  }

  @media only screen and (min-width: 1080px) {
    .content {
      margin-top: 74px;
      padding-bottom: 0;
    }

    .footer {
      background-color: #f0f0f0;
    }
  }

  @media only screen and (min-width: 1920px) {
    .content {
      margin-top: 82px;
    }
  }
</style>
