<footer>
  <div>
    <p>&copy; 2024 - Antoni van Leeuwenhoek</p>
    <ul class="dot-divider">
      <li>
        <a href="/">Disclaimer</a>
      </li>
      <li>
        <a href="/">Privacystatement</a>
      </li>
      <li>
        <a href="/">Cookiestatement</a>
      </li>
    </ul>
    <picture>
      <img src="/images/AVL-Logo-white.svg" alt="Antoni van Leeuwenhoek">
      <img src="/images/kemenkessardjito.png" alt="kemenkes ziekenhuis">
    </picture>
  </div>
</footer>

<style>
  footer {
    display: none;
  }

  @media only screen and (min-width: 1080px) {
    footer {
      display: flex;
      position: sticky;
      bottom: 0;
      align-items: center;
      justify-content: space-between;
      background-color: var(--primary-color);
      padding: 1rem 0rem;
      color: var(--alt-text-color);
    }

    footer ul {
      display: flex;
    }
    
    footer li {
      padding: 0 0.8rem;
      position: relative;
    }
    
    footer div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 auto;
      width: 85vw;
    }

    footer img {
      height: 3.2rem;
    }

    footer a {
      font-weight: normal;
      color: var(--alt-text-color);
      text-decoration: none;
    }

    footer a:hover {
      text-decoration: underline;
    }
    
    .dot-divider li::after {
      content: '•';
      position: absolute;
      right: -0.2rem;
      top: 50%;
      transform: translateY(-50%);
    }

    .dot-divider li:last-child::after {
      content: '';
    }
  }
</style>
