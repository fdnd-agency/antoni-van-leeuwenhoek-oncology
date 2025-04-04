<script>
  import { page } from '$app/stores';
  import { enhance } from '$app/forms';
  import {Like, Liked, LoaderSpin, LoaderDots} from '$lib/index.js';

  export let comment;
  export let parsedChapters = [];

  let content = '';
  let slug = $page.url.pathname;
  let loadingLike = false;
  let loadingSend = false;
  let liked = false;

  function timeToSeconds(time) {
    const parts = time.split(':').map(Number).reverse();
    let seconds = 0;
    if (parts[0]) seconds += parts[0];
    if (parts[1]) seconds += parts[1] * 60;
    if (parts[2]) seconds += parts[2] * 3600;
    return seconds;
  }

  function getCurrentChapter(seconds) {
    for (let i = 0; i < parsedChapters.length; i++) {
      const currentChapter = parsedChapters[i];
      const nextChapter = parsedChapters[i + 1];

      if (seconds >= currentChapter.time_seconds && (!nextChapter || seconds < nextChapter.time_seconds)) {
        return currentChapter.title_number; // Return the title_number of the current chapter
      }
    }
    return "doesnt belong to a chapter"; // No matching chapter
  }

  function parseCommentContent(content) {
    const timeRegex = /\b\d{1,2}:\d{2}(?::\d{2})?\b/g;
    return content.replace(timeRegex, (match) => {
      const seconds = timeToSeconds(match);
      return `<a href="?video-start=${seconds}" class="time-link" data-time="${seconds}">${match}</a>`;
    });
  }

  $: parsedContent = parseCommentContent(comment.content);

  $: currentChapter = (() => {
    const timeMatches = comment.content.match(/\b\d{1,2}:\d{2}(?::\d{2})?\b/g); // Find all timestamps
    if (timeMatches) {
      return timeMatches.map((time) => {
        const seconds = timeToSeconds(time); // Convert each timestamp to seconds
        return getCurrentChapter(seconds); // Get the chapter for each timestamp
      }).filter((chapter) => chapter !== "doesn't belong to a chapter"); // Filter out unmatched timestamps
    }
    return [];
  })();

  const likeComment = () => {
    loadingLike = true;
    liked = true;

    return async ({ update }) => {
      await update();
      loadingLike = false;
    };
  };

  const replyComment = () => {
    loadingSend = true;

    return async ({ update }) => {
      await update ();
      loadingSend = false;
    }
  }
