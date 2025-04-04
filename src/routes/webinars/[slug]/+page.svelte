<script>
  import { QandA, Resources } from "$lib/index.js";
  import { fade } from 'svelte/transition';
  import formatDate from '$lib/JavaScript/format-date.js';
  import { page } from '$app/stores';
  export let data;
  
  const chapters = data.webinar.chapters;
  const parsedChapters = JSON.parse(chapters);

  // Retrieves other data from diffrent tables through let and a joins structure
  let newestWebinars = data.webinars.slice(0,4).map(webinar => ({
    title: webinar.title,
    speaker: webinar.speakers.map(s => s.avl_speakers_id.fullname).join(', '),
    date: formatDate(webinar.date),
    thumbnail: webinar.thumbnail,
    slug: webinar.slug
  }));

  let showFullDescription = false;
  let showTranscript = false;

  // Assuming `data.webinar.description` contains the description text
  const description = data.webinar.description;

  // Function to truncate text
  function truncateText(text, limit = 199) {
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  }

  function nav_back() {
    window.history.back();
  }

// tijdelijke functie
import { onMount } from 'svelte';

onMount(() => {
  const video = document.querySelector('video');
  const chapterButtons = document.querySelectorAll('.goto');
  const commentLinks = document.querySelectorAll('.time-link');

  function addClickEventToButtons(buttons) {
    buttons.forEach(button => {
      button.addEventListener('click', (event) => {
        const chapterTime = parseInt(event.target.dataset.time, 10);  
        video.currentTime = chapterTime;
      });
    });
  }

  addClickEventToButtons(chapterButtons);
  addClickEventToButtons(commentLinks);
});

  // Test voor video tijd uit query parameter
  const videoStart = $page.url.searchParams.get('video-start');
</script>

<div class="bread-crumbs">
  <button type="button" on:click={nav_back} class="back-btn">Back</button>
</div>