</script>

  <div class="comment-container">
    <section class="comment-head">
      {#if comment.user_id === null}
        <img src="/images/profilepic.png" alt="error" width="40" height="40">
        <h4>
          Name Surname
          {#if currentChapter}
            <span class="chapter-info">({currentChapter})</span>
          {/if}
        </h4>
      {:else}
        <img src="https://fdnd-agency.directus.app/assets/{comment.user_id.profile_picture.id}?format=avif" alt="{comment.user_id.profile_picture.title}" width="40" height="40">
        <h4>
          {comment.user_id.fullname}
          {#if currentChapter}
            <span class="chapter-info">({currentChapter})</span>
          {/if}
        </h4>
      {/if}
  
      {#if comment.time_posted === null}
        <time>hours ago</time>
      {:else}
        <time>{comment.time_posted}</time>
      {/if}
    </section>
  
    <p class="comment-content">
      {@html parsedContent}
    </p>

    <div class="comment-response">
      <form action="{slug}?/like" method="POST" class="form-like" use:enhance={likeComment}>
        <input type="hidden" name="comment-id" value="{comment.id}">
        <button type="submit" id="like-{comment.id}" aria-label="Like this comment">
            {#if loadingLike}
            <div class="loader">
              <LoaderSpin />
            </div>
            {:else}
              <svg width="20" height="19" viewBox="0 0 20 19" xmlns="http://www.w3.org/2000/svg">
                {#if liked}
                  <Liked />    
                {:else}
                  <Like />
                {/if}  
              </svg> 
            {/if}
        </button>

        <span class="like-count">
          {#if comment.likes != null}
            {comment.likes}
          {:else} 
            0
          {/if}  
           Likes</span>
      </form>

      <label for="reply-{comment.id}" class="reply">
        <svg width="20" height="19" viewBox="0 0 20 19" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.49589 10.9232H9.95228V8.01036H12.8652V6.55397H9.95228V3.6411H8.49589V6.55397H5.58301V8.01036H8.49589V10.9232ZM0 18V1.7552C0 1.26474 0.169918 0.849589 0.509753 0.509753C0.849589 0.169918 1.26474 0 1.7552 0H16.693C17.1834 0 17.5986 0.169918 17.9384 0.509753C18.2783 0.849589 18.4482 1.26474 18.4482 1.7552V12.8091C18.4482 13.2996 18.2783 13.7147 17.9384 14.0546C17.5986 14.3944 17.1834 14.5643 16.693 14.5643H3.43569L0 18ZM2.81578 13.1079H16.693C16.7677 13.1079 16.8361 13.0768 16.8984 13.0146C16.9606 12.9523 16.9918 12.8838 16.9918 12.8091V1.7552C16.9918 1.6805 16.9606 1.61203 16.8984 1.54977C16.8361 1.48753 16.7677 1.45641 16.693 1.45641H1.7552C1.6805 1.45641 1.61203 1.48753 1.54977 1.54977C1.48753 1.61203 1.45641 1.6805 1.45641 1.7552V14.4523L2.81578 13.1079Z"/>
        </svg>
        <span>Reply</span>
      </label>

      <form action="{slug}?/reply" method="POST" class="form-reply" use:enhance={replyComment}>
        <input id="reply-{comment.id}" name="reply" placeholder="Type your reply" required bind:value={content}>
        <input type="hidden" name="comment-id" value="{comment.id}">
        <button type="submit">
          {#if loadingSend}
          <div class="loader">
            <LoaderDots />
          </div>
          {:else}
            Send
          {/if}
        </button>
      </form>
    </div>
  </div>

{#if comment.replies.length !== 0}
  <div class="replies">
    <hr/>
    <ul>
      {#each comment.replies as reply (reply.id) }
        <li>
          <svelte:self 
          comment={reply}/>
        </li>
      {/each}
    </ul>
  </div>
{/if}

<style>

.chapter-info {
    font-size: var(--font-size-sm);
    color: var(--primary-color);
    margin-left: 0.5rem;
  }
  .comment-container {
    margin-block: 1rem;
    list-style: none;
    container-type: inline-size;
    container-name: comment;
  }

  .replies {
    margin-left: 40px;
  }

  .comment-head {
    display: grid;
    grid: auto-flow / 40px 80%;
    column-gap: var(--gap);
    align-items: center;
  }

  .comment-head img {
    width: 40px;
    height: 40px;
    border-radius: 50px;
    object-fit: cover;
    grid-column: 1;
    grid-row: 1/3;
  }

  .comment-head h4 {
    font-family: var(--font);
    font-weight: bold;
    font-size: var(--font-size-md);
    grid-column: 2;
    grid-row: 1;
  }

  .comment-head time {
    font-weight: 300;
    font-size: var(--font-size-sm);
    color: #4b4141;
    grid-column: 2;
    grid-row: 2;
  }

  .comment-content, .comment-response {
    margin-left: calc(40px + var(--gap));
  }

  .comment-content {
    font-size: var(--font-size-lg);
    padding-block: var(--gap);
  }

  .comment-content :global(a) {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: bold;
  }
  
  .comment-response {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
  }

  .form-like {
    display: flex;
    gap: var(--gap);
    align-items: center;
  }

  .form-like button {
    border: transparent;
    background: none;
    cursor: pointer;
    height: 18px;
  }

  .form-like .loader {
    width: 20px;
    height: 20px;
  }

  .form-like svg {
    fill: var(--primary-color);
    transition: .2s;
  }

  .form-like button:hover svg{
    fill: var(--hover-state-color);
  }

  .form-like span {
    font-size: var(--font-size-md);
    font-weight: bold;
  }

  label.reply {
    display: flex;
    gap: var(--gap);
    align-items: center;
    cursor: pointer;
  }

  label.reply svg {
    display: block;
    margin-bottom: -7px;
  }

  .form-reply {
    container-type: inline-size;
    container-name: form-reply;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    opacity: 0;
    height: 0;
    z-index: -1;
    transition-duration: .5s;
  }

  .form-reply input {
    padding: var(--padding-label);
    font-size: var(--font-size-md);
    height: 34px;
    border: transparent;
    width: 100%;
    border-radius: var(--border-radius-sm);
  }

  .form-reply button {
    margin-top: 1rem;
    padding: var(--padding-label);
    background-color: var(--primary-color);
    color: var(--alt-text-color);
    border: transparent;
    cursor: pointer;
    font-size: var(--font-size-md);
    height: 34px;
    width: 100%;
    border-radius: var(--border-radius-sm);
    text-transform: capitalize;
    transition: .2s;
  }

  .form-reply button:hover {
    background-color: var(--hover-state-color);
  }
  
  .form-reply .loader {
    width: 15px;
    margin: auto;
  } 

  .form-reply:focus-within {
    opacity: 1;
    z-index: 1;
    height: fit-content;
    transition-duration: .5s;
  }

  @container comment (min-width: 350px) {
    .replies {
      margin-left: 50px;
    }

    .comment-head {
      grid: auto-flow / 50px 80%;
    }

    .comment-head img {
      width: 50px;
      height: 50px;
    }

    .comment-content, .comment-response {
      margin-left: calc(50px + var(--gap));
    }
  }
  
  @media (hover: hover){
    .comment-content{
      padding-block: .7rem;
    }
  }
</style>