<main>
  <div class="video-header">
    <!-- svelte-ignore a11y-media-has-caption -->
    <video controls width="250" poster="https://fdnd-agency.directus.app/assets/{data.webinar.thumbnail}?format=avif">
      <source src="https://fdnd-agency.directus.app/assets/{data.webinar.video}#t={videoStart}">
    </video>
    
    <h1>{data.webinar.title}</h1>
  
    <div class="metadata-container">
      <p class="views">
        <svg width="25" height="25" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.67213 10.2297C8.47131 10.2297 9.15061 9.95004 9.71004 9.39061C10.2695 8.83118 10.5492 8.15188 10.5492 7.3527C10.5492 6.55352 10.2695 5.87422 9.71004 5.31479C9.15061 4.75536 8.47131 4.47565 7.67213 4.47565C6.87295 4.47565 6.19365 4.75536 5.63422 5.31479C5.07479 5.87422 4.79508 6.55352 4.79508 7.3527C4.79508 8.15188 5.07479 8.83118 5.63422 9.39061C6.19365 9.95004 6.87295 10.2297 7.67213 10.2297ZM7.67213 9.07893C7.19262 9.07893 6.78504 8.9111 6.44938 8.57545C6.11373 8.23979 5.9459 7.83221 5.9459 7.3527C5.9459 6.87319 6.11373 6.46561 6.44938 6.12995C6.78504 5.7943 7.19262 5.62647 7.67213 5.62647C8.15164 5.62647 8.55922 5.7943 8.89488 6.12995C9.23053 6.46561 9.39836 6.87319 9.39836 7.3527C9.39836 7.83221 9.23053 8.23979 8.89488 8.57545C8.55922 8.9111 8.15164 9.07893 7.67213 9.07893ZM7.67213 12.1478C6.11639 12.1478 4.69918 11.7136 3.42049 10.8451C2.1418 9.97668 1.21475 8.81254 0.639343 7.3527C1.21475 5.89286 2.1418 4.72872 3.42049 3.86028C4.69918 2.99184 6.11639 2.55762 7.67213 2.55762C9.22787 2.55762 10.6451 2.99184 11.9238 3.86028C13.2025 4.72872 14.1295 5.89286 14.7049 7.3527C14.1295 8.81254 13.2025 9.97668 11.9238 10.8451C10.6451 11.7136 9.22787 12.1478 7.67213 12.1478ZM7.67213 10.8691C8.87623 10.8691 9.98176 10.5521 10.9887 9.91807C11.9957 9.28405 12.7656 8.42893 13.2984 7.3527C12.7656 6.27647 11.9957 5.42135 10.9887 4.78733C9.98176 4.15331 8.87623 3.83631 7.67213 3.83631C6.46803 3.83631 5.3625 4.15331 4.35553 4.78733C3.34856 5.42135 2.57869 6.27647 2.0459 7.3527C2.57869 8.42893 3.34856 9.28405 4.35553 9.91807C5.3625 10.5521 6.46803 10.8691 7.67213 10.8691Z"/>             
        </svg>
        {data.webinar.views} views</p>
      <p class="date">
        <svg width="25" height="25" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0_1_9241" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="25">
          <rect width="25" height="25"/>
          </mask>
          <g mask="url(#mask0_1_9241)">
          <path d="M5.52951 22.3962C5.00332 22.3962 4.55794 22.2139 4.19336 21.8493C3.82878 21.4847 3.64648 21.0393 3.64648 20.5132V6.57091C3.64648 6.04473 3.82878 5.59935 4.19336 5.23477C4.55794 4.87018 5.00332 4.68789 5.52951 4.68789H6.97182V2.48438H8.57435V4.68789H16.467V2.48438H18.0294V4.68789H19.4717C19.9979 4.68789 20.4433 4.87018 20.8079 5.23477C21.1725 5.59935 21.3548 6.04473 21.3548 6.57091V20.5132C21.3548 21.0393 21.1725 21.4847 20.8079 21.8493C20.4433 22.2139 19.9979 22.3962 19.4717 22.3962H5.52951ZM5.52951 20.8337H19.4717C19.5519 20.8337 19.6253 20.8003 19.6921 20.7335C19.7589 20.6668 19.7923 20.5933 19.7923 20.5132V10.7376H5.20896V20.5132C5.20896 20.5933 5.24234 20.6668 5.30911 20.7335C5.3759 20.8003 5.44937 20.8337 5.52951 20.8337ZM5.20896 9.17511H19.7923V6.57091C19.7923 6.49077 19.7589 6.41731 19.6921 6.35052C19.6253 6.28375 19.5519 6.25037 19.4717 6.25037H5.52951C5.44937 6.25037 5.3759 6.28375 5.30911 6.35052C5.24234 6.41731 5.20896 6.49077 5.20896 6.57091V9.17511ZM12.5006 14.6638C12.2456 14.6638 12.0282 14.574 11.8486 14.3944C11.669 14.2148 11.5792 13.9974 11.5792 13.7424C11.5792 13.4873 11.669 13.27 11.8486 13.0903C12.0282 12.9107 12.2456 12.8209 12.5006 12.8209C12.7557 12.8209 12.973 12.9107 13.1527 13.0903C13.3323 13.27 13.4221 13.4873 13.4221 13.7424C13.4221 13.9974 13.3323 14.2148 13.1527 14.3944C12.973 14.574 12.7557 14.6638 12.5006 14.6638ZM8.33396 14.6638C8.07889 14.6638 7.86155 14.574 7.68193 14.3944C7.50231 14.2148 7.4125 13.9974 7.4125 13.7424C7.4125 13.4873 7.50231 13.27 7.68193 13.0903C7.86155 12.9107 8.07889 12.8209 8.33396 12.8209C8.58903 12.8209 8.80637 12.9107 8.98599 13.0903C9.16561 13.27 9.25542 13.4873 9.25542 13.7424C9.25542 13.9974 9.16561 14.2148 8.98599 14.3944C8.80637 14.574 8.58903 14.6638 8.33396 14.6638ZM16.6673 14.6638C16.4122 14.6638 16.1949 14.574 16.0153 14.3944C15.8356 14.2148 15.7458 13.9974 15.7458 13.7424C15.7458 13.4873 15.8356 13.27 16.0153 13.0903C16.1949 12.9107 16.4122 12.8209 16.6673 12.8209C16.9224 12.8209 17.1397 12.9107 17.3193 13.0903C17.4989 13.27 17.5887 13.4873 17.5887 13.7424C17.5887 13.9974 17.4989 14.2148 17.3193 14.3944C17.1397 14.574 16.9224 14.6638 16.6673 14.6638ZM12.5006 18.7504C12.2456 18.7504 12.0282 18.6606 11.8486 18.4809C11.669 18.3013 11.5792 18.084 11.5792 17.8289C11.5792 17.5738 11.669 17.3565 11.8486 17.1769C12.0282 16.9972 12.2456 16.9074 12.5006 16.9074C12.7557 16.9074 12.973 16.9972 13.1527 17.1769C13.3323 17.3565 13.4221 17.5738 13.4221 17.8289C13.4221 18.084 13.3323 18.3013 13.1527 18.4809C12.973 18.6606 12.7557 18.7504 12.5006 18.7504ZM8.33396 18.7504C8.07889 18.7504 7.86155 18.6606 7.68193 18.4809C7.50231 18.3013 7.4125 18.084 7.4125 17.8289C7.4125 17.5738 7.50231 17.3565 7.68193 17.1769C7.86155 16.9972 8.07889 16.9074 8.33396 16.9074C8.58903 16.9074 8.80637 16.9972 8.98599 17.1769C9.16561 17.3565 9.25542 17.5738 9.25542 17.8289C9.25542 18.084 9.16561 18.3013 8.98599 18.4809C8.80637 18.6606 8.58903 18.7504 8.33396 18.7504ZM16.6673 18.7504C16.4122 18.7504 16.1949 18.6606 16.0153 18.4809C15.8356 18.3013 15.7458 18.084 15.7458 17.8289C15.7458 17.5738 15.8356 17.3565 16.0153 17.1769C16.1949 16.9972 16.4122 16.9074 16.6673 16.9074C16.9224 16.9074 17.1397 16.9972 17.3193 17.1769C17.4989 17.3565 17.5887 17.5738 17.5887 17.8289C17.5887 18.084 17.4989 18.3013 17.3193 18.4809C17.1397 18.6606 16.9224 18.7504 16.6673 18.7504Z"/>
          </g>
        </svg>          
        {data.webinar.date}</p>
    </div>

    <div class="categories">
      {#each data.webinar.categories as category}
        <p class="category">{category.avl_categories_id.name}</p>
      {/each} 
    </div>
  </div>

  <section class="chapters">
    <h2>Chapters</h2>
    <ul>
      {#each parsedChapters as chapter}
        <li>
          <a href="?video-start={chapter.time_seconds}" class="goto" data-time={chapter.time_seconds} title="{chapter.title_number}" data-sveltekit-noscroll>
            <span>{chapter.title_number.slice(7)}</span>
            <div></div>
            <span>{chapter.title}</span>
          </a>
        </li>
      {/each}
    </ul>
  </section>

  <button type="button" class="transcript-btn" on:click={() => {showTranscript = !showTranscript;}}>
    {showTranscript ? "Close Transcript" : "Read Transcript"}  
  </button>

  {#if showTranscript}
    <section class="transcript" transition:fade>
      <h2>Transcript</h2>
      {@html data.webinar.transcript}
    </section>
  {/if}

  <div class="description">
    <!-- Dynamically update the content based on `showFullDescription` -->
    {#if showFullDescription}
      {@html description}
    {:else}
      {@html truncateText(description)}
    {/if}
  </div>

  <button on:click={() => {showFullDescription = !showFullDescription;}} class="expand-text-btn">
    {showFullDescription ? "Read Less" : "Read More"}
  </button>
  
  <article class='speakers'>
    {#if data.webinar.speakers.length > 1}
      <h2>The speakers</h2>
    {:else}
      <h2>The speaker</h2>
    {/if}

    {#each data.webinar.speakers as speaker}
      <section class="speaker-info">
        <img src="https://fdnd-agency.directus.app/assets/{speaker.avl_speakers_id.profile_picture}?format=avif" alt="{speaker.avl_speakers_id.fullname}" width="90" height="90">

        <div>
          <h3>{speaker.avl_speakers_id.fullname}</h3>
          <p>{speaker.avl_speakers_id.entitle}</p>
        </div>

        <a href="/speakers/{speaker.avl_speakers_id.slug}">
          <svg xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="30" height="30" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="var(--alt-text-color)" />
            <path d="M24,4C12.972,4,4,12.972,4,24s8.972,20,20,20s20-8.972,20-20S35.028,4,24,4z M25.5,33.5c0,0.828-0.672,1.5-1.5,1.5	s-1.5-0.672-1.5-1.5v-11c0-0.828,0.672-1.5,1.5-1.5s1.5,0.672,1.5,1.5V33.5z M24,18c-1.105,0-2-0.895-2-2c0-1.105,0.895-2,2-2	s2,0.895,2,2C26,17.105,25.105,18,24,18z"></path>
          </svg>
          <span>About this speaker</span>
        </a>
      </section>
    {/each}
  </article>

  <div class="resources">
    <Resources 
      heading = "Resources"
      resources = {data.webinar.resources}
    />
  </div>

  <div class='q-a'>
    <QandA 
      comments = {data.comments} parsedChapters={parsedChapters} />
  </div>

  <div class="watch-next">
    <h2>Watch next</h2>
    <ul class="carousel">
      {#each newestWebinars as webinar}
        <li>
          <a href="/webinars/{webinar.slug}">
            <img src="https://fdnd-agency.directus.app/assets/{webinar.thumbnail.id}?width=384&fit=cover&format=avif" alt={webinar.title} width="384" height="384" loading="lazy">
            <div>
              <h3>{webinar.title}</h3>
                <p>{webinar.speaker}</p>
                <p>{webinar.date}</p>
            </div>
          </a>
        </li>
      {/each}
    </ul>
  </div>
</main>

<style>
  main {
    margin-block: 1rem;
    margin-bottom: 6rem;
  }

  .bread-crumbs {
    width: 85vw;
    margin: 0 auto;
  }

  .description :global(p) {
    padding-block: 0.2rem;
  }

  .video-header {
    width: 90vw
  }

  video {
    width: 100%;
    margin: 0 auto;
  }

  h1 {
    margin-block: 1rem;
    font-size: var(--font-size-xl);
    line-height: 1.2;
  }

  .metadata-container,
  .categories {
    display: flex;
    margin-bottom: .7rem;
    gap: 1rem;
  }

  .metadata-container .views,
  .metadata-container .date {
    display: flex;
    align-items: center;
    gap: .3rem;
    color: var(--primary-color);
    fill: var(--primary-color);
    font-weight: 300;
  }

  .categories .category {
    padding: var(--padding-label);
    width: fit-content;
    background-color: var(--background-category-color);
    border-radius: var(--border-radius-sm);
    text-transform: capitalize;
  }

  .chapters ul {
    display: flex;
    overflow: auto;
  }

  .chapters ul li{
    display: flex;
    min-width: 25%;
    flex-direction: column;
  }

  .chapters ul li .goto{
    display: flex;
    align-items: center;
    width: 100%;
    height: auto;
    flex-direction: column; 
    background-color: transparent;
    text-decoration: none;
  }

  .chapters ul li .goto div{
    border-top: dotted 3px;
    height: 3px;
    width: 99%;
    position: relative;
    margin: 5px 0 2px 0;
  }

  .chapters ul li .goto div::after{
    content: '';
    display: inline-block;
    position: absolute;
    width: 12px;
    height: 12px;
    background-color: var(--primary-color);
    border-radius: 50%;
    bottom: -5px;
    left: 50%;
    translate: -50% 0;
  } 

  .chapters ul li .goto:hover div::after{
    scale: 1.7;
    transition: .2s;
  }

  .chapters ul li .goto span:first-child{
    font-size: var(--font-size-xl);
    color: var(--primary-color);
    position: relative;
  }

  .chapters ul li .goto span:last-child{
    font-size: var(--font-size-lg);
    color: var(--text-color);
  }

  .chapters ul li .goto *{
    pointer-events: none;
  }

  button {
    margin-block: 1rem;
    background-color: var(--primary-color);
    color: var(--alt-text-color);
    border: transparent;
    cursor: pointer;
    font-size: var(--font-size-md);
    width: fit-content;
    height: 34px;
    padding: 0.4rem 0.8em;
    border-radius: var(--border-radius-sm);
    text-transform: capitalize;
    transition: .2s;
  }

  button:hover {
    background-color: var(--hover-state-color);
  }

  .transcript-btn {
    width: 100%;
  }

  .transcript {
    max-height: 200px;
    overflow-y: scroll;
    scrollbar-width: 12px;
    scrollbar-color: var(--primary-color) var(--background-category-color);
    margin: 1rem;
  }

  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 12px;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: var(--border-radius-sm);
  }

  ::-webkit-scrollbar-track {
    background: var(--background-category-color);
    border-radius: var(--border-radius-sm);
  }

  .speakers {
    padding-block: 2rem;
    max-width: 900px;
    display: grid;
    gap: 1rem;
  }

  .speaker-info {
    display: flex;
    align-items: center;
    gap: var(--gap);
  }

  .speaker-info img {
    object-fit: cover;
    border-radius: 50%;
    width: 50px;
    height: 50px;
  }

  .speaker-info div {
    width: 70%;
  }

  .speaker-info p {
    font-weight: 300;
    font-size: var(--font-size-sm);
  }

  .speaker-info a {
    width: fit-content;
    text-decoration: none;
    color: var(--primary-color);
  }

  .speaker-info a svg {
    fill: var(--primary-color);
  }

  .speaker-info a span {
    display: none;
  }
  
  .q-a {
    width: 90vw;
    max-width: 500px;
    margin: 1rem auto;
  }

  .watch-next{
    height: auto;
    max-width: 500px;
    width: 90vw;
    margin: 1rem auto;
    position: relative;
  }

  .watch-next a{
    text-decoration: none;
  }

  .watch-next ul{
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-left: 10px;
    scroll-behavior: smooth;
    margin: 0 auto;
    gap: 10px;
    padding: 10px 0;
    transition: all .3s ease;
  }

  .watch-next li{
    flex: 0 0 calc(100% - 20%);
    scroll-snap-align: start;
    border-radius: 10px;
    box-sizing: border-box;
  }

  .watch-next img{
    grid-area: a;
    height: auto;
    width: 200px;
    border-radius: 10px;
  }

  .watch-next h3, p{
    grid-area: b;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .watch-next a{
    color: var(--text-color);
  }

  @media only screen and (min-width: 900px){
    h1 {
      font-size: var(--font-size-2xl);
      line-height: 1;
    }

    .speaker-info {
      gap: 1rem;
    }

    .speaker-info img {
      width: 70px;
      height: 70px;
    }

    .speaker-info div{
      width: 65%;
    }

    .speaker-info a:hover {
      text-decoration: underline;
    }

    .speaker-info a svg {
      display: none;
    }

    .speaker-info a span {
      display: block;
    }

    .speaker-info a span::after {
      content: '>';
      padding-inline-start: 10px;
    }
  }

  @media only screen and (min-width: 1080px) {
    main {
      display: grid;
      grid-template-columns: 55% 40%;
      column-gap: 3rem;
    }

    .video-header {
      width: 100%;
    }
    
    .video-header,
    .description,
    .expand-text-btn,
    .speakers,
    .resources {
      grid-column: 1;
    }

    .q-a {
      grid-column: 2;
      grid-row: 1/2;
      width: 100%;
      margin-top: 0;
    }

    .watch-next{
      grid-row: 2/10;
      grid-column: 2;
      width: 100%;
    }

    .watch-next ul{
      display: grid;
    }

    .watch-next li{
      display: flex;
      justify-content: start;
      align-items: center;
    }

    .watch-next p, h3{
      margin: 10px 0px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      word-break: break-all;
      overflow: hidden;
      color: var(--text-color);
      transition: .2s;
      text-overflow: ellipsis;
    }
    
    .watch-next a{
      text-decoration: none;
      margin: 10px 0;
      transition: .2s;
      border-bottom: 2px solid var(--primary-color);
    }

    .watch-next a:hover h3,
    .watch-next a:hover p {
      color: var(--hover-state-color);
    }

    .watch-next img{
      width: 384px;
      height: auto;
    }
  }
</style>
